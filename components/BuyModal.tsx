"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    productId: number;
    productName: string;
    sellerName: string;
    price: number;
};

export default function BuyModal({
    productId,
    productName,
    sellerName,
    price,
}: Props) {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [promo, setPromo] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const donationPrice = Math.round(price / 0.85);

    async function buy() {
        if (loading) return;

        setLoading(true);
        setError("");

        try {
            const savedUser = localStorage.getItem("user");

            if (!savedUser) {
                setError("Войдите в аккаунт, чтобы оформить заказ.");
                return;
            }

            let user: { id?: number | string } | null = null;

            try {
                user = JSON.parse(savedUser);
            } catch {
                setError("Не удалось определить пользователя. Войдите заново.");
                return;
            }

            const buyerId = Number(user?.id);

            if (!Number.isInteger(buyerId) || buyerId <= 0) {
                setError("Не удалось определить пользователя. Войдите заново.");
                return;
            }

            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId,
                    buyerId,
                    promo: promo.trim(),
                }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message || "Не удалось создать заказ"
                );
            }

            if (!data?.orderId) {
                throw new Error("Сервер не вернул номер заказа");
            }

            setOpen(false);
            setPromo("");

            router.push(`/orders/${data.orderId}`);
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Не удалось создать заказ"
            );
        } finally {
            setLoading(false);
        }
    }

    function closeModal() {
        if (loading) return;

        setOpen(false);
        setError("");
    }

    return (
        <>
            <button
                type="button"
                onClick={() => {
                    setError("");
                    setOpen(true);
                }}
                className="
                    mt-5
                    flex
                    w-full
                    justify-center
                    rounded-xl
                    bg-blue-600
                    py-3
                    font-semibold
                    transition
                    hover:bg-blue-500
                "
            >
                Купить
            </button>

            {open && (
                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        overflow-y-auto
                        bg-black/70
                        px-3
                        py-4
                        sm:px-4
                    "
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div
                        className="
                            max-h-[calc(100vh-32px)]
                            w-full
                            max-w-lg
                            overflow-y-auto
                            rounded-2xl
                            border
                            border-white/10
                            bg-[#0D1117]
                            p-4
                            shadow-2xl
                            sm:rounded-3xl
                            sm:p-6
                        "
                    >
                        <div className="flex items-start justify-between gap-4">
                            <h2 className="text-xl font-bold">
                                Оформление заказа
                            </h2>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={loading}
                                className="
                                    shrink-0
                                    text-slate-500
                                    transition
                                    hover:text-white
                                    disabled:opacity-50
                                "
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-5">
                            <h3 className="break-words text-lg font-semibold">
                                {productName}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Продавец: {sellerName}
                            </p>
                        </div>

                        <div className="mt-4 rounded-xl bg-black/30 p-4">
                            <p className="text-sm text-slate-400">Цена</p>
                            <p className="mt-1 text-2xl font-bold">
                                {price} ₽
                            </p>
                        </div>

                        <div className="mt-5">
                            <p className="text-sm text-slate-400">
                                Переведите оплату:
                            </p>

                            <div
                                className="
                                    mt-3
                                    rounded-xl
                                    bg-black/30
                                    p-4
                                    text-sm
                                    leading-7
                                    break-words
                                "
                            >
                                <b>СберБанк:</b>
                                <br />
                                2202 2088 8291 8056

                                <br />
                                <br />

                                <b>Т-Банк:</b>
                                <br />
                                5536 9177 2933 9314

                                <br />
                                <br />

                                <b>Donation Alerts:</b>
                                <br />
                                donationalerts.com/r/galbraith1629
                            </div>
                        </div>

                        <div className="mt-5">
                            <label className="text-sm text-slate-400">
                                🏷 Промокод
                            </label>

                            <input
                                value={promo}
                                onChange={(e) => setPromo(e.target.value)}
                                disabled={loading}
                                className="
                                    mt-2
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-white/10
                                    bg-black/30
                                    px-4
                                    outline-none
                                    transition
                                    focus:border-blue-500/50
                                    disabled:opacity-50
                                "
                                placeholder="Введите промокод"
                            />
                        </div>

                        <div className="mt-5 border-t border-white/10 pt-4">
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-400">
                                    Итого
                                </span>

                                <b>{price} ₽</b>
                            </div>

                            <div className="mt-2 text-sm text-slate-500">
                                Через Donation Alerts: {donationPrice} ₽
                            </div>
                        </div>

                        {error && (
                            <div
                                className="
                                    mt-4
                                    rounded-xl
                                    border
                                    border-red-500/20
                                    bg-red-500/10
                                    p-3
                                    text-sm
                                    leading-5
                                    text-red-300
                                "
                            >
                                {error}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={buy}
                            disabled={loading}
                            className="
                                mt-5
                                w-full
                                rounded-xl
                                bg-green-600
                                py-3
                                font-semibold
                                transition
                                hover:bg-green-500
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "Создание заказа..."
                                : "Я оплатил"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}