import { NextRequest, NextResponse } from "next/server";

import {
    S3Client,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

import { db } from "@/lib/mysql";



const s3 = new S3Client({

    endpoint:
        process.env.S3_ENDPOINT,

    region:
        process.env.S3_REGION || "ru-1",

    forcePathStyle:
        true,

    credentials: {

        accessKeyId:
            process.env.S3_ACCESS_KEY || "",

        secretAccessKey:
            process.env.S3_SECRET_KEY || "",

    },

});





async function uploadToS3(
    file: File,
    folder: string
) {

    const bucket =
        process.env.S3_BUCKET;



    if (!bucket) {

        throw new Error(
            "S3_BUCKET не найден"
        );

    }



    const buffer =
        Buffer.from(
            await file.arrayBuffer()
        );



    const fileName =
        file.name
            .replace(
                /[^a-zA-Z0-9._-]/g,
                "_"
            );



    const key =
        `${folder}/${Date.now()}-${fileName}`;




    await s3.send(

        new PutObjectCommand({

            Bucket:
                bucket,

            Key:
                key,

            Body:
                buffer,

            ContentType:
                file.type ||
                "application/octet-stream",

        })

    );



    return (
        `${process.env.S3_ENDPOINT}/${bucket}/${key}`
    );

}







export async function POST(
    request: NextRequest
) {


    try {


        console.log(
            "S3 CHECK:",
            {
                endpoint:
                    process.env.S3_ENDPOINT,

                bucket:
                    process.env.S3_BUCKET,

                region:
                    process.env.S3_REGION,
            }
        );





        const form =
            await request.formData();





        const name =
            String(
                form.get("name") || ""
            );



        const category =
            String(
                form.get("path") ||
                form.get("category") ||
                ""
            );



        const price =
            Number(
                form.get("price") || 0
            );



        const description =
            String(
                form.get("description") || ""
            );



        const pinned =
            form.get("pinned") === "true";



        const authorId =
            Number(
                form.get("author_id")
            );





        const dffData =
            form.get("dff");


        const txdData =
            form.get("txd");



        const dff =
            dffData instanceof File
                ? dffData
                : null;



        const txd =
            txdData instanceof File
                ? txdData
                : null;





        const images =
            form
                .getAll("images")
                .filter(
                    (
                        file
                    ): file is File =>
                        file instanceof File
                );







        if (!name) {

            return NextResponse.json(

                {
                    message:
                        "Введите название товара"
                },

                {
                    status:400
                }

            );

        }





        if (!dff || !txd) {

            return NextResponse.json(

                {
                    message:
                        "DFF и TXD обязательны"
                },

                {
                    status:400
                }

            );

        }





        if (!authorId) {

            return NextResponse.json(

                {
                    message:
                        "Не найден автор товара"
                },

                {
                    status:400
                }

            );

        }







        const folder =

            `products/${authorId}/${Date.now()}`;






        const dffUrl =
            await uploadToS3(
                dff,
                folder
            );



        const txdUrl =
            await uploadToS3(
                txd,
                folder
            );





        const imageUrls:string[] = [];



        for (
            const image of images
        ) {


            const url =
                await uploadToS3(

                    image,

                    `${folder}/images`

                );



            imageUrls.push(
                url
            );

        }








        await db.execute(

            `
            INSERT INTO products
            (
                name,
                category,
                price,
                description,
                pinned,
                dff_file,
                txd_file,
                images,
                author_id,
                status,
                created_at
            )

            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                NOW()
            )
            `,


            [

                name,

                category,

                price,

                description,

                pinned
                    ? 1
                    : 0,

                dffUrl,

                txdUrl,

                JSON.stringify(
                    imageUrls
                ),

                authorId,

                "ACTIVE"

            ]

        );







        return NextResponse.json({

            success:true,

            message:
                "Товар успешно создан"

        });





    }
    catch(error) {


        console.error(
            "CREATE PRODUCT ERROR:",
            error
        );



        return NextResponse.json(

            {

                success:false,

                message:
                    error instanceof Error
                        ? error.message
                        : "Ошибка сервера"

            },

            {

                status:500

            }

        );

    }

}