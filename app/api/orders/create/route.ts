import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/mysql";


export async function POST(
    request: NextRequest
) {

    try {

        const body =
            await request.json();


        const productId =
            Number(
                body.product_id
            );


        const buyerId =
            Number(
                body.buyer_id
            );


        if (
            !productId ||
            !buyerId
        ) {

            return NextResponse.json(
                {
                    success:false,
                    message:
                        "Некорректные данные",
                },
                {
                    status:400,
                }
            );

        }


        const [
            rows
        ] =
            await db.execute(

                `
                SELECT
                    id,
                    price,
                    author_id

                FROM products

                WHERE id = ?

                LIMIT 1
                `,

                [
                    productId
                ]

            );


        const products =
            rows as any[];


        const product =
            products[0];


        if (!product) {

            return NextResponse.json(
                {
                    success:false,
                    message:
                        "Товар не найден",
                },
                {
                    status:404,
                }
            );

        }



        const [
            result
        ] =
            await db.execute(

                `
                INSERT INTO orders
                (
                    product_id,
                    buyer_id,
                    seller_id,
                    price,
                    status
                )

                VALUES
                (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )
                `,

                [

                    product.id,

                    buyerId,

                    product.author_id,

                    product.price,

                    "WAIT_PAYMENT"

                ]

            );


        const insert =
            result as any;



        return NextResponse.json({

            success:true,

            orderId:
                insert.insertId,

        });



    } catch(error) {


        console.error(
            "CREATE ORDER ERROR:",
            error
        );


        return NextResponse.json(
            {
                success:false,
                message:
                    "Ошибка создания заказа",
            },
            {
                status:500,
            }
        );


    }

}