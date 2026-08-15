import { NextResponse } from "next/server";
import { db } from "@/lib/mysql";


export async function GET(
    req:Request,
    {
        params
    }:{
        params:Promise<{id:string}>
    }
){

    const {
        id
    } = await params;


    const [
        rows
    ] = await db.execute(
        `
        SELECT

        m.id,
        m.message,
        m.created_at,

        u.username,
        u.avatar


        FROM order_messages m


        JOIN users u

        ON u.id = m.user_id


        WHERE m.order_id = ?


        ORDER BY m.id ASC

        `,
        [
            Number(id)
        ]
    );


    return NextResponse.json(rows);

}





export async function POST(
    req:Request,
    {
        params
    }:{
        params:Promise<{id:string}>
    }
){


    const {
        id
    } = await params;



    const body =
        await req.json();



    const {
        userId,
        message
    } = body;



    if(
        !userId ||
        !message
    ){

        return NextResponse.json(
            {
                error:"Данные заполнены не полностью"
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

        VALUES(?,?,?)

        `,

        [
            Number(id),
            Number(userId),
            message
        ]

    );



    return NextResponse.json(
        {
            success:true
        }
    );


}