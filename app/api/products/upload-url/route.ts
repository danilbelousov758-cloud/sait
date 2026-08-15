import { NextRequest, NextResponse } from "next/server";

import {
    S3Client,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

import {
    getSignedUrl,
} from "@aws-sdk/s3-request-presigner";


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



export async function POST(
    request: NextRequest
) {

    try {

        const body =
            await request.json();


        const fileName =
            String(
                body.fileName || ""
            ).trim();


        const contentType =
            String(
                body.contentType ||
                "application/octet-stream"
            );


        const folder =
            String(
                body.folder || ""
            ).trim();


        if (!fileName) {

            return NextResponse.json(

                {
                    success: false,
                    message: "Не указано имя файла",
                },

                {
                    status: 400,
                }

            );

        }


        const bucket =
            process.env.S3_BUCKET;


        if (!bucket) {

            return NextResponse.json(

                {
                    success: false,
                    message: "S3_BUCKET не найден",
                },

                {
                    status: 500,
                }

            );

        }


        if (
            !process.env.S3_ACCESS_KEY ||
            !process.env.S3_SECRET_KEY ||
            !process.env.S3_ENDPOINT
        ) {

            return NextResponse.json(

                {
                    success: false,
                    message:
                        "S3 ключи или endpoint не настроены",
                },

                {
                    status: 500,
                }

            );

        }



        const safeFileName =
            fileName.replace(
                /[^a-zA-Z0-9._-]/g,
                "_"
            );



        const key =

            folder

                ? `${folder}/${Date.now()}-${safeFileName}`

                : `uploads/${Date.now()}-${safeFileName}`;



        const command =
            new PutObjectCommand({

                Bucket:
                    bucket,

                Key:
                    key,

                ContentType:
                    contentType,

            });



        const uploadUrl =
            await getSignedUrl(
                s3,
                command,
                {
                    expiresIn: 900,
                }
            );



        const publicUrl =

            `${process.env.S3_ENDPOINT}/${bucket}/${key}`;



        return NextResponse.json({

            success: true,

            uploadUrl,

            url:
                publicUrl,

            key,

        });


    } catch (error) {


        console.error(
            "UPLOAD URL ERROR:",
            error
        );


        return NextResponse.json(

            {

                success: false,

                message:
                    error instanceof Error
                        ? error.message
                        : "Ошибка создания URL",

            },

            {

                status: 500,

            }

        );

    }

}