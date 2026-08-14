import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const name =
            String(formData.get("name") || "");

        const category =
            String(formData.get("category") || "");

        const description =
            String(formData.get("description") || "");

        const price =
            Number(formData.get("price") || 0);

        const pinned =
            formData.get("pinned") === "true";

        const author_id =
            Number(formData.get("author_id") || 0);


        const dff =
            formData.get("dff_file") as File | null;

        const txd =
            formData.get("txd_file") as File | null;


        if (!name || !category) {
            return NextResponse.json(
                {
                    error:
                        "Название и категория обязательны"
                },
                {
                    status:400
                }
            );
        }


        const db =
            await mysql.createConnection({
                host:
                    "185.200.242.40",

                user:
                    "mazepov_user",

                password:
                    "dy_dyb_1901",

                database:
                    "sait",

                port:
                    3306
            });



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
                status
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

                dff?.name || null,

                txd?.name || null,

                JSON.stringify([]),

                author_id,

                "ACTIVE"
            ]
        );


        await db.end();


        return NextResponse.json({
            success:true
        });


    } catch(error){

        console.log(error);


        return NextResponse.json(
            {
                error:
                    "Ошибка создания товара"
            },
            {
                status:500
            }
        );
    }
}