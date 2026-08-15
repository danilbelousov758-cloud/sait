import { NextRequest, NextResponse } from "next/server";

import {
    S3Client,
    GetObjectCommand,
} from "@aws-sdk/client-s3";

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


/*
 * Безопасное название ZIP.
 */

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


/*
 * Получаем имя файла из URL или S3 key.
 */

function getFileName(
    urlOrKey: string | null
) {

    if (!urlOrKey) {
        return null;
    }


    let fileName = "";


    try {

        const url =
            new URL(urlOrKey);

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
            urlOrKey
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
     * который добавляется при загрузке
     * файла в S3.
     *
     * Было:
     *
     * 1755261234567-skin.dff
     *
     * Станет:
     *
     * skin.dff
     *
     *
     * Также поддерживается:
     *
     * 1755261234567_skin.dff
     */

    fileName =
        fileName.replace(
            /^\d{10,}[-_]/,
            ""
        );


    return fileName || null;

}


/*
 * Получаем настоящий S3 key.
 */

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


        /*
         * Убираем имя bucket
         * из начала пути.
         */

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


/*
 * Загружаем файл из S3.
 */

async function downloadS3File(
    value: string
) {

    const key =
        getS3Key(value);


    if (!key) {
        return null;
    }


    console.log(
        "DOWNLOAD S3 KEY:",
        key
    );


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


    return {

        key,

        bytes,

    };

}


/*
 * GET /api/products/[id]/download
 */

export async function GET(
    request: NextRequest,
    context: {
        params: Promise<{
            id: string;
        }>;
    }
) {

    try {

        /*
         * Проверяем S3.
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
         * Получаем ID товара.
         */

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


        /*
         * Подключаем MySQL.
         */

        const mysql =
            await import(
                "@/lib/mysql"
            );


        /*
         * Получаем товар.
         */

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

                status:
                    string | null;

            }>;


        const product =
            products[0];


        /*
         * Товар не найден.
         */

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
         * Проверяем статус.
         */

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
         * Проверяем наличие файлов.
         */

        if (
            !product.dff_file &&
            !product.txd_file
        ) {

            return NextResponse.json(

                {

                    success: false,

                    message:
                        "У этого мода нет файлов для скачивания",

                },

                {
                    status: 404,
                }

            );

        }


        console.log(
            "BUILD ZIP:",
            {

                id:
                    product.id,

                name:
                    product.name,

                dff:
                    product.dff_file,

                txd:
                    product.txd_file,

            }
        );


        /*
         * Создаём ZIP.
         */

        const zip =
            new JSZip();


        let addedFiles =
            0;


        /*
         * --------------------------------
         * DFF
         * --------------------------------
         */

        if (
            product.dff_file
        ) {

            try {

                const file =
                    await downloadS3File(
                        product.dff_file
                    );


                if (file) {

                    /*
                     * Получаем оригинальное
                     * имя файла.
                     *
                     * Timestamp автоматически
                     * убирается.
                     */

                    const fileName =
                        getFileName(
                            product.dff_file
                        );


                    if (
                        fileName &&
                        fileName
                            .toLowerCase()
                            .endsWith(".dff")
                    ) {

                        console.log(
                            "ZIP DFF:",
                            fileName
                        );


                        zip.file(

                            fileName,

                            file.bytes

                        );


                        addedFiles++;

                    }

                }

            } catch (error) {

                console.error(
                    "DFF DOWNLOAD ERROR:",
                    error
                );

            }

        }


        /*
         * --------------------------------
         * TXD
         * --------------------------------
         */

        if (
            product.txd_file
        ) {

            try {

                const file =
                    await downloadS3File(
                        product.txd_file
                    );


                if (file) {

                    /*
                     * Получаем оригинальное
                     * имя файла.
                     */

                    const fileName =
                        getFileName(
                            product.txd_file
                        );


                    if (
                        fileName &&
                        fileName
                            .toLowerCase()
                            .endsWith(".txd")
                    ) {

                        console.log(
                            "ZIP TXD:",
                            fileName
                        );


                        zip.file(

                            fileName,

                            file.bytes

                        );


                        addedFiles++;

                    }

                }

            } catch (error) {

                console.error(
                    "TXD DOWNLOAD ERROR:",
                    error
                );

            }

        }


        /*
         * Ни одного файла не получили.
         */

        if (
            addedFiles === 0
        ) {

            return NextResponse.json(

                {

                    success: false,

                    message:
                        "Не удалось получить файлы мода из S3",

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
         * Название ZIP =
         * название мода.
         */

        const zipName =
            `${cleanZipName(
                product.name
            )}.zip`;


        console.log(
            "ZIP CREATED:",
            zipName
        );


        /*
         * Отправляем ZIP
         * непосредственно браузеру.
         */

        return new NextResponse(

            zipBytes as BodyInit,

            {

                status: 200,

                headers: {

                    "Content-Type":
                        "application/zip",

                    "Content-Disposition":
                        `attachment; filename="${encodeURIComponent(
                            zipName
                        )}"; filename*=UTF-8''${encodeURIComponent(
                            zipName
                        )}`,

                    "Content-Length":
                        String(
                            zipBytes.length
                        ),

                    "Cache-Control":
                        "no-store",

                },

            }

        );

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