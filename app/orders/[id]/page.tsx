import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { db } from "@/lib/mysql";

type OrderData = {
    id: number;
    price: number;
    status: string;
    created_at: string;
    product_name: string;
    seller_name: string;
    buyer_name: string;
};

async function getOrder(id: number) {
    const [rows] = await db.execute(
        `
        SELECT
            o.id,
            o.price,
            o.status,
            o.created_at,
            p.name AS product_name,
            seller.username AS seller_name,
            buyer.username AS buyer_name
        FROM orders o
        JOIN products p ON p.id = o.product_id
        JOIN users seller ON seller.id = o.seller_id
        JOIN users buyer ON buyer.id = o.buyer_id
        WHERE o.id = ?
        LIMIT 1
        `,
        [id]
    );

    const result = rows as any[];

    if (!result[0]) {
        return null;
    }

    return result[0] as OrderData;
}

export default async function OrderPage({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {
    const { id } = await params;

    const orderId = Number(id);

    if (!Number.isInteger(orderId)) {
        notFound();
    }

    const order = await getOrder(orderId);

    if (!order) {
        notFound();
    }

    const statusText =
        order.status === "WAIT_PAYMENT"
            ? "Ожидает подтверждения оплаты"
            : order.status === "PAID"
              ? "Оплата подтверждена"
              : order.status === "COMPLETED"
                ? "Заказ завершён"
                : "Проверка заказа";

    return (
        <>
            <Header />

            <main className="min-h-screen overflow-x-hidden bg-[#080B10] px-3 pb-12 pt-[105px] text-white sm:px-5 sm:pt-[120px]">
                <div className="mx-auto w-full max-w-3xl">
                    <Link
                        href="/catalog"
                        className="inline-flex text-sm text-slate-500 transition hover:text-white"
                    >
                        ← Каталог
                    </Link>

                    <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#0D1117] p-4 sm:mt-6 sm:rounded-3xl sm:p-6">
                        <h1 className="break-words text-xl font-bold leading-tight sm:text-3xl">
                            {order.product_name}
                        </h1>

                        <div className="mt-2 break-words text-xs leading-5 text-slate-500 sm:text-sm">
                            Заказ #{order.id}
                            {" · "}
                            Продавец: {order.seller_name}
                        </div>

                        <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 sm:mt-6 sm:rounded-2xl sm:p-5">
                            <div className="text-[10px] uppercase tracking-widest text-yellow-400 sm:text-xs">
                                Статус
                            </div>

                            <div className="mt-1.5 break-words text-base font-semibold leading-6 sm:mt-2 sm:text-lg">
                                {statusText}
                            </div>
                        </div>

                        <section className="mt-4 rounded-xl border border-white/10 bg-[#11161D] p-4 sm:mt-6 sm:rounded-2xl sm:p-5">
                            <h2 className="text-sm font-semibold sm:text-base">
                                💬 Чат заказа
                            </h2>

                            <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:mt-2 sm:text-sm">
                                Сообщения обновляются автоматически
                            </p>

                            <div className="mt-3 rounded-lg bg-black/20 p-3 text-xs leading-5 text-slate-400 sm:mt-5 sm:rounded-xl sm:p-4 sm:text-sm">
                                ℹ️ Заказ создан. Ожидайте подтверждения оплаты
                                администратором.
                            </div>
                        </section>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 sm:mt-6 sm:pt-5">
                            <span className="text-sm text-slate-500">
                                К оплате
                            </span>

                            <b className="text-lg sm:text-xl">
                                {order.price} ₽
                            </b>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}