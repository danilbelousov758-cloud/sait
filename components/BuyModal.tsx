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
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-600
                    py-3
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
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-black/75
                        px-3
                        py-4
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
                            w-full
                            max-w-[430px]
                            max-h-[calc(100vh-24px)]
                            overflow-y-auto
                            rounded-2xl
                            border
                            border-white/10
                            bg-[#0D1117]
                            p-4
                            shadow-2xl
                            sm:p-5
                        "
                    >
                        {/* HEADER */}

                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-bold text-white">
                                    Оформление заказа
                                </h2>

                                <p className="mt-0.5 text-[11px] text-slate-600">
                                    Проверьте данные перед оплатой
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={loading}
                                className="
                                    flex
                                    h-8
                                    w-8
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

                        {/* PRODUCT */}

                        <div
                            className="
                                mt-4
                                rounded-xl
                                border
                                border-white/[0.06]
                                bg-black/20
                                p-3
                            "
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="truncate text-sm font-semibold text-white">
                                        {productName}
                                    </div>

                                    <div className="mt-1 truncate text-[11px] text-slate-600">
                                        Продавец: {sellerName}
                                    </div>
                                </div>

                                <div className="shrink-0 text-right">
                                    <div className="text-base font-bold text-white">
                                        {price} ₽
                                    </div>

                                    <div className="text-[9px] uppercase tracking-wider text-slate-600">
                                        товар
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PAYMENT */}

                        <div className="mt-4">
                            <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                                Способы оплаты
                            </div>

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-white/[0.06]
                                    bg-black/20
                                    p-3
                                    text-[12px]
                                    leading-5
                                    text-slate-400
                                "
                            >
                                <div>
                                    <span className="font-semibold text-slate-300">
                                        СберБанк
                                    </span>
                                    <span className="ml-2 text-slate-500">
                                        2202 2088 8291 8056
                                    </span>
                                </div>

                                <div className="my-2 h-px bg-white/[0.05]" />

                                <div>
                                    <span className="font-semibold text-slate-300">
                                        Т-Банк
                                    </span>
                                    <span className="ml-2 text-slate-500">
                                        5536 9177 2933 9314
                                    </span>
                                </div>

                                <div className="my-2 h-px bg-white/[0.05]" />

                                <div>
                                    <span className="font-semibold text-slate-300">
                                        Donation Alerts
                                    </span>

                                    <div className="mt-0.5 break-all text-[10px] text-slate-600">
                                        donationalerts.com/r/galbraith1629
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DONATION ALERTS WARNING */}

                        <div
                            className="
                                mt-3
                                rounded-lg
                                border
                                border-amber-500/15
                                bg-amber-500/[0.05]
                                px-3
                                py-2
                            "
                        >
                            <p className="text-[11px] leading-4 text-slate-400">
                                ⚠️{" "}
                                <b className="text-amber-300">
                                    Donation Alerts:
                                </b>{" "}
                                комиссия{" "}
                                <b className="text-slate-300">
                                    15%
                                </b>
                                . При недостаточной сумме доната потребуется{" "}
                                <b className="text-amber-300">
                                    доплата разницы
                                </b>
                                .
                            </p>
                        </div>

                        {/* PROMO */}

                        <div className="mt-4">
                            <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                                Промокод
                            </label>

                            <input
                                value={promo}
                                onChange={(e) =>
                                    setPromo(e.target.value)
                                }
                                disabled={loading}
                                className="
                                    mt-2
                                    h-10
                                    w-full
                                    rounded-lg
                                    border
                                    border-white/10
                                    bg-black/30
                                    px-3
                                    text-sm
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

                        {/* TOTAL */}

                        <div
                            className="
                                mt-4
                                rounded-xl
                                border
                                border-white/[0.06]
                                bg-black/20
                                p-3
                            "
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500">
                                    Итого
                                </span>

                                <span className="text-lg font-bold text-white">
                                    {price} ₽
                                </span>
                            </div>

                            <div className="mt-1.5 flex items-center justify-between">
                                <span className="text-[10px] text-slate-700">
                                    Через Donation Alerts
                                </span>

                                <span className="text-[11px] font-medium text-slate-500">
                                    {donationPrice} ₽
                                </span>
                            </div>
                        </div>

                        {/* ERROR */}

                        {error && (
                            <div
                                className="
                                    mt-3
                                    rounded-lg
                                    border
                                    border-red-500/20
                                    bg-red-500/[0.08]
                                    px-3
                                    py-2.5
                                    text-[11px]
                                    leading-4
                                    text-red-300
                                "
                            >
                                {error}
                            </div>
                        )}

                        {/* BUY */}

                        <button
                            type="button"
                            onClick={buy}
                            disabled={loading}
                            className="
                                mt-4
                                flex
                                w-full
                                items-center
                                justify-center
                                rounded-xl
                                bg-emerald-600
                                py-2.5
                                text-sm
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

                        <p className="mt-2 text-center text-[9px] leading-4 text-slate-700">
                            После подтверждения оплаты заказ будет обработан
                            администратором.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}