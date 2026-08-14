import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import fs from "fs/promises";
import path from "path";

const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
});

export async function POST(
    request: NextRequest
) {
    try {
        const formData =
            await request.formData();

        const name =
            String(formData.get("name") || "").trim();

        const category =
            String(formData.get("category") || "").trim();

        const description =
            String(formData.get("description") || "");

        const priceValue =
            String(formData.get("price") || "");

        const price =
            priceValue.trim() === ""
                ? 0
                : Number(priceValue);

        const pinned =
            formData.get("pinned") === "true";

        const authorId =
            Number(
                formData.get("author_id")
            );

        const authorName =
            String(
                formData.get("author_name") || ""
            );

        const dff =
            formData.get("dff_file") as File | null;

        const txd =
            formData.get("txd_file") as File | null;


        if (!name) {
            return NextResponse.json(
                {
                    error:
                        "Введите название товара",
                },
                {
                    status: 400,
                }
            );
        }


        if (!category) {
            return NextResponse.json(
                {
                    error:
                        "Выберите категорию",
                },
                {
                    status: 400,
                }
            );
        }


        if (!authorId) {
            return NextResponse.json(
                {
                    error:
                        "Не найден пользователь",
                },
                {
                    status: 400,
                }
            );
        }


        const uploadFolder =
            path.join(
                process.cwd(),
                "public/uploads/products"
            );


        await fs.mkdir(
            uploadFolder,
            {
                recursive: true,
            }
        );


        let dffName = null;
        let txdName = null;


        if (dff) {

            const buffer =
                Buffer.from(
                    await dff.arrayBuffer()
                );

            dffName =
                `${Date.now()}-${dff.name}`;

            await fs.writeFile(
                path.join(
                    uploadFolder,
                    dffName
                ),
                buffer
            );
        }


        if (txd) {

            const buffer =
                Buffer.from(
                    await txd.arrayBuffer()
                );

            txdName =
                `${Date.now()}-${txd.name}`;

            await fs.writeFile(
                path.join(
                    uploadFolder,
                    txdName
                ),
                buffer
            );
        }


        const images =
            formData
                .getAll("images")
                .filter(
                    (item) =>
                        item instanceof File
                );


        const imageNames:string[] = [];


        for (const image of images) {

            const buffer =
                Buffer.from(
                    await image.arrayBuffer()
                );

            const imageName =
                `${Date.now()}-${image.name}`;


            await fs.writeFile(
                path.join(
                    uploadFolder,
                    imageName
                ),
                buffer
            );


            imageNames.push(
                imageName
            );
        }



        const connection =
            await pool.getConnection();


        await connection.execute(
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
                author_name
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
                ?
            )
            `,
            [
                name,
                category,
                price,
                description,
                pinned ? 1 : 0,
                dffName,
                txdName,
                JSON.stringify(
                    imageNames
                ),
                authorId,
                authorName,
            ]
        );


        connection.release();



        return NextResponse.json(
            {
                success: true,
                message:
                    "Товар создан",
            }
        );


    } catch (error) {

        console.error(
            "CREATE PRODUCT ERROR:",
            error
        );


        return NextResponse.json(
            {
                error:
                    "Ошибка создания товара",
            },
            {
                status:500,
            }
        );
    }
}