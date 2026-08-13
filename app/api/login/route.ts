import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import crypto from "crypto";

function createAuthToken(user: {
    id: number;
    username: string;
    role: string;
}) {
    const payload = JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: Date.now(),
    });

    const payloadBase64 = Buffer.from(payload).toString("base64url");

    const secret = process.env.AUTH_SECRET;

    if (!secret) {
        throw new Error("AUTH_SECRET не задан в .env");
    }

    const signature = crypto
        .createHmac("sha256", secret)
        .update(payloadBase64)
        .digest("base64url");

    return `${payloadBase64}.${signature}`;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const username = String(body.username ?? "").trim();
        const password = String(body.password ?? "");

        if (!username || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Введите логин и пароль.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!process.env.DATABASE_URL) {
            return NextResponse.json(
                {
                    success: false,
                    message: "DATABASE_URL не настроен.",
                },
                {
                    status: 500,
                }
            );
        }

        const connection = await mysql.createConnection(
            process.env.DATABASE_URL
        );

        const [rows] = await connection.execute(
            `
            SELECT
                id,
                username,
                password,
                avatar,
                role
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
                {
                    success: false,
                    message: "Неверный логин или пароль.",
                },
                {
                    status: 401,
                }
            );
        }

        const user = users[0];

        const passwordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordCorrect) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Неверный логин или пароль.",
                },
                {
                    status: 401,
                }
            );
        }

        const role = String(user.role || "USER").toUpperCase();

        const authToken = createAuthToken({
            id: user.id,
            username: user.username,
            role,
        });

        const response = NextResponse.json({
            success: true,
            message: "Вход выполнен успешно.",
            user: {
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                role,
            },
        });

        response.cookies.set({
            name: "auth_token",
            value: authToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        });

        return response;
    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Ошибка сервера. Попробуйте позже.",
            },
            {
                status: 500,
            }
        );
    }
}