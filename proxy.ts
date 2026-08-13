import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

type AuthUser = {
    id: number;
    username: string;
    role: string;
};

function getUserFromToken(token: string): AuthUser | null {
    try {
        const parts = token.split(".");

        if (parts.length !== 2) {
            return null;
        }

        const [payloadBase64, signature] = parts;

        const secret = process.env.AUTH_SECRET;

        if (!secret) {
            return null;
        }

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(payloadBase64)
            .digest("base64url");

        if (signature !== expectedSignature) {
            return null;
        }

        const payload = JSON.parse(
            Buffer.from(payloadBase64, "base64url").toString("utf8")
        ) as AuthUser & {
            createdAt?: number;
        };

        if (!payload.id || !payload.username) {
            return null;
        }

        if (payload.createdAt) {
            const maxAge = 1000 * 60 * 60 * 24 * 30;

            if (Date.now() - payload.createdAt > maxAge) {
                return null;
            }
        }

        return {
            id: payload.id,
            username: payload.username,
            role: String(payload.role || "USER").toUpperCase(),
        };
    } catch {
        return null;
    }
}

function redirectToLogin(request: NextRequest) {
    const url = request.nextUrl.clone();

    url.pathname = "/login";
    url.search = "";

    return NextResponse.redirect(url);
}

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const protectedRoutes = [
        "/profile",
        "/seller",
        "/admin",
        "/founder",
    ];

    const needsAuth = protectedRoutes.some(
        (route) =>
            pathname === route ||
            pathname.startsWith(`${route}/`)
    );

    if (!needsAuth) {
        return NextResponse.next();
    }

    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
        return redirectToLogin(request);
    }

    const user = getUserFromToken(token);

    if (!user) {
        const response = redirectToLogin(request);

        response.cookies.set({
            name: "auth_token",
            value: "",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });

        return response;
    }

    const role = user.role;

    // Панель продавца
    if (
        pathname === "/seller" ||
        pathname.startsWith("/seller/")
    ) {
        if (
            role !== "SELLER" &&
            role !== "ADMIN" &&
            role !== "FOUNDER"
        ) {
            return NextResponse.redirect(
                new URL("/profile", request.url)
            );
        }
    }

    // Панель администратора
    if (
        pathname === "/admin" ||
        pathname.startsWith("/admin/")
    ) {
        if (
            role !== "ADMIN" &&
            role !== "FOUNDER"
        ) {
            return NextResponse.redirect(
                new URL("/profile", request.url)
            );
        }
    }

    // Панель основателя
    if (
        pathname === "/founder" ||
        pathname.startsWith("/founder/")
    ) {
        if (role !== "FOUNDER") {
            return NextResponse.redirect(
                new URL("/profile", request.url)
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/profile/:path*",
        "/seller/:path*",
        "/admin/:path*",
        "/founder/:path*",
    ],
};