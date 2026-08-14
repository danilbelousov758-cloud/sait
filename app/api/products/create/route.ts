import { NextRequest, NextResponse } from "next/server";

import {
    S3Client,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

import { db } from "@/lib/mysql";



const s3 = new S3Client({

    region:
        process.env.S3_REGION || "ru-1",

    endpoint:
        process.env.S3_ENDPOINT,

    forcePathStyle: true,

    credentials: {

        accessKeyId:
            process.env.S3_ACCESS_KEY || "",

        secretAccessKey:
            process.env.S3_SECRET_KEY || "",

    },

});





async function uploadFile(
    file: File,
    folder: string
) {

    const bucket =
        process.env.S3_BUCKET;


    if (!bucket) {

        throw new Error(
            "S3_BUCKET не найден в .env.local"
        );

    }



    const buffer =
        Buffer.from(
            await file.arrayBuffer()
        );



    const fileName =
        file.name.replace(
            /[^a-zA-Z0-9._-]/g,
            "-"
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
            "S3 BUCKET:",
            process.env.S3_BUCKET
        );


        console.log(
            "S3 ENDPOINT:",
            process.env.S3_ENDPOINT
        );



        const form =
            await request.formData();





        const name =
            String(
                form.get("name") || ""
            );



        const category =
            String(
                form.get("category") ||
                form.get("path") ||
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



        const dffValue =
            form.get("dff");


        const txdValue =
            form.get("txd");



        const dff =
            dffValue instanceof File
                ? dffValue
                : null;



        const txd =
            txdValue instanceof File
                ? txdValue
                : null;




        const images =
            form
                .getAll("images")
                .filter(
                    (
                        item
                    ): item is File =>
                        item instanceof File
                );








        if (!name.trim()) {

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
                        "Необходимо загрузить DFF и TXD"
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
                        "Автор товара не найден"
                },

                {
                    status:400
                }

            );

        }







        const folder =

            `products/${authorId}/${Date.now()}`;







        const dffUrl =
            await uploadFile(
                dff,
                folder
            );



        const txdUrl =
            await uploadFile(
                txd,
                folder
            );





        const imageUrls:string[] = [];



        for (
            const image of images
        ) {


            if (
                image.size <= 0
            ) continue;



            const url =
                await uploadFile(

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








        return NextResponse.json(

            {

                success:true,

                message:
                    "Товар создан"

            },

            {

                status:200

            }

        );





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