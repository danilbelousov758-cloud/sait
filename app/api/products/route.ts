import { NextResponse } from "next/server";
import { db } from "@/lib/mysql";

type ProductRow = {
    id: number;
    name: string;
    category: string | null;
    price: number | string | null;
    description: string | null;
    pinned: number | boolean | null;
    images: string | null;
    dff_file: string | null;
    txd_file: string | null;
    author_id: number | null;
    status: string | null;
    created_at: string | Date;
};

export async function GET() {
    try {
        /*
         * Получаем ВСЕ товары из базы.
         *
         * Здесь специально НЕТ:
         *
         * WHERE status = 'ACTIVE'
         *
         * потому что товар может существовать в базе,
         * но иметь другой статус.
         */

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
            ORDER BY
                pinned DESC,
                created_at DESC
            `
        );

        const products = (rows as ProductRow[]).map((product) => {
            let parsedImages: string[] = [];

            /*
             * images хранится в MySQL как JSON.
             * Например:
             *
             * ["https://...", "https://..."]
             *
             * Поэтому преобразуем строку обратно в массив.
             */

            if (product.images) {
                try {
                    const parsed = JSON.parse(product.images);

                    if (Array.isArray(parsed)) {
                        parsedImages = parsed.filter(
                            (item): item is string =>
                                typeof item === "string"
                        );
                    }
                } catch {
                    /*
                     * Если images вдруг оказался обычной строкой,
                     * не ломаем весь каталог.
                     */

                    if (
                        typeof product.images === "string" &&
                        product.images.trim()
                    ) {
                        parsedImages = [product.images];
                    }
                }
            }

            return {
                id: Number(product.id),

                name: product.name,

                category: product.category || "",

                price: Number(product.price || 0),

                description: product.description || "",

                pinned:
                    product.pinned === true ||
                    Number(product.pinned) === 1,

                images: parsedImages,

                dff_file: product.dff_file || null,

                txd_file: product.txd_file || null,

                author_id:
                    product.author_id !== null
                        ? Number(product.author_id)
                        : null,

                /*
                 * Если status NULL — считаем товар активным.
                 */

                status:
                    product.status?.toUpperCase() || "ACTIVE",

                created_at:
                    product.created_at instanceof Date
                        ? product.created_at.toISOString()
                        : product.created_at,
            };
        });

        console.log(
            "GET PRODUCTS:",
            products.length,
            "товаров"
        );

        return NextResponse.json(
            {
                success: true,

                count: products.length,

                products,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "GET PRODUCTS ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,

                message:
                    error instanceof Error
                        ? error.message
                        : "Ошибка загрузки товаров",

                products: [],
            },
            {
                status: 500,
            }
        );
    }
}