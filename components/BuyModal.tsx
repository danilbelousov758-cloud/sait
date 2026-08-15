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
                setError(
                    "Не удалось определить пользователя. Войдите заново."
                );
                return;
            }

            const buyerId = Number(user?.id);

            if (!Number.isInteger(buyerId) || buyerId <= 0) {
                setError(
                    "Не удалось определить пользователя. Войдите заново."
                );
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
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
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
                        z-[9999]
                        flex
                        items-center
                        justify-center
                        overflow-hidden
                        bg-black/75
                        px-3
                        py-3
                        backdrop-blur-sm
                    "
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div
                        className="
                            max-h-[calc(100vh-24px)]
                            w-full
                            max-w-[340px]
                            overflow-y-auto
                            rounded-2xl
                            border
                            border-white/10
                            bg-[#0D1117]
                            p-4
                            shadow-2xl
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-3
                            "
                        >
                            <div className="min-w-0">
                                <div
                                    className="
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-widest
                                        text-blue-400
                                    "
                                >
                                    Покупка
                                </div>

                                <h2
                                    className="
                                        mt-1
                                        text-base
                                        font-bold
                                        text-white
                                    "
                                >
                                    Оформление заказа
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={loading}
                                className="
                                    flex
                                    h-7
                                    w-7
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-white/[0.04]
                                    text-sm
                                    text-slate-500
                                    transition
                                    hover:bg-white/[0.08]
                                    hover:text-white
                                    disabled:opacity-50
                                "
                            >
                                ✕
                            </button>
                        </div>

                        <div
                            className="
                                mt-3
                                rounded-xl
                                border
                                border-white/[0.06]
                                bg-black/20
                                px-3
                                py-2.5
                            "
                        >
                            <h3
                                className="
                                    truncate
                                    text-sm
                                    font-semibold
                                    text-white
                                "
                                title={productName}
                            >
                                {productName}
                            </h3>

                            <p
                                className="
                                    mt-0.5
                                    truncate
                                    text-[11px]
                                    text-slate-500
                                "
                            >
                                Продавец: {sellerName}
                            </p>
                        </div>

                        <div
                            className="
                                mt-2
                                flex
                                items-center
                                justify-between
                                rounded-xl
                                border
                                border-white/[0.06]
                                bg-black/20
                                px-3
                                py-2.5
                            "
                        >
                            <span className="text-[11px] text-slate-500">
                                Цена
                            </span>

                            <span className="text-lg font-bold text-white">
                                {price} ₽
                            </span>
                        </div>

                        <div className="mt-3">
                            <div
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-slate-600
                                "
                            >
                                Способ оплаты
                            </div>

                            <div
                                className="
                                    mt-1.5
                                    rounded-xl
                                    border
                                    border-white/[0.06]
                                    bg-black/25
                                    px-3
                                    py-2.5
                                    text-[11px]
                                    leading-5
                                    text-slate-400
                                "
                            >
                                <div>
                                    <span className="font-semibold text-slate-300">
                                        СберБанк:
                                    </span>{" "}
                                    2202 2088 8291 8056
                                </div>

                                <div>
                                    <span className="font-semibold text-slate-300">
                                        Т-Банк:
                                    </span>{" "}
                                    5536 9177 2933 9314
                                </div>

                                <div className="mt-1 truncate text-blue-400">
                                    <span className="font-semibold text-slate-300">
                                        Donation Alerts:
                                    </span>{" "}
                                    donationalerts.com/r/galbraith1629
                                </div>
                            </div>
                        </div>

                        <div className="mt-3">
                            <label
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-slate-600
                                "
                            >
                                Промокод
                            </label>

                            <input
                                value={promo}
                                onChange={(e) => setPromo(e.target.value)}
                                disabled={loading}
                                className="
                                    mt-1.5
                                    h-9
                                    w-full
                                    rounded-lg
                                    border
                                    border-white/10
                                    bg-black/30
                                    px-3
                                    text-xs
                                    text-white
                                    outline-none
                                    transition
                                    placeholder:text-slate-700
                                    focus:border-blue-500/50
                                    disabled:opacity-50
                                "
                                placeholder="Введите промокод"
                            />
                        </div>

                        <div
                            className="
                                mt-3
                                border-t
                                border-white/[0.07]
                                pt-3
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                "
                            >
                                <span className="text-xs text-slate-500">
                                    Итого
                                </span>

                                <b className="text-base text-white">
                                    {price} ₽
                                </b>
                            </div>

                            <div className="mt-1 text-[10px] text-slate-600">
                                Через Donation Alerts: {donationPrice} ₽
                            </div>
                        </div>

                        {error && (
                            <div
                                className="
                                    mt-3
                                    rounded-lg
                                    border
                                    border-red-500/20
                                    bg-red-500/10
                                    px-3
                                    py-2
                                    text-[11px]
                                    leading-4
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
                                mt-3
                                w-full
                                rounded-xl
                                bg-emerald-600
                                px-4
                                py-2.5
                                text-xs
                                font-semibold
                                text-white
                                transition
                                hover:bg-emerald-500
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "Создание заказа..."
                                : "Я оплатил"}
                        </button>

                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={loading}
                            className="
                                mt-1.5
                                w-full
                                py-1.5
                                text-[10px]
                                text-slate-600
                                transition
                                hover:text-slate-300
                                disabled:opacity-50
                            "
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}