import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();

        const userCookie = cookieStore.get("mazepov_user");

        if (!userCookie) {
            return NextResponse.json(
                {
                    success: false,
                    user: null,
                },
                { status: 401 }
            );
        }

        const user = JSON.parse(userCookie.value);

        return NextResponse.json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("ME ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                user: null,
            },
            { status: 401 }
        );
    }
}