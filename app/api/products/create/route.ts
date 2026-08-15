import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/mysql";



export async function POST(
    request: NextRequest
) {

    try {

        const body =
            await request.json();



        const name =
            String(
                body.name || ""
            ).trim();



        const category =
            String(
                body.category || ""
            ).trim();



        const price =
            Number(
                body.price ?? 0
            );



        const description =
            String(
                body.description || ""
            ).trim();



        const pinned =
            Boolean(
                body.pinned
            );



        const authorId =
            Number(
                body.author_id
            );



        /*
         * ВАЖНО:
         *
         * Здесь сохраняются именно
         * пути / URL файлов S3.
         *
         * Сам файл через этот API
         * не проходит.
         */

        const dffFile =
            String(
                body.dff_file || ""
            ).trim();



        const txdFile =
            String(
                body.txd_file || ""
            ).trim();



        const images =
            Array.isArray(
                body.images
            )
                ? body.images.filter(
                    (
                        image: unknown
                    ): image is string =>
                        typeof image === "string" &&
                        image.trim().length > 0
                )
                : [];



        /*
         * Проверка названия.
         */

        if (!name) {

            return NextResponse.json(

                {
                    success: false,
                    message:
                        "Введите название товара",
                },

                {
                    status: 400,
                }

            );

        }



        /*
         * Проверка категории.
         */

        if (!category) {

            return NextResponse.json(

                {
                    success: false,
                    message:
                        "Выберите категорию товара",
                },

                {
                    status: 400,
                }

            );

        }



        /*
         * Запрещаем выбирать
         * родительскую категорию.
         */

        const forbiddenCategories = [

            "Скины",
            "Оружие",
            "Интерьеры",
            "Заменные территории",
            "Эффекты",
            "Звуки",

        ];



        if (
            forbiddenCategories.includes(
                category
            )
        ) {

            return NextResponse.json(

                {
                    success: false,

                    message:
                        "Нельзя выбрать основную категорию. Выберите подраздел.",
                },

                {
                    status: 400,
                }

            );

        }



        /*
         * Проверка цены.
         */

        if (
            !Number.isFinite(price) ||
            price < 0
        ) {

            return NextResponse.json(

                {
                    success: false,
                    message:
                        "Некорректная цена",
                },

                {
                    status: 400,
                }

            );

        }



        /*
         * Проверка автора.
         */

        if (
            !Number.isInteger(authorId) ||
            authorId <= 0
        ) {

            return NextResponse.json(

                {
                    success: false,
                    message:
                        "Не найден автор товара",
                },

                {
                    status: 400,
                }

            );

        }



        /*
         * Обязательные файлы мода.
         */

        if (!dffFile) {

            return NextResponse.json(

                {
                    success: false,
                    message:
                        "DFF файл не загружен",
                },

                {
                    status: 400,
                }

            );

        }



        if (!txdFile) {

            return NextResponse.json(

                {
                    success: false,
                    message:
                        "TXD файл не загружен",
                },

                {
                    status: 400,
                }

            );

        }



        /*
         * Сохраняем товар.
         *
         * Никаких файлов через MySQL
         * не передаём.
         *
         * В БД лежат только ссылки
         * на S3.
         */

        const [result] =
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

                    dffFile,

                    txdFile,

                    JSON.stringify(
                        images
                    ),

                    authorId,

                    "ACTIVE",

                ]

            );



        console.log(
            "PRODUCT CREATED:",
            {
                name,
                category,
                price,
                authorId,
            }
        );



        return NextResponse.json(

            {
                success: true,

                message:
                    "Товар успешно создан",

            },

            {
                status: 201,
            }

        );



    } catch (error) {

        console.error(
            "CREATE PRODUCT ERROR:",
            error
        );



        return NextResponse.json(

            {
                success: false,

                message:
                    error instanceof Error
                        ? error.message
                        : "Ошибка создания товара",
            },

            {
                status: 500,
            }

        );

    }

}