import { NextResponse } from "next/server";
import { db } from "@/lib/mysql";


export async function GET() {

    try {

        const [rows] = await db.query(
            `
            SELECT
                id,
                name,
                category,
                price,
                description,
                image,
                author_id,
                created_at
            FROM marketplace
            WHERE status = 'ACTIVE'
            ORDER BY created_at DESC
            `
        );


        return NextResponse.json({
            products: rows
        });


    } catch (error) {

        console.error(
            "MARKETPLACE API ERROR:",
            error
        );


        return NextResponse.json(
            {
                message:
                    "Ошибка загрузки торговой площадки"
            },
            {
                status:500
            }
        );

    }

}