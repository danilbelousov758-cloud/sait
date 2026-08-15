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

        const originalOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
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

            {/* МОДАЛЬНОЕ ОКНО */}

            {open && (
                <div
                    className="
                        fixed
                        inset-0
                        z-[9999]
                        overflow-y-auto
                        bg-black/80
                        px-3
                        py-3
                        backdrop-blur-sm
                        sm:px-4
                        sm:py-5
                    "
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    {/*
                        ВАЖНО:
                        Не используем items-center.
                        Поэтому верх окна никогда не уезжает
                        за пределы экрана.
                    */}

                    <div
                        className="
                            mx-auto
                            flex
                            w-full
                            max-w-[440px]
                            flex-col
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/10
                            bg-[#0D1117]
                            shadow-[0_25px_80px_rgba(0,0,0,0.65)]
                        "
                        style={{
                            maxHeight: "calc(100vh - 24px)",
                        }}
                    >
                        {/* ========================= */}
                        {/* HEADER */}
                        {/* ========================= */}

                        <div
                            className="
                                flex
                                shrink-0
                                items-center
                                justify-between
                                gap-3
                                border-b
                                border-white/[0.07]
                                bg-[#0D1117]
                                px-4
                                py-3.5
                                sm:px-5
                            "
                        >
                            <div className="min-w-0">
                                <h2
                                    className="
                                        text-base
                                        font-bold
                                        leading-tight
                                        text-white
                                    "
                                >
                                    Оформление заказа
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        text-[10px]
                                        leading-4
                                        text-slate-600
                                    "
                                >
                                    Оплата и подтверждение заказа
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
                                    border
                                    border-white/[0.06]
                                    bg-white/[0.035]
                                    text-sm
                                    text-slate-500
                                    transition
                                    hover:bg-white/[0.08]
                                    hover:text-white
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >
                                ×
                            </button>
                        </div>

                        {/* ========================= */}
                        {/* SCROLL CONTENT */}
                        {/* ========================= */}

                        <div
                            className="
                                min-h-0
                                flex-1
                                overflow-y-auto
                                overscroll-contain
                                px-4
                                py-3
                                sm:px-5
                            "
                            style={{
                                scrollbarWidth: "thin",
                                scrollbarColor:
                                    "#263242 transparent",
                            }}
                        >
                            {/* ТОВАР */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-white/[0.06]
                                    bg-black/20
                                    p-3
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
                                                truncate
                                                text-sm
                                                font-semibold
                                                text-white
                                            "
                                        >
                                            {productName}
                                        </div>

                                        <div
                                            className="
                                                mt-1
                                                truncate
                                                text-[10px]
                                                text-slate-600
                                            "
                                        >
                                            Продавец: {sellerName}
                                        </div>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        <div
                                            className="
                                                text-base
                                                font-bold
                                                text-white
                                            "
                                        >
                                            {price} ₽
                                        </div>

                                        <div
                                            className="
                                                mt-0.5
                                                text-[8px]
                                                uppercase
                                                tracking-wider
                                                text-slate-700
                                            "
                                        >
                                            стоимость
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ОПЛАТА */}

                            <div className="mt-4">
                                <div
                                    className="
                                        mb-2
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.16em]
                                        text-slate-600
                                    "
                                >
                                    Способы оплаты
                                </div>

                                <div
                                    className="
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-white/[0.06]
                                        bg-black/20
                                    "
                                >
                                    <div className="px-3 py-2.5">
                                        <div
                                            className="
                                                text-[11px]
                                                font-semibold
                                                text-slate-300
                                            "
                                        >
                                            СберБанк
                                        </div>

                                        <div
                                            className="
                                                mt-0.5
                                                text-[11px]
                                                tracking-wide
                                                text-slate-500
                                            "
                                        >
                                            2202 2088 8291 8056
                                        </div>
                                    </div>

                                    <div className="h-px bg-white/[0.05]" />

                                    <div className="px-3 py-2.5">
                                        <div
                                            className="
                                                text-[11px]
                                                font-semibold
                                                text-slate-300
                                            "
                                        >
                                            Т-Банк
                                        </div>

                                        <div
                                            className="
                                                mt-0.5
                                                text-[11px]
                                                tracking-wide
                                                text-slate-500
                                            "
                                        >
                                            5536 9177 2933 9314
                                        </div>
                                    </div>

                                    <div className="h-px bg-white/[0.05]" />

                                    <div className="px-3 py-2.5">
                                        <div
                                            className="
                                                text-[11px]
                                                font-semibold
                                                text-slate-300
                                            "
                                        >
                                            Donation Alerts
                                        </div>

                                        <div
                                            className="
                                                mt-0.5
                                                break-all
                                                text-[9px]
                                                leading-4
                                                text-slate-600
                                            "
                                        >
                                            donationalerts.com/r/galbraith1629
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ПРЕДУПРЕЖДЕНИЕ */}

                            <div
                                className="
                                    mt-3
                                    rounded-xl
                                    border
                                    border-amber-500/15
                                    bg-amber-500/[0.045]
                                    px-3
                                    py-2.5
                                "
                            >
                                <div className="flex gap-2">
                                    <span className="shrink-0 text-sm">
                                        ⚠️
                                    </span>

                                    <p
                                        className="
                                            text-[10px]
                                            leading-4
                                            text-slate-400
                                        "
                                    >
                                        <span className="font-semibold text-amber-300">
                                            Donation Alerts
                                        </span>{" "}
                                        удерживает комиссию{" "}
                                        <span className="font-semibold text-slate-300">
                                            15%
                                        </span>
                                        . Поэтому сумма доната должна покрывать
                                        стоимость товара с учётом комиссии.
                                        Если сумма будет меньше — потребуется{" "}
                                        <span className="font-semibold text-amber-300">
                                            доплата разницы
                                        </span>
                                        .
                                    </p>
                                </div>
                            </div>

                            {/* ПРОМОКОД */}

                            <div className="mt-4">
                                <label
                                    className="
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.16em]
                                        text-slate-600
                                    "
                                >
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
                                        rounded-xl
                                        border
                                        border-white/[0.08]
                                        bg-black/25
                                        px-3
                                        text-xs
                                        text-white
                                        outline-none
                                        transition
                                        placeholder:text-slate-700
                                        focus:border-blue-500/50
                                        focus:bg-black/35
                                        disabled:opacity-50
                                    "
                                    placeholder="Введите промокод"
                                />
                            </div>

                            {/* ИТОГО */}

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
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                    "
                                >
                                    <span
                                        className="
                                            text-[11px]
                                            text-slate-500
                                        "
                                    >
                                        Стоимость товара
                                    </span>

                                    <span
                                        className="
                                            text-base
                                            font-bold
                                            text-white
                                        "
                                    >
                                        {price} ₽
                                    </span>
                                </div>

                                <div
                                    className="
                                        mt-2
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                    "
                                >
                                    <span
                                        className="
                                            text-[10px]
                                            text-slate-700
                                        "
                                    >
                                        Сумма через Donation Alerts
                                    </span>

                                    <span
                                        className="
                                            text-[11px]
                                            font-medium
                                            text-slate-500
                                        "
                                    >
                                        {donationPrice} ₽
                                    </span>
                                </div>
                            </div>

                            {/* ОШИБКА */}

                            {error && (
                                <div
                                    className="
                                        mt-3
                                        rounded-xl
                                        border
                                        border-red-500/20
                                        bg-red-500/[0.07]
                                        px-3
                                        py-2.5
                                        text-[10px]
                                        leading-4
                                        text-red-300
                                    "
                                >
                                    {error}
                                </div>
                            )}

                            <div className="h-1" />
                        </div>

                        {/* ========================= */}
                        {/* FOOTER */}
                        {/* ========================= */}

                        <div
                            className="
                                shrink-0
                                border-t
                                border-white/[0.07]
                                bg-[#0D1117]
                                px-4
                                py-3
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
                                    rounded-xl
                                    bg-emerald-600
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

                            <p
                                className="
                                    mt-1.5
                                    text-center
                                    text-[8px]
                                    leading-3
                                    text-slate-700
                                "
                            >
                                После оплаты заказ поступит на проверку
                                администратору.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}