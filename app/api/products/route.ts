import { NextResponse } from "next/server";
import { db } from "@/lib/mysql";


export async function GET() {

    try {

        const [rows] = await db.execute(
            `
            SELECT
                id,
                name,
                category,
                price,
                description,
                pinned,
                images,
                dff_file,
                txd_file,
                author_id,
                status,
                created_at

            FROM products

            WHERE status = ?

            ORDER BY pinned DESC, created_at DESC
            `,
            [
                "ACTIVE"
            ]
        );


        return NextResponse.json({

            success:true,

            products: rows

        });


    } catch(error) {


        console.error(
            "GET PRODUCTS ERROR:",
            error
        );


        return NextResponse.json(

            {
                success:false,
                message:"Ошибка загрузки товаров"
            },

            {
                status:500
            }

        );


    }

}