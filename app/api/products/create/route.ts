import { NextRequest, NextResponse } from "next/server";

import {
    S3Client,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

import { db } from "@/lib/mysql";



const s3 = new S3Client({

    region:
        process.env.S3_REGION,

    endpoint:
        process.env.S3_ENDPOINT,

    credentials: {

        accessKeyId:
            process.env.S3_ACCESS_KEY!,

        secretAccessKey:
            process.env.S3_SECRET_KEY!,

    },

});





async function uploadFile(
    file: File,
    folder: string
) {

    const buffer =
        Buffer.from(
            await file.arrayBuffer()
        );


    const safeName =
        file.name.replace(
            /[^a-zA-Z0-9._-]/g,
            "-"
        );


    const key =
        `${folder}/${Date.now()}-${safeName}`;



    await s3.send(

        new PutObjectCommand({

            Bucket:
                process.env.S3_BUCKET!,


            Key:
                key,


            Body:
                buffer,


            ContentType:
                file.type || "application/octet-stream",


        })

    );



    return (
        `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`
    );

}






export async function POST(
    request: NextRequest
) {


    try {


        const form =
            await request.formData();





        const name =
            String(
                form.get("name") || ""
            );



        const category =
            String(
                form.get("path") || ""
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
            form.get("pinned")
            ===
            "true";



        const authorId =
            Number(
                form.get("author_id")
            );





        const dff =
            form.get("dff") as File | null;



        const txd =
            form.get("txd") as File | null;



        const images =
            form.getAll(
                "images"
            ) as File[];






        if(!name){

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





        if(!dff || !txd){

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






        if(!authorId){

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






        const folderName =
            name
                .toLowerCase()
                .replace(
                    /[^a-z0-9а-яё]+/gi,
                    "-"
                );



        const folder =
            `products/${authorId}/${folderName}-${Date.now()}`;







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



        for(
            const image of images
        ){

            if(
                image.size === 0
            ){
                continue;
            }



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
                    ?
                    1
                    :
                    0,


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
                    "Товар успешно создан"
            }

        );




    } catch(error){


        console.error(
            "CREATE PRODUCT ERROR:",
            error
        );



        return NextResponse.json(

            {
                success:false,
                message:
                    "Ошибка сервера при создании товара"
            },

            {
                status:500
            }

        );

    }


}