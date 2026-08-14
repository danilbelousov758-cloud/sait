"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
    id: number;
    username: string;
    avatar?: string | null;
    role?: string;
};

export default function SellerPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loaded, setLoaded] = useState(false);

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

    const hasAccess =
        role === "SELLER" ||
        role === "ADMIN" ||
        role === "FOUNDER";

    const firstLetter =
        user?.username?.trim().charAt(0).toUpperCase() || "?";

    if (!loaded) {
        return (
            <main className="min-h-screen bg-[#080B10]" />
        );
    }

    if (!user || !hasAccess) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#080B10] px-5 text-white">
                <div className="w-full max-w-md rounded-[24px] border border-white/[0.07] bg-[#0D1117] p-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/[0.07] text-2xl">
                        🔒
                    </div>

                    <h1 className="mt-5 text-2xl font-bold">
                        Доступ запрещён
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Эта панель доступна только продавцам,
                        администраторам и основателю.
                    </p>

                    <Link
                        href="/"
                        className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                    >
                        Вернуться на сайт
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#080B10] text-slate-100">

            {/* Фон */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-[-300px] h-[550px] w-[750px] -translate-x-1/2 rounded-full bg-blue-600/[0.055] blur-[160px]" />

                <div className="absolute bottom-[-250px] right-[-200px] h-[500px] w-[500px] rounded-full bg-blue-500/[0.025] blur-[160px]" />
            </div>

            <div className="relative flex min-h-screen">

                {/* Боковая панель */}
                <aside className="fixed left-0 top-0 hidden h-screen w-[250px] border-r border-white/[0.06] bg-[#0A0D12] lg:block">

                    <div className="flex h-full flex-col">

                        {/* Логотип */}
                        <div className="flex h-[88px] items-center border-b border-white/[0.06] px-6">
                            <Link
                                href="/"
                                className="flex items-center gap-3"
                            >
                                <div className="h-10 w-10 overflow-hidden rounded-xl bg-[#11161D]">
                                    <img
                                        src="/images/avatar.png"
                                        alt="MAZEPOV CONNEXTION"
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div>
                                    <div className="text-xs font-bold text-white">
                                        МАГАЗИН МОДОВ
                                    </div>

                                    <div className="text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                                        MAZEPOV CONNEXTION
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Заголовок панели */}
                        <div className="px-5 pb-3 pt-6">
                            <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-500">
                                Панель продавца
                            </div>
                        </div>

                        {/* Меню */}
                        <nav className="flex-1 space-y-1 px-3">

                            <SellerLink
                                href="/seller"
                                icon="⌂"
                                title="Обзор"
                            />

                            <SellerLink
                                href="/seller/products"
                                icon="▦"
                                title="Мои товары"
                            />

                            <SellerLink
                                href="/seller/products/create"
                                icon="+"
                                title="Добавить товар"
                            />

                            <SellerLink
                                href="/seller/sales"
                                icon="↗"
                                title="Мои продажи"
                            />

                            <SellerLink
                                href="/seller/orders"
                                icon="◫"
                                title="Заказы"
                            />

                            <SellerLink
                                href="/seller/finance"
                                icon="₽"
                                title="Финансы"
                            />

                            <SellerLink
                                href="/seller/statistics"
                                icon="⌁"
                                title="Статистика"
                            />

                        </nav>

                        {/* Пользователь */}
                        <div className="border-t border-white/[0.06] p-3">

                            <Link
                                href="/profile"
                                className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/[0.035]"
                            >
                                {user.avatar ? (
                                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-black">
                                        <img
                                            src={user.avatar}
                                            alt={user.username}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#11161D] text-xs font-bold text-white">
                                        {firstLetter}
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-xs font-semibold text-white">
                                        {user.username}
                                    </div>

                                    <div className="mt-1 inline-flex rounded-md border border-emerald-500/15 bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-300">
                                        Продавец
                                    </div>
                                </div>

                                <span className="text-xs text-slate-700">
                                    →
                                </span>
                            </Link>

                            <Link
                                href="/"
                                className="mt-1 flex items-center gap-3 rounded-xl px-2 py-2.5 text-xs text-slate-500 transition hover:bg-white/[0.035] hover:text-white"
                            >
                                <span className="text-sm">
                                    ←
                                </span>

                                <span>
                                    Вернуться на сайт
                                </span>
                            </Link>

                        </div>

                    </div>

                </aside>

                {/* Основная часть */}
                <section className="min-w-0 flex-1 lg:ml-[250px]">

                    {/* Верхняя панель */}
                    <header className="flex h-[88px] items-center justify-between border-b border-white/[0.06] px-5 sm:px-8">

                        <div>
                            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-500">
                                MAZEPOV CONNEXTION
                            </div>

                            <h1 className="mt-1 text-xl font-bold text-white">
                                Панель продавца
                            </h1>
                        </div>

                        <Link
                            href="/seller/products/create"
                            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500"
                        >
                            + Добавить товар
                        </Link>

                    </header>

                    {/* Контент */}
                    <div className="mx-auto max-w-7xl p-5 sm:p-8">

                        {/* Приветствие */}
                        <div className="mb-7">
                            <h2 className="text-2xl font-bold tracking-tight text-white">
                                Добро пожаловать, {user.username}
                            </h2>

                            <p className="mt-2 text-sm text-slate-600">
                                Управляйте товарами, продажами и финансами
                                вашего магазина.
                            </p>
                        </div>

                        {/* Статистика */}
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                            <SellerStat
                                title="Баланс"
                                value="0 ₽"
                                description="Доступно к выводу"
                                icon="₽"
                            />

                            <SellerStat
                                title="Продажи"
                                value="0"
                                description="Всего продаж"
                                icon="↗"
                            />

                            <SellerStat
                                title="Товары"
                                value="0"
                                description="Ваши товары"
                                icon="▦"
                            />

                            <SellerStat
                                title="Заказы"
                                value="0"
                                description="Новых заказов"
                                icon="◫"
                            />

                        </div>

                        {/* Основные блоки */}
                        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">

                            {/* Продажи */}
                            <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-6">

                                <div className="flex items-center justify-between">

                                    <div>
                                        <h3 className="text-base font-semibold text-white">
                                            Продажи
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-600">
                                            История и динамика продаж
                                        </p>
                                    </div>

                                    <Link
                                        href="/seller/sales"
                                        className="text-xs font-medium text-blue-500 transition hover:text-blue-400"
                                    >
                                        Все продажи →
                                    </Link>

                                </div>

                                <div className="flex h-[280px] items-center justify-center">

                                    <div className="text-center">

                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#11161D] text-xl text-slate-600">
                                            ⌁
                                        </div>

                                        <div className="mt-4 text-sm font-medium text-slate-500">
                                            Пока нет продаж
                                        </div>

                                        <p className="mt-1 text-xs text-slate-700">
                                            Здесь появится статистика после
                                            первой продажи.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* Быстрые действия */}
                            <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-6">

                                <h3 className="text-base font-semibold text-white">
                                    Быстрые действия
                                </h3>

                                <p className="mt-1 text-xs text-slate-600">
                                    Управление магазином
                                </p>

                                <div className="mt-5 space-y-2">

                                    <QuickAction
                                        href="/seller/products/create"
                                        icon="+"
                                        title="Добавить товар"
                                        description="Создать новый товар"
                                    />

                                    <QuickAction
                                        href="/seller/products"
                                        icon="▦"
                                        title="Мои товары"
                                        description="Управление товарами"
                                    />

                                    <QuickAction
                                        href="/seller/orders"
                                        icon="◫"
                                        title="Заказы"
                                        description="Просмотр заказов"
                                    />

                                    <QuickAction
                                        href="/seller/finance"
                                        icon="₽"
                                        title="Финансы"
                                        description="Баланс и выплаты"
                                    />

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
                                        Начните с добавления товара
                                    </div>

                                    <p className="mt-1 text-xs leading-5 text-slate-600">
                                        Создайте первый мод и опубликуйте
                                        его в магазине.
                                    </p>

                                    <Link
                                        href="/seller/products/create"
                                        className="mt-3 inline-flex text-xs font-semibold text-blue-500 transition hover:text-blue-400"
                                    >
                                        Добавить товар →
                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

            </div>

        </main>
    );
}

function SellerLink({
    href,
    icon,
    title,
}: {
    href: string;
    icon: string;
    title: string;
}) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 transition hover:bg-white/[0.035] hover:text-white"
        >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.025] text-sm text-slate-600 transition group-hover:bg-blue-500/[0.08] group-hover:text-blue-400">
                {icon}
            </span>

            <span className="flex-1">
                {title}
            </span>

            <span className="text-xs text-slate-800 transition group-hover:text-slate-500">
                →
            </span>
        </Link>
    );
}

function SellerStat({
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

function QuickAction({
    href,
    icon,
    title,
    description,
}: {
    href: string;
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] p-3 transition hover:border-white/[0.09] hover:bg-white/[0.03]"
        >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#11161D] text-sm text-slate-500 transition group-hover:text-blue-400">
                {icon}
            </div>

            <div className="min-w-0 flex-1">

                <div className="text-xs font-semibold text-slate-300">
                    {title}
                </div>

                <div className="mt-0.5 truncate text-[10px] text-slate-700">
                    {description}
                </div>

            </div>

            <span className="text-xs text-slate-700 transition group-hover:text-slate-400">
                →
            </span>
        </Link>
    );
}