import { NextRequest, NextResponse } from "next/server";

import {
    S3Client,
    GetObjectCommand,
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


function cleanZipName(
    name: string
) {

    return name

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

        || "mod";

}


function getS3Key(
    value: string
) {

    if (!value) {
        return "";
    }


    try {

        const url =
            new URL(value);

        let pathname =
            decodeURIComponent(
                url.pathname
            );


        pathname =
            pathname.replace(
                /^\/+/,
                ""
            );


        if (
            bucket &&
            pathname.startsWith(
                `${bucket}/`
            )
        ) {

            pathname =
                pathname.slice(
                    bucket.length + 1
                );

        }


        return pathname;

    } catch {

        return value.replace(
            /^\/+/,
            ""
        );

    }

}


export async function GET(
    request: NextRequest,
    context: {
        params: Promise<{
            id: string;
        }>;
    }
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
                        "S3 не настроен",
                },

                {
                    status: 500,
                }

            );

        }


        const {
            id,
        } =
            await context.params;


        const productId =
            Number(id);


        if (
            !Number.isInteger(
                productId
            ) ||
            productId <= 0
        ) {

            return NextResponse.json(

                {
                    success: false,

                    message:
                        "Некорректный ID товара",
                },

                {
                    status: 400,
                }

            );

        }


        const mysql =
            await import(
                "@/lib/mysql"
            );


        const [
            rows,
        ] =
            await mysql.db.execute(

                `
                SELECT
                    id,
                    name,
                    zip_file,
                    status

                FROM products

                WHERE id = ?

                LIMIT 1
                `,

                [
                    productId,
                ]

            );


        const products =
            rows as Array<{

                id: number;

                name: string;

                zip_file:
                    string | null;

                status:
                    string | null;

            }>;


        const product =
            products[0];


        if (!product) {

            return NextResponse.json(

                {
                    success: false,

                    message:
                        "Мод не найден",
                },

                {
                    status: 404,
                }

            );

        }


        if (
            product.status &&
            product.status !== "ACTIVE"
        ) {

            return NextResponse.json(

                {
                    success: false,

                    message:
                        "Этот мод недоступен для скачивания",
                },

                {
                    status: 403,
                }

            );

        }


        /*
         * ZIP должен существовать.
         */

        if (
            !product.zip_file
        ) {

            return NextResponse.json(

                {
                    success: false,

                    message:
                        "ZIP для этого мода ещё не создан",
                },

                {
                    status: 404,
                }

            );

        }


        const key =
            getS3Key(
                product.zip_file
            );


        if (!key) {

            return NextResponse.json(

                {
                    success: false,

                    message:
                        "Некорректный путь ZIP",
                },

                {
                    status: 500,
                }

            );

        }


        const zipName =
            `${cleanZipName(
                product.name
            )}.zip`;


        /*
         * Создаём только временную
         * подписанную ссылку.
         *
         * Сам ZIP через сервер
         * НЕ проходит.
         */

        const downloadUrl =
            await getSignedUrl(

                s3,

                new GetObjectCommand({

                    Bucket:
                        bucket,

                    Key:
                        key,

                    ResponseContentType:
                        "application/zip",

                    ResponseContentDisposition:
                        `attachment; filename="${encodeURIComponent(
                            zipName
                        )}"; filename*=UTF-8''${encodeURIComponent(
                            zipName
                        )}`,

                }),

                {
                    expiresIn:
                        60 * 15,
                }

            );


        /*
         * Редиректим пользователя
         * непосредственно на S3.
         */

        return NextResponse.redirect(
            downloadUrl
        );

    } catch (error) {

        console.error(
            "DOWNLOAD ZIP ERROR:",
            error
        );


        return NextResponse.json(

            {
                success: false,

                message:
                    error instanceof Error
                        ? error.message
                        : "Ошибка скачивания ZIP",
            },

            {
                status: 500,
            }

        );

    }

}