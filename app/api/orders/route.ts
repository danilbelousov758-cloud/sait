import { NextResponse } from "next/server";
import { db } from "@/lib/mysql";


export async function POST(
    req: Request
) {

    try {

        const body = await req.json();


        const {
            productId,
            buyerId,
            promo
        } = body;



        if(
            !productId ||
            !buyerId
        ){

            return NextResponse.json(
                {
                    message:"Не хватает данных"
                },
                {
                    status:400
                }
            );

        }



        const [
            products
        ] = await db.execute(
            `
            SELECT
                id,
                author_id,
                price

            FROM products

            WHERE id = ?

            LIMIT 1
            `,
            [
                productId
            ]
        );



        const product =
            (products as any[])[0];



        if(!product){

            return NextResponse.json(
                {
                    message:"Товар не найден"
                },
                {
                    status:404
                }
            );

        }





        const [
            result
        ] = await db.execute(

            `
            INSERT INTO orders
            (
                product_id,
                buyer_id,
                seller_id,
                price,
                status,
                promo_code
            )

            VALUES
            (
                ?,
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

                "WAIT_PAYMENT",

                promo || null

            ]

        );




        const insert =
            result as any;



        return NextResponse.json({

            success:true,

            orderId:
                insert.insertId

        });



    } catch(error){


        console.error(
            "CREATE ORDER ERROR:",
            error
        );


        return NextResponse.json(

            {
                message:
                "Ошибка создания заказа"
            },

            {
                status:500
            }

        );

    }

}