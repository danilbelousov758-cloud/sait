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


const s3 =
    new S3Client({

        endpoint,

        region,

        forcePathStyle:
            true,

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
            /[<>:"/\\|?*\x00-\x1F]/g,
            "_"
        )

        .replace(
            /\s+/g,
            " "
        )

        .trim()

        .replace(
            /\.+$/g,
            ""
        )

        || "file";

}


function cleanFolder(
    folder: string
) {

    return folder

        .replace(
            /\\/g,
            "/"
        )

        .replace(
            /^\/+/,
            ""
        )

        .replace(
            /\/+/g,
            "/"
        )

        .replace(
            /[^a-zA-Z0-9_\-./]/g,
            "_"
        )

        .replace(
            /\/+$/g,
            ""

        );

}


function getPublicUrl(
    key: string
) {

    if (!endpoint || !bucket) {

        return "";

    }


    const base =
        endpoint.replace(
            /\/+$/,
            ""
        );


    /*
     * Так как у клиента
     * forcePathStyle = true,
     * используем:
     *
     * endpoint/bucket/key
     */

    return (
        `${base}/` +
        `${bucket}/` +
        key
    );

}


export async function POST(
    request: NextRequest
) {

    try {

        /*
         * Проверяем настройки S3.
         */

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


        /*
         * Получаем данные
         * от страницы создания товара.
         */

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
            ).trim();


        const folder =
            String(
                body.folder || ""
            ).trim();


        /*
         * Проверяем имя файла.
         */

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


        /*
         * Проверяем папку.
         */

        if (!folder) {

            return NextResponse.json(

                {
                    success: false,

                    message:
                        "Не указана папка загрузки",
                },

                {
                    status: 400,
                }

            );

        }


        const safeFolder =
            cleanFolder(
                folder
            );


        const safeFileName =
            cleanFileName(
                fileName
            );


        if (!safeFolder) {

            return NextResponse.json(

                {
                    success: false,

                    message:
                        "Некорректная папка загрузки",
                },

                {
                    status: 400,
                }

            );

        }


        /*
         * Формируем настоящий
         * S3 Object Key.
         *
         * Например:
         *
         * products/12/1755260000000/
         * BMW.dff
         *
         * products/12/1755260000000/
         * archive/BMW.zip
         */

        const key =
            `${safeFolder}/${safeFileName}`;


        /*
         * Создаём команду загрузки.
         *
         * Сам файл через этот API
         * НЕ проходит.
         *
         * Браузер загрузит его
         * напрямую в S3.
         */

        const command =
            new PutObjectCommand({

                Bucket:
                    bucket,

                Key:
                    key,

                ContentType:
                    contentType,

            });


        /*
         * Создаём временный URL.
         *
         * 15 минут достаточно,
         * чтобы браузер успел
         * загрузить файл.
         */

        const uploadUrl =
            await getSignedUrl(

                s3,

                command,

                {

                    expiresIn:
                        60 * 15,

                }

            );


        /*
         * URL самого объекта.
         *
         * Именно его мы сохраняем
         * в products.dff_file,
         * products.txd_file,
         * products.zip_file.
         */

        const url =
            getPublicUrl(
                key
            );


        if (!url) {

            return NextResponse.json(

                {
                    success: false,

                    message:
                        "Не удалось сформировать URL S3",
                },

                {
                    status: 500,
                }

            );

        }


        console.log(
            "S3 UPLOAD URL CREATED:",
            {
                bucket,
                key,
                contentType,
            }
        );


        return NextResponse.json({

            success:
                true,

            uploadUrl,

            url,

            key,

        });

    } catch (error) {

        console.error(
            "S3 UPLOAD URL ERROR:",
            error
        );


        return NextResponse.json(

            {
                success: false,

                message:
                    error instanceof Error
                        ? error.message
                        : "Не удалось создать URL загрузки S3",
            },

            {
                status: 500,
            }

        );

    }

}