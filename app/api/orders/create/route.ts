import { NextResponse } from "next/server";
import { db } from "@/lib/mysql";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const productId = Number(body?.productId);
        const buyerId = Number(body?.buyerId);
        const promo =
            typeof body?.promo === "string"
                ? body.promo.trim()
                : "";

        if (
            !Number.isInteger(productId) ||
            productId <= 0 ||
            !Number.isInteger(buyerId) ||
            buyerId <= 0
        ) {
            return NextResponse.json(
                {
                    message: "Некорректные данные заказа",
                },
                { status: 400 }
            );
        }

        const [products] = await db.execute(
            `
            SELECT
                id,
                price,
                author_id,
                name
            FROM products
            WHERE id = ?
            LIMIT 1
            `,
            [productId]
        );

        const productRows = products as any[];
        const product = productRows[0];

        if (!product) {
            return NextResponse.json(
                {
                    message: "Товар не найден",
                },
                { status: 404 }
            );
        }

        const price = Number(product.price);

        if (!Number.isFinite(price) || price <= 0) {
            return NextResponse.json(
                {
                    message: "Этот товар нельзя купить",
                },
                { status: 400 }
            );
        }

        const sellerId = Number(product.author_id);

        if (!Number.isInteger(sellerId) || sellerId <= 0) {
            return NextResponse.json(
                {
                    message: "У товара не указан продавец",
                },
                { status: 400 }
            );
        }

        if (sellerId === buyerId) {
            return NextResponse.json(
                {
                    message: "Нельзя купить собственный товар",
                },
                { status: 400 }
            );
        }

        const [buyers] = await db.execute(
            `
            SELECT id
            FROM users
            WHERE id = ?
            LIMIT 1
            `,
            [buyerId]
        );

        if (!(buyers as any[])[0]) {
            return NextResponse.json(
                {
                    message: "Пользователь не найден",
                },
                { status: 401 }
            );
        }

        const [existingOrders] = await db.execute(
            `
            SELECT id
            FROM orders
            WHERE product_id = ?
              AND buyer_id = ?
              AND status IN ('WAIT_PAYMENT', 'PAID')
            LIMIT 1
            `,
            [productId, buyerId]
        );

        const existingOrder = (existingOrders as any[])[0];

        if (existingOrder) {
            return NextResponse.json({
                orderId: Number(existingOrder.id),
                existing: true,
            });
        }

        /*
         * Промокод пока сохраняем только на клиенте.
         * Когда таблица промокодов будет готова,
         * здесь можно добавить проверку и пересчёт price.
         */
        void promo;

        const [result] = await db.execute(
            `
            INSERT INTO orders
                (
                    product_id,
                    buyer_id,
                    seller_id,
                    price,
                    status,
                    created_at
                )
            VALUES
                (?, ?, ?, ?, 'WAIT_PAYMENT', NOW())
            `,
            [
                productId,
                buyerId,
                sellerId,
                price,
            ]
        );

        const insertResult = result as {
            insertId?: number | bigint;
        };

        const orderId = Number(insertResult.insertId);

        if (!Number.isInteger(orderId) || orderId <= 0) {
            return NextResponse.json(
                {
                    message: "Заказ не был создан",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            orderId,
        });
    } catch (error) {
        console.error("CREATE ORDER ERROR:", error);

        return NextResponse.json(
            {
                message: "Ошибка создания заказа",
            },
            { status: 500 }
        );
    }
}