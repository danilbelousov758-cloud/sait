import { NextRequest, NextResponse } from "next/server";

import {
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

import {
    getSignedUrl,
} from "@aws-sdk/s3-request-presigner";

import JSZip from "jszip";


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


function getFileName(
    value: string | null
) {

    if (!value) {
        return null;
    }


    let fileName = "";


    try {

        const url =
            new URL(value);

        const pathname =
            decodeURIComponent(
                url.pathname
            );

        const parts =
            pathname
                .split("/")
                .filter(Boolean);

        fileName =
            parts[
                parts.length - 1
            ] || "";

    } catch {

        const parts =
            value
                .split("/")
                .filter(Boolean);

        fileName =
            parts[
                parts.length - 1
            ] || "";

    }


    if (!fileName) {
        return null;
    }


    /*
     * Убираем timestamp,
     * который добавляется при загрузке.
     *
     * Например:
     *
     * 1755261234567-skin.dff
     *
     * превращается в:
     *
     * skin.dff
     */

    fileName =
        fileName.replace(
            /^\d{10,}[-_]/,
            ""
        );


    return fileName || null;

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


async function getS3File(
    value: string
) {

    const key =
        getS3Key(value);


    if (!key) {
        throw new Error(
            "Пустой S3 key"
        );
    }


    const command =
        new GetObjectCommand({

            Bucket:
                bucket,

            Key:
                key,

        });


    const result =
        await s3.send(
            command
        );


    if (!result.Body) {

        throw new Error(
            `Файл не найден в S3: ${key}`
        );

    }


    const bytes =
        await result.Body
            .transformToByteArray();


    return bytes;

}


export async function POST(
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
                        "S3 не настроен. Проверь S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY и S3_SECRET_KEY.",
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
                    dff_file,
                    txd_file,
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

                dff_file:
                    string | null;

                txd_file:
                    string | null;

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


        /*
         * Если ZIP уже существует,
         * второй раз его не создаём.
         */

        if (
            product.zip_file
        ) {

            return NextResponse.json({

                success: true,

                alreadyExists:
                    true,

                zipFile:
                    product.zip_file,

                message:
                    "ZIP уже существует",

            });

        }


        if (
            !product.dff_file &&
            !product.txd_file
        ) {

            return NextResponse.json(

                {
                    success: false,

                    message:
                        "У мода нет DFF и TXD файлов",
                },

                {
                    status: 404,
                }

            );

        }


        /*
         * Создаём ZIP.
         */

        const zip =
            new JSZip();


        let filesCount =
            0;


        /*
         * DFF
         */

        if (
            product.dff_file
        ) {

            const bytes =
                await getS3File(
                    product.dff_file
                );


            const fileName =
                getFileName(
                    product.dff_file
                );


            if (fileName) {

                zip.file(
                    fileName,
                    bytes
                );

                filesCount++;

            }

        }


        /*
         * TXD
         */

        if (
            product.txd_file
        ) {

            const bytes =
                await getS3File(
                    product.txd_file
                );


            const fileName =
                getFileName(
                    product.txd_file
                );


            if (fileName) {

                zip.file(
                    fileName,
                    bytes
                );

                filesCount++;

            }

        }


        if (
            filesCount === 0
        ) {

            return NextResponse.json(

                {
                    success: false,

                    message:
                        "Не удалось добавить файлы в ZIP",
                },

                {
                    status: 500,
                }

            );

        }


        /*
         * Генерируем ZIP.
         */

        const zipBytes =
            await zip.generateAsync({

                type:
                    "uint8array",

                compression:
                    "DEFLATE",

                compressionOptions: {

                    level: 6,

                },

            });


        /*
         * Название ZIP.
         */

        const zipName =
            `${cleanZipName(
                product.name
            )}.zip`;


        /*
         * Храним ZIP отдельно
         * от исходных файлов.
         */

        const zipKey =
            `mods/${product.id}/zip/${zipName}`;


        /*
         * Загружаем готовый ZIP
         * в S3.
         */

        await s3.send(

            new PutObjectCommand({

                Bucket:
                    bucket,

                Key:
                    zipKey,

                Body:
                    zipBytes,

                ContentType:
                    "application/zip",

                ContentLength:
                    zipBytes.length,

            })

        );


        /*
         * URL файла.
         */

        const zipFile =
            `${endpoint}/${bucket}/${zipKey}`;


        /*
         * Сохраняем URL ZIP
         * в MySQL.
         */

        await mysql.db.execute(

            `
            UPDATE products

            SET zip_file = ?

            WHERE id = ?
            `,

            [
                zipFile,
                product.id,
            ]

        );


        /*
         * Создаём временную ссылку
         * для первого скачивания.
         */

        const downloadUrl =
            await getSignedUrl(

                s3,

                new GetObjectCommand({

                    Bucket:
                        bucket,

                    Key:
                        zipKey,

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
                        60 * 60,
                }

            );


        return NextResponse.json({

            success: true,

            alreadyExists:
                false,

            zipFile,

            downloadUrl,

            zipName,

        });

    } catch (error) {

        console.error(
            "BUILD ZIP ERROR:",
            error
        );


        return NextResponse.json(

            {
                success: false,

                message:
                    error instanceof Error
                        ? error.message
                        : "Ошибка создания ZIP",
            },

            {
                status: 500,
            }

        );

    }

}