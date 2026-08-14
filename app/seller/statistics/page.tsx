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

const roleNames: Record<string, string> = {
    USER: "Пользователь",
    SELLER: "Продавец",
    ADMIN: "Администратор",
    FOUNDER: "Основатель",
};

export default function SellerStatisticsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [period, setPeriod] = useState("За всё время");

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem("user");

            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (error) {
            console.error("Ошибка загрузки пользователя:", error);
        } finally {
            setLoaded(true);
        }
    }, []);

    const role = user?.role?.toUpperCase() || "USER";

    const roleName =
        roleNames[role] || "Пользователь";

    const firstLetter =
        user?.username?.trim().charAt(0).toUpperCase() || "?";

    if (!loaded) {
        return (
            <main className="min-h-screen bg-[#080B10]" />
        );
    }

    if (
        !user ||
        !["SELLER", "ADMIN", "FOUNDER"].includes(role)
    ) {
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
                            У вашего аккаунта нет прав для просмотра статистики продавца.
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
                                        href="/seller/products/create"
                                        icon="+"
                                        title="Добавить товар"
                                    />

                                    <PanelLink
                                        href="/seller/sales"
                                        icon="↗"
                                        title="Мои продажи"
                                    />

                                    <PanelLink
                                        href="/seller/orders"
                                        icon="◫"
                                        title="Заказы"
                                    />

                                    <PanelLink
                                        href="/seller/finance"
                                        icon="₽"
                                        title="Финансы"
                                    />

                                    <PanelLink
                                        href="/seller/statistics"
                                        icon="⌁"
                                        title="Статистика"
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
                                        Статистика
                                    </h1>

                                    <p className="mt-1 text-xs text-slate-600">
                                        Аналитика вашего магазина и продаж.
                                    </p>

                                </div>

                                {/* Период */}
                                <div className="flex rounded-xl border border-white/[0.07] bg-[#0D1117] p-1">

                                    {[
                                        "7 дней",
                                        "30 дней",
                                        "За всё время",
                                    ].map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() =>
                                                setPeriod(item)
                                            }
                                            className={`rounded-lg px-3 py-2 text-[11px] font-medium transition ${
                                                period === item
                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                                                    : "text-slate-500 hover:text-white"
                                            }`}
                                        >
                                            {item}
                                        </button>
                                    ))}

                                </div>

                            </div>

                        </header>

                        {/* Контент */}
                        <div className="mx-auto max-w-7xl p-5 sm:p-8">

                            {/* Карточки */}
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                                <StatCard
                                    title="Доход"
                                    value="0 ₽"
                                    description={period}
                                    icon="₽"
                                />

                                <StatCard
                                    title="Продажи"
                                    value="0"
                                    description={period}
                                    icon="↗"
                                />

                                <StatCard
                                    title="Заказы"
                                    value="0"
                                    description={period}
                                    icon="◫"
                                />

                                <StatCard
                                    title="Просмотры"
                                    value="0"
                                    description={period}
                                    icon="◉"
                                />

                            </div>

                            {/* Основные графики */}
                            <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">

                                {/* Доход */}
                                <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-6">

                                    <div className="flex items-start justify-between">

                                        <div>
                                            <h2 className="text-base font-semibold text-white">
                                                Доход
                                            </h2>

                                            <p className="mt-1 text-xs text-slate-600">
                                                Динамика дохода за выбранный период.
                                            </p>
                                        </div>

                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/[0.07] text-sm text-blue-400">
                                            ₽
                                        </div>

                                    </div>

                                    <div className="mt-6 flex h-[280px] items-center justify-center rounded-2xl border border-white/[0.04] bg-[#0A0E13]">

                                        <div className="text-center">

                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#11161D] text-xl text-slate-600">
                                                ⌁
                                            </div>

                                            <div className="mt-4 text-sm font-medium text-slate-500">
                                                Пока нет данных
                                            </div>

                                            <p className="mt-1 text-xs text-slate-700">
                                                График появится после первых продаж.
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                {/* Продажи */}
                                <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-6">

                                    <h2 className="text-base font-semibold text-white">
                                        Продажи
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-600">
                                        Сводка по продажам.
                                    </p>

                                    <div className="mt-6 space-y-3">

                                        <ProgressRow
                                            title="Оплаченные"
                                            value="0"
                                            percent={0}
                                        />

                                        <ProgressRow
                                            title="Ожидают оплаты"
                                            value="0"
                                            percent={0}
                                        />

                                        <ProgressRow
                                            title="Отменённые"
                                            value="0"
                                            percent={0}
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* Нижние блоки */}
                            <div className="mt-5 grid gap-5 lg:grid-cols-3">

                                {/* Товары */}
                                <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-6">

                                    <div className="flex items-center justify-between">

                                        <div>
                                            <h2 className="text-base font-semibold text-white">
                                                Товары
                                            </h2>

                                            <p className="mt-1 text-xs text-slate-600">
                                                Состояние магазина.
                                            </p>
                                        </div>

                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/[0.07] text-sm text-blue-400">
                                            ▦
                                        </div>

                                    </div>

                                    <div className="mt-5 space-y-3">

                                        <MiniStat
                                            title="Всего товаров"
                                            value="0"
                                        />

                                        <MiniStat
                                            title="Опубликовано"
                                            value="0"
                                        />

                                        <MiniStat
                                            title="Черновики"
                                            value="0"
                                        />

                                    </div>

                                </div>

                                {/* Клиенты */}
                                <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-6">

                                    <div className="flex items-center justify-between">

                                        <div>
                                            <h2 className="text-base font-semibold text-white">
                                                Покупатели
                                            </h2>

                                            <p className="mt-1 text-xs text-slate-600">
                                                Активность покупателей.
                                            </p>
                                        </div>

                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/[0.07] text-sm text-blue-400">
                                            👤
                                        </div>

                                    </div>

                                    <div className="mt-5">

                                        <div className="rounded-xl border border-white/[0.05] bg-[#11161D] p-4">

                                            <div className="text-xs text-slate-600">
                                                Покупателей
                                            </div>

                                            <div className="mt-2 text-2xl font-bold text-white">
                                                0
                                            </div>

                                            <div className="mt-1 text-[10px] text-slate-700">
                                                За выбранный период
                                            </div>

                                        </div>

                                    </div>

                                </div>

                                {/* Конверсия */}
                                <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-6">

                                    <div className="flex items-center justify-between">

                                        <div>
                                            <h2 className="text-base font-semibold text-white">
                                                Конверсия
                                            </h2>

                                            <p className="mt-1 text-xs text-slate-600">
                                                Просмотры → покупки.
                                            </p>
                                        </div>

                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/[0.07] text-sm text-blue-400">
                                            %
                                        </div>

                                    </div>

                                    <div className="mt-5 flex items-center justify-center rounded-xl border border-white/[0.05] bg-[#11161D] py-7">

                                        <div className="text-center">

                                            <div className="text-3xl font-bold text-white">
                                                0%
                                            </div>

                                            <div className="mt-1 text-[10px] text-slate-700">
                                                Пока недостаточно данных
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* Информация */}
                            <div className="mt-5 rounded-[20px] border border-blue-500/[0.12] bg-blue-500/[0.025] p-5">

                                <div className="flex gap-4">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/[0.08] text-sm text-blue-400">
                                        i
                                    </div>

                                    <div>

                                        <div className="text-sm font-semibold text-slate-300">
                                            Статистика пока пустая
                                        </div>

                                        <p className="mt-1 text-xs leading-5 text-slate-600">
                                            После появления товаров и первых
                                            продаж здесь начнут отображаться
                                            доход, количество заказов,
                                            просмотры и другая аналитика.
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

function StatCard({
    title,
    value,
    description,
    icon,
}: {
    title: string;
    value: string;
    description: string;
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

                    <div className="mt-1 text-[10px] text-slate-700">
                        {description}
                    </div>

                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/[0.07] text-sm text-blue-400">
                    {icon}
                </div>

            </div>

        </div>
    );
}

function ProgressRow({
    title,
    value,
    percent,
}: {
    title: string;
    value: string;
    percent: number;
}) {
    return (
        <div>

            <div className="flex items-center justify-between">

                <span className="text-xs text-slate-500">
                    {title}
                </span>

                <span className="text-xs font-semibold text-slate-300">
                    {value}
                </span>

            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.04]">

                <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{
                        width: `${percent}%`,
                    }}
                />

            </div>

        </div>
    );
}

function MiniStat({
    title,
    value,
}: {
    title: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-[#11161D] px-4 py-3">

            <span className="text-xs text-slate-500">
                {title}
            </span>

            <span className="text-sm font-semibold text-white">
                {value}
            </span>

        </div>
    );
}