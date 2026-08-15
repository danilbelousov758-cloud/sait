import { NextRequest, NextResponse } from "next/server";

import {
    S3Client,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

import {
    getSignedUrl,
} from "@aws-sdk/s3-request-presigner";


const endpoint =
    process.env.S3_ENDPOINT;

const bucket =
    process.env.S3_BUCKET;

const region =
    process.env.S3_REGION || "ru-1";

const accessKeyId =
    process.env.S3_ACCESS_KEY;

const secretAccessKey =
    process.env.S3_SECRET_KEY;


const s3 = new S3Client({

    endpoint,

    region,

    forcePathStyle: true,

    credentials: {

        accessKeyId:
            accessKeyId || "",

        secretAccessKey:
            secretAccessKey || "",

    },

});



function cleanFileName(
    fileName: string
) {

    return fileName
        .replace(
            /[^a-zA-Z0-9._-]/g,
            "_"
        )
        .replace(
            /\.{2,}/g,
            "."
        );

}



export async function POST(
    request: NextRequest
) {

    try {

        if (
            !endpoint ||
            !bucket ||
            !accessKeyId ||
            !secretAccessKey
        ) {

            return NextResponse.json(

                {
                    success: false,
                    message:
                        "S3 не настроен. Проверь S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY и S3_SECRET_KEY.",
                },

                {
                    status: 500,
                }

            );

        }



        const body =
            await request.json();



        const fileName =
            String(
                body.fileName || ""
            );



        const contentType =
            String(
                body.contentType ||
                "application/octet-stream"
            );



        const folder =
            String(
                body.folder || ""
            );



        if (!fileName) {

            return NextResponse.json(

                {
                    success: false,
                    message:
                        "Не указано имя файла",
                },

                {
                    status: 400,
                }

            );

        }



        if (!folder) {

            return NextResponse.json(

                {
                    success: false,
                    message:
                        "Не указана папка",
                },

                {
                    status: 400,
                }

            );

        }



        const safeFileName =
            cleanFileName(
                fileName
            );



        const key =
            `${folder}/${Date.now()}-${safeFileName}`;



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
                    expiresIn: 60 * 15,
                }
            );



        const fileUrl =
            `${endpoint}/${bucket}/${key}`;



        return NextResponse.json({

            success: true,

            uploadUrl,

            fileUrl,

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
                        : "Ошибка создания ссылки S3",
            },

            {
                status: 500,
            }

        );

    }

}