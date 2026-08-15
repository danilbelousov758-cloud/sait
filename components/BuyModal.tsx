"use client";

import { useEffect, useState } from "react";
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

    useEffect(() => {
        if (!open) return;

        const oldOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = oldOverflow;
        };
    }, [open]);

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
            {/* КНОПКА КУПИТЬ */}

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
                    gap-2
                    rounded-xl
                    bg-blue-600
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-blue-600/10
                    transition
                    duration-200
                    hover:bg-blue-500
                    hover:shadow-blue-600/20
                    active:scale-[0.99]
                "
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M6 6h15l-1.5 9H8z" />
                    <path d="M6 6 5 3H2" />
                    <circle cx="9" cy="20" r="1" />
                    <circle cx="18" cy="20" r="1" />
                </svg>

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
                        overflow-hidden
                        bg-black/80
                        px-3
                        py-3
                        backdrop-blur-md
                        sm:px-4
                        sm:py-5
                    "
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    {/* ОКНО */}

                    <div
                        className="
                            flex
                            max-h-[calc(100vh-24px)]
                            w-full
                            max-w-[440px]
                            flex-col
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/[0.10]
                            bg-[#0B0F15]
                            shadow-[0_25px_80px_rgba(0,0,0,0.65)]
                            sm:max-h-[calc(100vh-40px)]
                        "
                    >
                        {/* HEADER */}

                        <div
                            className="
                                relative
                                shrink-0
                                border-b
                                border-white/[0.06]
                                px-4
                                py-3.5
                                sm:px-5
                            "
                        >
                            <div
                                className="
                                    absolute
                                    left-0
                                    top-0
                                    h-px
                                    w-full
                                    bg-gradient-to-r
                                    from-transparent
                                    via-blue-500/50
                                    to-transparent
                                "
                            />

                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            border
                                            border-blue-500/20
                                            bg-blue-500/10
                                            text-blue-400
                                        "
                                    >
                                        <svg
                                            width="17"
                                            height="17"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M6 6h15l-1.5 9H8z" />
                                            <path d="M6 6 5 3H2" />
                                            <circle cx="9" cy="20" r="1" />
                                            <circle cx="18" cy="20" r="1" />
                                        </svg>
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-bold text-white">
                                            Покупка мода
                                        </h2>

                                        <p className="mt-0.5 text-[10px] text-slate-600">
                                            Оформление заказа
                                        </p>
                                    </div>
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
                                        border
                                        border-white/[0.05]
                                        bg-white/[0.025]
                                        text-sm
                                        text-slate-500
                                        transition
                                        hover:border-white/10
                                        hover:bg-white/[0.06]
                                        hover:text-white
                                        disabled:opacity-50
                                    "
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* SCROLL */}

                        <div
                            className="
                                min-h-0
                                flex-1
                                overflow-y-auto
                                overscroll-contain
                                px-4
                                py-4
                                sm:px-5
                            "
                            style={{
                                scrollbarWidth: "thin",
                            }}
                        >
                            {/* PRODUCT CARD */}

                            <div
                                className="
                                    relative
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-white/[0.07]
                                    bg-gradient-to-br
                                    from-white/[0.045]
                                    to-white/[0.015]
                                    p-3.5
                                "
                            >
                                <div
                                    className="
                                        absolute
                                        right-[-35px]
                                        top-[-35px]
                                        h-24
                                        w-24
                                        rounded-full
                                        bg-blue-500/[0.06]
                                        blur-2xl
                                    "
                                />

                                <div className="relative flex items-center justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
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
                                                <path d="M4 5h16v14H4z" />
                                                <path d="m4 8 4 3 4-3 4 3 4-3" />
                                            </svg>
                                        </div>

                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-semibold text-white">
                                                {productName}
                                            </div>

                                            <div className="mt-1 truncate text-[10px] text-slate-600">
                                                Автор: {sellerName}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        <div className="text-base font-bold text-white">
                                            {price} ₽
                                        </div>

                                        <div
                                            className="
                                                mt-0.5
                                                text-[8px]
                                                font-medium
                                                uppercase
                                                tracking-wider
                                                text-blue-400
                                            "
                                        >
                                            МОД
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PAYMENT TITLE */}

                            <div className="mt-5">
                                <div className="flex items-center gap-2">
                                    <div className="h-px flex-1 bg-white/[0.05]" />

                                    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                                        Оплата
                                    </span>

                                    <div className="h-px flex-1 bg-white/[0.05]" />
                                </div>
                            </div>

                            {/* PAYMENT METHODS */}

                            <div className="mt-3 space-y-2">
                                <PaymentRow
                                    name="СберБанк"
                                    value="2202 2088 8291 8056"
                                    icon="₽"
                                />

                                <PaymentRow
                                    name="Т-Банк"
                                    value="5536 9177 2933 9314"
                                    icon="₽"
                                />

                                <PaymentRow
                                    name="Donation Alerts"
                                    value="donationalerts.com/r/galbraith1629"
                                    icon="D"
                                />
                            </div>

                            {/* DONATION WARNING */}

                            <div
                                className="
                                    mt-3
                                    rounded-xl
                                    border
                                    border-amber-500/15
                                    bg-amber-500/[0.045]
                                    p-3
                                "
                            >
                                <div className="flex items-start gap-2.5">
                                    <div
                                        className="
                                            flex
                                            h-7
                                            w-7
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
                                            Обратите внимание
                                        </div>

                                        <p className="mt-1 text-[10px] leading-4 text-slate-500">
                                            Donation Alerts удерживает{" "}
                                            <b className="text-slate-300">
                                                15%
                                            </b>{" "}
                                            комиссии. Поэтому необходимо
                                            отправить{" "}
                                            <b className="text-amber-300">
                                                {donationPrice} ₽
                                            </b>
                                            . Если сумма будет меньше —
                                            потребуется доплата разницы.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* PROMO */}

                            <div className="mt-5">
                                <label
                                    htmlFor="promo"
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-widest
                                        text-slate-600
                                    "
                                >
                                    <span>Промокод</span>

                                    <span className="normal-case tracking-normal text-slate-700">
                                        Необязательно
                                    </span>
                                </label>

                                <div className="relative mt-2">
                                    <input
                                        id="promo"
                                        value={promo}
                                        onChange={(e) =>
                                            setPromo(e.target.value)
                                        }
                                        disabled={loading}
                                        className="
                                            h-10
                                            w-full
                                            rounded-xl
                                            border
                                            border-white/[0.07]
                                            bg-black/20
                                            px-3
                                            text-xs
                                            text-white
                                            outline-none
                                            transition
                                            placeholder:text-slate-700
                                            focus:border-blue-500/40
                                            focus:bg-blue-500/[0.02]
                                            disabled:opacity-50
                                        "
                                        placeholder="Введите промокод"
                                    />
                                </div>
                            </div>

                            {/* PRICE */}

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
                                    <span className="text-[11px] text-slate-500">
                                        Стоимость товара
                                    </span>

                                    <span className="text-xs font-medium text-slate-300">
                                        {price} ₽
                                    </span>
                                </div>

                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-[11px] text-slate-500">
                                        Через Donation Alerts
                                    </span>

                                    <span className="text-xs font-medium text-slate-300">
                                        {donationPrice} ₽
                                    </span>
                                </div>

                                <div className="my-3 h-px bg-white/[0.06]" />

                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-white">
                                        Итого
                                    </span>

                                    <span className="text-lg font-bold text-blue-400">
                                        {price} ₽
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
                                        border-red-500/20
                                        bg-red-500/[0.07]
                                        p-3
                                    "
                                >
                                    <div className="flex items-start gap-2">
                                        <span className="text-xs">
                                            ⚠️
                                        </span>

                                        <p className="text-[10px] leading-4 text-red-300">
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="h-2" />
                        </div>

                        {/* FOOTER */}

                        <div
                            className="
                                shrink-0
                                border-t
                                border-white/[0.06]
                                bg-[#0B0F15]/95
                                px-4
                                py-3
                                backdrop-blur-xl
                                sm:px-5
                            "
                        >
                            <button
                                type="button"
                                onClick={buy}
                                disabled={loading}
                                className="
                                    flex
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-emerald-600
                                    py-2.5
                                    text-xs
                                    font-semibold
                                    text-white
                                    shadow-lg
                                    shadow-emerald-600/10
                                    transition
                                    hover:bg-emerald-500
                                    hover:shadow-emerald-500/20
                                    active:scale-[0.99]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                {loading ? (
                                    <>
                                        <svg
                                            className="animate-spin"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="9"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                opacity="0.25"
                                            />

                                            <path
                                                d="M21 12a9 9 0 0 1-9 9"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                            />
                                        </svg>

                                        Создание заказа...
                                    </>
                                ) : (
                                    <>
                                        Я оплатил

                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M5 12h14" />
                                            <path d="m13 6 6 6-6 6" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            <p className="mt-1.5 text-center text-[9px] text-slate-700">
                                Заказ поступит на проверку администратору
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/* =========================================================
   PAYMENT ROW
========================================================= */

function PaymentRow({
    name,
    value,
    icon,
}: {
    name: string;
    value: string;
    icon: string;
}) {
    return (
        <div
            className="
                group
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-white/[0.06]
                bg-black/20
                px-3
                py-2.5
                transition
                hover:border-white/[0.10]
                hover:bg-white/[0.025]
            "
        >
            <div
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
                    bg-white/[0.025]
                    text-[11px]
                    font-bold
                    text-slate-400
                "
            >
                {icon}
            </div>

            <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold text-slate-300">
                    {name}
                </div>

                <div
                    className="
                        mt-0.5
                        truncate
                        text-[9px]
                        text-slate-600
                    "
                >
                    {value}
                </div>
            </div>

            <div
                className="
                    shrink-0
                    text-[10px]
                    text-slate-700
                    transition
                    group-hover:text-slate-500
                "
            >
                ✓
            </div>
        </div>
    );
}