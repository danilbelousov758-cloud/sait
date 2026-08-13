import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const username = String(body.username ?? "").trim();
        const password = String(body.password ?? "");

        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: "Введите логин и пароль." },
                { status: 400 }
            );
        }

        const connection = await mysql.createConnection(
            process.env.DATABASE_URL as string
        );

        const [rows] = await connection.execute(
            `
            SELECT id, username, password, avatar, role
            FROM users
            WHERE username = ?
            LIMIT 1
            `,
            [username]
        );

        await connection.end();

        const users = rows as Array<{
            id: number;
            username: string;
            password: string;
            avatar: string | null;
            role: string;
        }>;

        if (users.length === 0) {
            return NextResponse.json(
                { success: false, message: "Неверный логин или пароль." },
                { status: 401 }
            );
        }

        const user = users[0];

        const passwordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordCorrect) {
            return NextResponse.json(
                { success: false, message: "Неверный логин или пароль." },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Вход выполнен успешно.",
            user: {
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Ошибка сервера. Попробуйте позже.",
            },
            { status: 500 }
        );
    }
}