"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

type User = {
    id: number;
    username: string;
    avatar?: string | null;
    role?: string;
};

type Order = {
    id: number;
    product: string;
    buyer: string;
    price: number;
    status:
        | "Новый"
        | "В обработке"
        | "Завершён"
        | "Отменён";
    date: string;
};

const roleNames: Record<string, string> = {
    USER: "Пользователь",
    SELLER: "Продавец",
    ADMIN: "Администратор",
    FOUNDER: "Основатель",
};

export default function OrdersPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loaded, setLoaded] = useState(false);

    const [orders] = useState<Order[]>([]);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem("user");

            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (error) {
            console.error(
                "Ошибка загрузки пользователя:",
                error
            );
        } finally {
            setLoaded(true);
        }
    }, []);

    const role = user?.role?.toUpperCase() || "USER";

    const roleName =
        roleNames[role] || "Пользователь";

    const firstLetter =
        user?.username?.trim().charAt(0).toUpperCase() || "?";

    const hasAccess =
        role === "SELLER" ||
        role === "ADMIN" ||
        role === "FOUNDER";

    if (!loaded) {
        return (
            <main className="min-h-screen bg-[#080B10]" />
        );
    }

    if (!user || !hasAccess) {
        return (
            <>
                <Header />

                <main className="flex min-h-screen items-center justify-center bg-[#080B10] px-5 pt-24 text-white">
                    <div className="w-full max-w-md text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-[#11161D] text-2xl">
                            🔒
                        </div>

                        <h1 className="mt-5 text-2xl font-bold">
                            Доступ запрещён
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            У вашего аккаунта нет доступа к заказам.
                        </p>

                        <Link
                            href="/"
                            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                        >
                            На главную
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    const newOrders = orders.filter(
        (order) => order.status === "Новый"
    ).length;

    const processingOrders = orders.filter(
        (order) => order.status === "В обработке"
    ).length;

    const completedOrders = orders.filter(
        (order) => order.status === "Завершён"
    ).length;

    return (
        <>
            <Header />

            <main className="min-h-screen bg-[#080B10] pt-[95px] text-slate-100">
                {/* Фон */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="absolute left-1/2 top-[-300px] h-[550px] w-[750px] -translate-x-1/2 rounded-full bg-blue-600/[0.055] blur-[160px]" />

                    <div className="absolute bottom-[-250px] right-[-200px] h-[500px] w-[500px] rounded-full bg-blue-500/[0.025] blur-[160px]" />
                </div>

                <div className="relative flex min-h-[calc(100vh-95px)]">
                    {/* Боковая панель */}
                    <aside className="fixed bottom-0 left-0 top-[95px] hidden w-[250px] border-r border-white/[0.06] bg-[#0A0D12] lg:block">
                        <div className="flex h-full flex-col">
                            {/* Пользователь */}
                            <div className="border-b border-white/[0.06] p-4">
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/[0.035]"
                                >
                                    {user.avatar ? (
                                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-black">
                                            <img
                                                src={user.avatar}
                                                alt={user.username}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
                                            {firstLetter}
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-xs font-semibold text-white">
                                            {user.username}
                                        </div>

                                        <div className="mt-1 flex w-fit rounded-md bg-blue-600 px-2 py-0.5 text-[9px] font-semibold text-white">
                                            {roleName}
                                        </div>
                                    </div>

                                    <span className="text-xs text-slate-700">
                                        →
                                    </span>
                                </Link>
                            </div>

                            {/* Меню */}
                            <nav className="flex-1 overflow-y-auto px-3 py-5">
                                <div className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-700">
                                    Магазин
                                </div>

                                <div className="space-y-1">
                                    <PanelLink
                                        href="/seller"
                                        icon="⌂"
                                        title="Обзор"
                                    />

                                    <PanelLink
                                        href="/seller/products"
                                        icon="▦"
                                        title="Мои товары"
                                    />

                                    <PanelLink
                                        href="/seller/orders"
                                        icon="◫"
                                        title="Заказы"
                                        active
                                    />
                                </div>
                            </nav>

                            {/* Низ */}
                            <div className="border-t border-white/[0.06] p-3">
                                <Link
                                    href="/"
                                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 transition hover:bg-white/[0.035] hover:text-white"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#11161D] text-xs">
                                        ←
                                    </div>

                                    <div className="flex-1">
                                        <div className="text-xs font-semibold">
                                            На сайт
                                        </div>

                                        <div className="mt-0.5 text-[9px] text-slate-700">
                                            Вернуться в магазин
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Основная часть */}
                    <section className="min-w-0 flex-1 lg:ml-[250px]">
                        {/* Заголовок */}
                        <header className="border-b border-white/[0.06] px-5 py-6 sm:px-8">
                            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                                <div>
                                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-500">
                                        MAZEPOV CONNEXTION
                                    </div>

                                    <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                                        Заказы
                                    </h1>

                                    <p className="mt-1 text-xs text-slate-600">
                                        Управление заказами вашего магазина.
                                    </p>
                                </div>

                                <Link
                                    href="/seller/products"
                                    className="inline-flex w-fit items-center rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                                >
                                    Мои товары
                                </Link>
                            </div>
                        </header>

                        {/* Контент */}
                        <div className="mx-auto max-w-7xl p-5 sm:p-8">
                            {/* Верхняя статистика */}
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <InfoCard
                                    title="Всего заказов"
                                    value={orders.length.toString()}
                                    icon="◫"
                                />

                                <InfoCard
                                    title="Новые"
                                    value={newOrders.toString()}
                                    icon="!"
                                />

                                <InfoCard
                                    title="В обработке"
                                    value={processingOrders.toString()}
                                    icon="⌁"
                                />

                                <InfoCard
                                    title="Завершено"
                                    value={completedOrders.toString()}
                                    icon="✓"
                                />
                            </div>

                            {/* Заказы */}
                            <div className="mt-5 rounded-[20px] border border-white/[0.07] bg-[#0D1117]">
                                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-5 sm:px-6">
                                    <div>
                                        <h2 className="text-base font-semibold text-white">
                                            Все заказы
                                        </h2>

                                        <p className="mt-1 text-xs text-slate-600">
                                            Заказы покупателей вашего магазина.
                                        </p>
                                    </div>

                                    <div className="hidden rounded-lg bg-white/[0.025] px-3 py-2 text-[10px] text-slate-600 sm:block">
                                        {orders.length} заказов
                                    </div>
                                </div>

                                {orders.length === 0 ? (
                                    <div className="flex min-h-[390px] items-center justify-center px-5">
                                        <div className="text-center">
                                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#11161D] text-2xl text-slate-700">
                                                ◫
                                            </div>

                                            <h3 className="mt-5 text-sm font-semibold text-slate-400">
                                                У вас пока нет заказов
                                            </h3>

                                            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-700">
                                                Когда покупатель приобретёт
                                                ваш товар, информация о заказе
                                                появится здесь.
                                            </p>

                                            <Link
                                                href="/seller/products"
                                                className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
                                            >
                                                Перейти к товарам
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-white/[0.05]">
                                        {orders.map((order) => (
                                            <OrderRow
                                                key={order.id}
                                                order={order}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Информационный блок */}
                            <div className="mt-5 rounded-[20px] border border-blue-500/[0.12] bg-blue-500/[0.025] p-5">
                                <div className="flex gap-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/[0.08] text-sm text-blue-400">
                                        i
                                    </div>

                                    <div>
                                        <div className="text-sm font-semibold text-slate-300">
                                            Как работают заказы
                                        </div>

                                        <p className="mt-1 text-xs leading-5 text-slate-600">
                                            После покупки товара покупателем
                                            новый заказ появится в этом разделе.
                                            Здесь вы сможете отслеживать его
                                            статус и информацию о покупке.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

function PanelLink({
    href,
    icon,
    title,
    active = false,
}: {
    href: string;
    icon: string;
    title: string;
    active?: boolean;
}) {
    return (
        <Link
            href={href}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                    : "text-slate-500 hover:bg-white/[0.035] hover:text-white"
            }`}
        >
            <span
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm ${
                    active
                        ? "bg-white/[0.12] text-white"
                        : "bg-white/[0.025] text-slate-600 group-hover:text-blue-400"
                }`}
            >
                {icon}
            </span>

            <span className="flex-1">
                {title}
            </span>

            {!active && (
                <span className="text-xs text-slate-800 transition group-hover:text-slate-500">
                    →
                </span>
            )}
        </Link>
    );
}

function InfoCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: string;
    icon: string;
}) {
    return (
        <div className="rounded-[18px] border border-white/[0.07] bg-[#0D1117] p-5 transition hover:border-white/[0.1]">
            <div className="flex items-start justify-between">
                <div>
                    <div className="text-xs text-slate-600">
                        {title}
                    </div>

                    <div className="mt-2 text-2xl font-bold tracking-tight text-white">
                        {value}
                    </div>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/[0.07] text-sm text-blue-400">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function OrderRow({
    order,
}: {
    order: Order;
}) {
    const getStatusClass = () => {
        switch (order.status) {
            case "Новый":
                return "bg-blue-500/[0.08] text-blue-400";

            case "В обработке":
                return "bg-yellow-500/[0.08] text-yellow-400";

            case "Завершён":
                return "bg-green-500/[0.08] text-green-400";

            case "Отменён":
                return "bg-red-500/[0.08] text-red-400";

            default:
                return "bg-white/[0.05] text-slate-500";
        }
    };

    return (
        <div className="flex flex-col gap-4 px-5 py-4 transition hover:bg-white/[0.015] sm:flex-row sm:items-center sm:px-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#11161D] text-sm text-slate-600">
                ◫
            </div>

            <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-white">
                    {order.product}
                </div>

                <div className="mt-1 text-[10px] text-slate-700">
                    Покупатель: {order.buyer}
                </div>
            </div>

            <div className="text-sm font-semibold text-slate-300">
                {order.price} ₽
            </div>

            <div
                className={`w-fit rounded-lg px-2.5 py-1 text-[10px] font-semibold ${getStatusClass()}`}
            >
                {order.status}
            </div>

            <div className="text-[10px] text-slate-700">
                {order.date}
            </div>

            <Link
                href={`/seller/orders/${order.id}`}
                className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-xs text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
            >
                Открыть
            </Link>
        </div>
    );
}