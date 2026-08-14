import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(
    request: Request
) {

    try {

        const formData =
            await request.formData();


        const name =
            String(
                formData.get("name") || ""
            );


        const category =
            String(
                formData.get("category") || ""
            );


        const price =
            Number(
                formData.get("price") || 0
            );


        const description =
            String(
                formData.get("description") || ""
            );


        const pinned =
            String(
                formData.get("pinned")
            ) === "true";



        const dff =
            formData.get("dff") as File | null;


        const txd =
            formData.get("txd") as File | null;



        if (!name || !category) {

            return NextResponse.json(
                {
                    message:
                        "Заполните обязательные поля"
                },
                {
                    status:400
                }
            );

        }





        const connection =
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





        await connection.execute(
            `
            INSERT INTO products
            (
                name,
                category,
                price,
                description,
                pinned,
                dff,
                txd
            )

            VALUES
            (
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

                txd?.name || null

            ]
        );




        await connection.end();




        return NextResponse.json({

            success:true,

            message:
                "Товар создан"

        });



    } catch(error) {


        console.error(
            "CREATE PRODUCT ERROR:",
            error
        );


        return NextResponse.json(
            {

                message:
                    "Ошибка сервера"

            },
            {
                status:500
            }
        );

    }

}