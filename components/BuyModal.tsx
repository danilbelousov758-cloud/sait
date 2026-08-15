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
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-blue-500
                    active:scale-[0.99]
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
                        py-3
                        backdrop-blur-sm
                        sm:px-4
                        sm:py-4
                    "
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div
                        className="
                            buy-modal-scroll
                            relative
                            flex
                            max-h-[calc(100vh-24px)]
                            w-full
                            max-w-md
                            flex-col
                            overflow-y-auto
                            rounded-2xl
                            border
                            border-white/[0.08]
                            bg-[#0D1117]
                            shadow-[0_25px_80px_rgba(0,0,0,0.65)]
                            sm:max-h-[calc(100vh-40px)]
                            sm:rounded-3xl
                        "
                    >
                        {/* HEADER */}

                        <div
                            className="
                                sticky
                                top-0
                                z-10
                                flex
                                shrink-0
                                items-center
                                justify-between
                                border-b
                                border-white/[0.06]
                                bg-[#0D1117]/95
                                px-5
                                py-4
                                backdrop-blur-xl
                                sm:px-6
                            "
                        >
                            <div>
                                <div
                                    className="
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.2em]
                                        text-blue-500
                                    "
                                >
                                    MAZEPOV MODS
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
                                aria-label="Закрыть"
                                className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    border-white/[0.06]
                                    bg-white/[0.03]
                                    text-slate-500
                                    transition
                                    hover:bg-white/[0.06]
                                    hover:text-white
                                    disabled:opacity-40
                                "
                            >
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                >
                                    <line
                                        x1="18"
                                        y1="6"
                                        x2="6"
                                        y2="18"
                                    />

                                    <line
                                        x1="6"
                                        y1="6"
                                        x2="18"
                                        y2="18"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* CONTENT */}

                        <div className="px-5 py-4 sm:px-6 sm:py-5">
                            {/* PRODUCT */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-white/[0.06]
                                    bg-black/20
                                    p-3.5
                                "
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-blue-500/10
                                            text-blue-400
                                        "
                                    >
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M20 7h-9L9 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
                                        </svg>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div
                                            className="
                                                truncate
                                                text-sm
                                                font-semibold
                                                text-white
                                            "
                                            title={productName}
                                        >
                                            {productName}
                                        </div>

                                        <div className="mt-0.5 truncate text-[11px] text-slate-600">
                                            Продавец: {sellerName}
                                        </div>
                                    </div>

                                    <div className="shrink-0 text-sm font-bold text-white">
                                        {price} ₽
                                    </div>
                                </div>
                            </div>

                            {/* PAYMENT */}

                            <div className="mt-4">
                                <div
                                    className="
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.18em]
                                        text-slate-600
                                    "
                                >
                                    Способ оплаты
                                </div>

                                <div className="mt-2 space-y-2">
                                    <PaymentItem
                                        title="СберБанк"
                                        value="2202 2088 8291 8056"
                                    />

                                    <PaymentItem
                                        title="Т-Банк"
                                        value="5536 9177 2933 9314"
                                    />

                                    <PaymentItem
                                        title="Donation Alerts"
                                        value="donationalerts.com/r/galbraith1629"
                                        blue
                                    />
                                </div>
                            </div>

                            {/* WARNING */}

                            <div
                                className="
                                    mt-4
                                    rounded-xl
                                    border
                                    border-amber-500/15
                                    bg-amber-500/[0.045]
                                    px-3.5
                                    py-3
                                "
                            >
                                <div className="flex gap-2.5">
                                    <div
                                        className="
                                            flex
                                            h-6
                                            w-6
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-amber-500/10
                                            text-sm
                                        "
                                    >
                                        ⚠️
                                    </div>

                                    <div className="min-w-0">
                                        <div className="text-[11px] font-semibold text-amber-300">
                                            Важно при оплате через Donation
                                            Alerts
                                        </div>

                                        <p
                                            className="
                                                mt-1
                                                text-[10px]
                                                leading-4
                                                text-slate-500
                                            "
                                        >
                                            Комиссия платформы составляет{" "}
                                            <span className="font-semibold text-slate-300">
                                                15%
                                            </span>
                                            . Если сумма доната окажется меньше
                                            стоимости товара с учётом комиссии,
                                            потребуется{" "}
                                            <span className="font-semibold text-slate-300">
                                                доплатить разницу
                                            </span>
                                            .
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* PROMO */}

                            <div className="mt-4">
                                <label
                                    htmlFor="promo"
                                    className="
                                        text-[10px]
                                        font-medium
                                        text-slate-500
                                    "
                                >
                                    🏷 Промокод
                                </label>

                                <input
                                    id="promo"
                                    value={promo}
                                    onChange={(e) =>
                                        setPromo(e.target.value)
                                    }
                                    disabled={loading}
                                    className="
                                        mt-1.5
                                        h-10
                                        w-full
                                        rounded-xl
                                        border
                                        border-white/[0.07]
                                        bg-black/25
                                        px-3
                                        text-sm
                                        text-white
                                        outline-none
                                        placeholder:text-slate-700
                                        transition
                                        focus:border-blue-500/40
                                        focus:bg-black/35
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
                                    p-3.5
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

                                <div
                                    className="
                                        mt-1.5
                                        flex
                                        items-center
                                        justify-between
                                        text-[10px]
                                        text-slate-600
                                    "
                                >
                                    <span>
                                        Через Donation Alerts
                                    </span>

                                    <span className="text-slate-500">
                                        {donationPrice} ₽
                                    </span>
                                </div>
                            </div>

                            {/* ERROR */}

                            {error && (
                                <div
                                    className="
                                        mt-3
                                        rounded-xl
                                        border
                                        border-red-500/15
                                        bg-red-500/[0.06]
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

                            {/* BUTTON */}

                            <button
                                type="button"
                                onClick={buy}
                                disabled={loading}
                                className="
                                    mt-4
                                    flex
                                    h-11
                                    w-full
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-emerald-600
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-emerald-500
                                    active:scale-[0.99]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span
                                            className="
                                                h-4
                                                w-4
                                                animate-spin
                                                rounded-full
                                                border-2
                                                border-white/30
                                                border-t-white
                                            "
                                        />

                                        Создание заказа...
                                    </span>
                                ) : (
                                    "Я оплатил"
                                )}
                            </button>

                            <p
                                className="
                                    mt-3
                                    text-center
                                    text-[9px]
                                    leading-4
                                    text-slate-700
                                "
                            >
                                После подтверждения оплаты заказ будет передан
                                администратору.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .buy-modal-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: #1e293b transparent;
                }

                .buy-modal-scroll::-webkit-scrollbar {
                    width: 5px;
                }

                .buy-modal-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }

                .buy-modal-scroll::-webkit-scrollbar-thumb {
                    background: #1e293b;
                    border-radius: 999px;
                }

                .buy-modal-scroll::-webkit-scrollbar-thumb:hover {
                    background: #334155;
                }
            `}</style>
        </>
    );
}

function PaymentItem({
    title,
    value,
    blue = false,
}: {
    title: string;
    value: string;
    blue?: boolean;
}) {
    return (
        <div
            className="
                rounded-xl
                border
                border-white/[0.05]
                bg-black/20
                px-3
                py-2.5
            "
        >
            <div
                className={`
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-wider
                    ${blue ? "text-blue-400" : "text-slate-500"}
                `}
            >
                {title}
            </div>

            <div
                className="
                    mt-1
                    break-all
                    text-[11px]
                    font-medium
                    text-slate-300
                "
            >
                {value}
            </div>
        </div>
    );
}