import { NextResponse } from "next/server";
import { db } from "@/lib/mysql";


export async function GET(
    req:Request
){

    const {searchParams}=new URL(req.url);


    const orderId =
        Number(
            searchParams.get("orderId")
        );



    const [
        rows
    ] =
    await db.execute(
        `
        SELECT

            m.id,

            m.message,

            m.created_at,

            m.user_id,

            u.username,

            u.avatar


        FROM order_messages m


        JOIN users u

        ON u.id=m.user_id


        WHERE m.order_id=?


        ORDER BY m.id ASC

        `,
        [
            orderId
        ]
    );



    return NextResponse.json(
        rows
    );

}






export async function POST(
    req:Request
){

    const body =
        await req.json();



    const {
        orderId,
        userId,
        message
    } = body;



    if(
        !orderId ||
        !userId ||
        !message
    ){

        return NextResponse.json(
            {
                message:"Ошибка данных"
            },
            {
                status:400
            }
        );

    }



    await db.execute(

        `
        INSERT INTO order_messages

        (
            order_id,
            user_id,
            message
        )

        VALUES
        (
            ?,
            ?,
            ?
        )
        `,

        [
            orderId,
            userId,
            message
        ]

    );



    return NextResponse.json(
        {
            success:true
        }
    );

}