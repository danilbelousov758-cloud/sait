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
                        z-[9999]
                        overflow-y-auto
                        bg-black/80
                        backdrop-blur-md
                    "
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    {/* КОНТЕЙНЕР */}

                    <div
                        className="
                            flex
                            min-h-full
                            items-start
                            justify-center
                            px-3
                            py-3
                            sm:px-4
                            sm:py-5
                        "
                    >
                        <div
                            className="
                                flex
                                w-full
                                max-w-[440px]
                                flex-col
                                overflow-hidden
                                rounded-2xl
                                border
                                border-white/[0.08]
                                bg-[#0C1016]
                                shadow-[0_25px_80px_rgba(0,0,0,0.7)]
                            "
                            onMouseDown={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            {/* ========================= */}
                            {/* HEADER — ВСЕГДА СВЕРХУ */}
                            {/* ========================= */}

                            <div
                                className="
                                    flex
                                    shrink-0
                                    items-center
                                    justify-between
                                    border-b
                                    border-white/[0.06]
                                    bg-[#0D1117]
                                    px-4
                                    py-3
                                "
                            >
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="
                                                flex
                                                h-7
                                                w-7
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-lg
                                                bg-blue-500/10
                                                text-xs
                                                font-bold
                                                text-blue-400
                                            "
                                        >
                                            ₽
                                        </div>

                                        <h2 className="text-sm font-bold text-white">
                                            Оформление заказа
                                        </h2>
                                    </div>

                                    <p className="mt-1 text-[10px] text-slate-600">
                                        Проверьте данные перед оплатой
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={loading}
                                    className="
                                        ml-3
                                        flex
                                        h-8
                                        w-8
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        border
                                        border-white/[0.05]
                                        bg-white/[0.03]
                                        text-lg
                                        leading-none
                                        text-slate-500
                                        transition
                                        hover:bg-white/[0.07]
                                        hover:text-white
                                        disabled:opacity-40
                                    "
                                >
                                    ×
                                </button>
                            </div>

                            {/* ========================= */}
                            {/* ПРОКРУЧИВАЕМОЕ СОДЕРЖИМОЕ */}
                            {/* ========================= */}

                            <div
                                className="
                                    max-h-[calc(100vh-150px)]
                                    overflow-y-auto
                                    px-4
                                    py-3
                                    sm:max-h-[calc(100vh-170px)]
                                    sm:py-4
                                "
                                style={{
                                    scrollbarWidth: "thin",
                                    scrollbarColor:
                                        "#26303D #0A0E13",
                                }}
                            >
                                {/* ТОВАР */}

                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-white/[0.06]
                                        bg-[#090D12]
                                        p-3
                                    "
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-lg
                                                bg-blue-500/10
                                                text-[9px]
                                                font-bold
                                                text-blue-400
                                            "
                                        >
                                            MOD
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-sm font-semibold text-white">
                                                {productName}
                                            </div>

                                            <div className="mt-0.5 truncate text-[10px] text-slate-600">
                                                Автор: {sellerName}
                                            </div>
                                        </div>

                                        <div className="shrink-0 text-right">
                                            <div className="text-base font-bold text-white">
                                                {price} ₽
                                            </div>

                                            <div className="text-[9px] uppercase tracking-wider text-slate-700">
                                                товар
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* СПОСОБЫ ОПЛАТЫ */}

                                <div className="mt-3">
                                    <div
                                        className="
                                            mb-2
                                            flex
                                            items-center
                                            gap-2
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-widest
                                            text-slate-600
                                        "
                                    >
                                        <span>
                                            Способы оплаты
                                        </span>

                                        <span className="h-px flex-1 bg-white/[0.05]" />
                                    </div>

                                    <div
                                        className="
                                            overflow-hidden
                                            rounded-xl
                                            border
                                            border-white/[0.06]
                                            bg-[#090D12]
                                        "
                                    >
                                        {/* СБЕР */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-3
                                                px-3
                                                py-2.5
                                            "
                                        >
                                            <div>
                                                <div className="text-xs font-semibold text-white">
                                                    СберБанк
                                                </div>

                                                <div className="mt-0.5 text-[10px] text-slate-600">
                                                    Номер карты
                                                </div>
                                            </div>

                                            <div
                                                className="
                                                    rounded-lg
                                                    bg-white/[0.035]
                                                    px-2
                                                    py-1.5
                                                    font-mono
                                                    text-[10px]
                                                    text-slate-400
                                                "
                                            >
                                                2202 2088 8291 8056
                                            </div>
                                        </div>

                                        <div className="h-px bg-white/[0.05]" />

                                        {/* Т-БАНК */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-3
                                                px-3
                                                py-2.5
                                            "
                                        >
                                            <div>
                                                <div className="text-xs font-semibold text-white">
                                                    Т-Банк
                                                </div>

                                                <div className="mt-0.5 text-[10px] text-slate-600">
                                                    Номер карты
                                                </div>
                                            </div>

                                            <div
                                                className="
                                                    rounded-lg
                                                    bg-white/[0.035]
                                                    px-2
                                                    py-1.5
                                                    font-mono
                                                    text-[10px]
                                                    text-slate-400
                                                "
                                            >
                                                5536 9177 2933 9314
                                            </div>
                                        </div>

                                        <div className="h-px bg-white/[0.05]" />

                                        {/* DONATION ALERTS */}

                                        <div className="px-3 py-2.5">
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <div className="text-xs font-semibold text-white">
                                                        Donation Alerts
                                                    </div>

                                                    <div className="mt-0.5 text-[10px] text-slate-600">
                                                        С учётом комиссии 15%
                                                    </div>
                                                </div>

                                                <div className="text-xs font-semibold text-blue-400">
                                                    {donationPrice} ₽
                                                </div>
                                            </div>

                                            <div
                                                className="
                                                    mt-2
                                                    rounded-lg
                                                    bg-black/20
                                                    px-2.5
                                                    py-2
                                                    text-[10px]
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
                                        p-3
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
                                                bg-amber-400/10
                                                text-xs
                                            "
                                        >
                                            ⚠️
                                        </div>

                                        <div>
                                            <div className="text-[11px] font-semibold text-amber-300">
                                                Важно
                                            </div>

                                            <p className="mt-1 text-[10px] leading-4 text-slate-500">
                                                Donation Alerts удерживает{" "}
                                                <b className="text-slate-300">
                                                    15%
                                                </b>{" "}
                                                комиссии. Для получения полной
                                                стоимости товара необходимо
                                                отправить{" "}
                                                <b className="text-slate-300">
                                                    {donationPrice} ₽
                                                </b>
                                                .
                                            </p>

                                            <p className="mt-1 text-[10px] leading-4 text-slate-500">
                                                Если поступит меньше необходимой
                                                суммы, потребуется{" "}
                                                <b className="text-amber-300">
                                                    доплатить разницу
                                                </b>
                                                .
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ПРОМОКОД */}

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
                                            bg-[#090D12]
                                            px-3
                                            text-xs
                                            text-white
                                            outline-none
                                            transition
                                            placeholder:text-slate-700
                                            focus:border-blue-500/40
                                            disabled:opacity-50
                                        "
                                        placeholder="Введите промокод"
                                    />
                                </div>

                                {/* ИТОГО */}

                                <div
                                    className="
                                        mt-3
                                        rounded-xl
                                        border
                                        border-blue-500/10
                                        bg-blue-500/[0.035]
                                        p-3
                                    "
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500">
                                            К оплате
                                        </span>

                                        <span className="text-xl font-bold text-white">
                                            {price} ₽
                                        </span>
                                    </div>

                                    <div className="mt-1 flex items-center justify-between">
                                        <span className="text-[10px] text-slate-700">
                                            Через Donation Alerts
                                        </span>

                                        <span className="text-[10px] font-medium text-blue-400">
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
                            </div>

                            {/* ========================= */}
                            {/* НИЖНЯЯ КНОПКА */}
                            {/* ========================= */}

                            <div
                                className="
                                    shrink-0
                                    border-t
                                    border-white/[0.06]
                                    bg-[#0D1117]
                                    px-4
                                    py-3
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
                                        active:scale-[0.99]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    {loading
                                        ? "Создание заказа..."
                                        : "Я оплатил"}
                                </button>

                                <p className="mt-1.5 text-center text-[9px] text-slate-700">
                                    После оплаты заказ будет проверен
                                    администратором.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}