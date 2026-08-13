import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
    try {
        const connection = await mysql.createConnection(
            process.env.DATABASE_URL as string
        );

        // Пока используем localStorage на клиенте,
        // поэтому API возвращает информацию о необходимости
        // авторизации.
        await connection.end();

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error("AUTH ME ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Ошибка сервера.",
            },
            {
                status: 500,
            }
        );
    }
}