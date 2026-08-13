import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const username = String(body.username ?? "").trim();
        const password = String(body.password ?? "");

        if (!username || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Заполните все обязательные поля.",
                },
                { status: 400 }
            );
        }

        if (username.length < 3 || username.length > 32) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Логин должен содержать от 3 до 32 символов.",
                },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Пароль должен содержать минимум 6 символов.",
                },
                { status: 400 }
            );
        }

        const [existingUsers] = await pool.execute(
            "SELECT id FROM users WHERE username = ? LIMIT 1",
            [username]
        );

        if (Array.isArray(existingUsers) && existingUsers.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Пользователь с таким логином уже существует.",
                },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await pool.execute(
            `INSERT INTO users
            (username, password, role)
            VALUES (?, ?, 'USER')`,
            [username, hashedPassword]
        );

        return NextResponse.json(
            {
                success: true,
                message: "Аккаунт успешно создан.",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("REGISTER_ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Ошибка сервера. Не удалось создать аккаунт.",
            },
            { status: 500 }
        );
    }
}