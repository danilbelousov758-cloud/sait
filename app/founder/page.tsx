"use client";

import Link from "next/link";
import { useState } from "react";

const menu = [
    {
        name: "Обзор",
        href: "/founder",
        icon: "⌂",
    },
    {
        name: "Пользователи",
        href: "/founder/users",
        icon: "♙",
    },
    {
        name: "Продавцы",
        href: "/founder/sellers",
        icon: "◆",
    },
    {
        name: "Товары",
        href: "/founder/products",
        icon: "▦",
    },
    {
        name: "Заказы",
        href: "/founder/orders",
        icon: "◫",
    },
    {
        name: "Продажи",
        href: "/founder/sales",
        icon: "↗",
    },
    {
        name: "Финансы",
        href: "/founder/finance",
        icon: "₽",
    },
    {
        name: "Роли и права",
        href: "/founder/roles",
        icon: "♜",
    },
    {
        name: "Жалобы",
        href: "/founder/reports",
        icon: "⚠",
    },
    {
        name: "Настройки",
        href: "/founder/settings",
        icon: "⚙",
    },
];

export default function FounderPage() {
    const [active, setActive] = useState("Обзор");

    return (
        <main className="min-h-screen bg-[#080B10] text-slate-100">
            {/* Фоновое свечение */}
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
                                <div className="h-10 w-10 overflow-hidden rounded-xl border border-white/[0.07] bg-[#11161D]">
                                    <img
                                        src="/images/avatar.png"
                                        alt="MAZEPOV CONNEXTION"
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div>
                                    <div className="text-xs font-bold text-white">
                                        MAZEPOV
                                    </div>

                                    <div className="text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                                        CONNEXTION
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Заголовок */}
                        <div className="px-5 pb-3 pt-6">
                            <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-700">
                                Панель основателя
                            </div>
                        </div>

                        {/* Меню */}
                        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
                            {menu.map((item) => {
                                const isActive = active === item.name;

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() =>
                                            setActive(item.name)
                                        }
                                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all ${
                                            isActive
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                                                : "text-slate-500 hover:bg-white/[0.035] hover:text-white"
                                        }`}
                                    >
                                        <span
                                            className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm ${
                                                isActive
                                                    ? "bg-white/[0.12] text-white"
                                                    : "bg-white/[0.025] text-slate-600"
                                            }`}
                                        >
                                            {item.icon}
                                        </span>

                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Нижняя часть */}
                        <div className="border-t border-white/[0.06] p-3">
                            <Link
                                href="/profile"
                                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 transition hover:bg-white/[0.035] hover:text-white"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#11161D] text-xs font-bold text-white">
                                    D
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-xs font-semibold text-slate-300">
                                        Ваш профиль
                                    </div>

                                    <div className="text-[9px] text-slate-600">
                                        Вернуться в аккаунт
                                    </div>
                                </div>

                                <span className="text-slate-700">
                                    →
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
                                Панель основателя
                            </h1>
                        </div>

                        <Link
                            href="/founder/settings"
                            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500"
                        >
                            Настройки
                        </Link>
                    </header>

                    {/* Контент */}
                    <div className="mx-auto max-w-7xl p-5 sm:p-8">
                        {/* Приветствие */}
                        <div className="mb-7">
                            <div className="mb-2 inline-flex rounded-lg bg-blue-500/[0.07] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-400">
                                Основатель
                            </div>

                            <h2 className="text-2xl font-bold tracking-tight text-white">
                                Центр управления
                            </h2>

                            <p className="mt-2 text-sm text-slate-600">
                                Полное управление пользователями,
                                продавцами, товарами, финансами и
                                настройками магазина.
                            </p>
                        </div>

                        {/* Статистика */}
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <StatCard
                                title="Пользователи"
                                value="0"
                                description="Всего аккаунтов"
                                icon="♙"
                            />

                            <StatCard
                                title="Продавцы"
                                value="0"
                                description="Активных продавцов"
                                icon="◆"
                            />

                            <StatCard
                                title="Товары"
                                value="0"
                                description="Опубликовано"
                                icon="▦"
                            />

                            <StatCard
                                title="Оборот"
                                value="0 ₽"
                                description="За всё время"
                                icon="₽"
                            />
                        </div>

                        {/* Вторая статистика */}
                        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <StatCard
                                title="Заказы"
                                value="0"
                                description="Всего заказов"
                                icon="◫"
                            />

                            <StatCard
                                title="Продажи"
                                value="0"
                                description="Успешных продаж"
                                icon="↗"
                            />

                            <StatCard
                                title="Жалобы"
                                value="0"
                                description="Ожидают рассмотрения"
                                icon="⚠"
                            />

                            <StatCard
                                title="Модерация"
                                value="0"
                                description="Товаров ожидают проверки"
                                icon="✓"
                            />
                        </div>

                        {/* Основные блоки */}
                        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
                            {/* Активность */}
                            <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-semibold text-white">
                                            Активность магазина
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-600">
                                            Общая статистика платформы
                                        </p>
                                    </div>

                                    <Link
                                        href="/founder/statistics"
                                        className="text-xs font-medium text-blue-500 transition hover:text-blue-400"
                                    >
                                        Статистика →
                                    </Link>
                                </div>

                                <div className="flex h-[280px] items-center justify-center">
                                    <div className="text-center">
                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#11161D] text-xl text-slate-600">
                                            ⌁
                                        </div>

                                        <div className="mt-4 text-sm font-medium text-slate-500">
                                            Пока нет данных
                                        </div>

                                        <p className="mt-1 text-xs text-slate-700">
                                            Здесь появится статистика
                                            магазина.
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
                                    Управление платформой
                                </p>

                                <div className="mt-5 space-y-2">
                                    <QuickAction
                                        href="/founder/users"
                                        icon="♙"
                                        title="Пользователи"
                                        description="Управление аккаунтами"
                                    />

                                    <QuickAction
                                        href="/founder/sellers"
                                        icon="◆"
                                        title="Продавцы"
                                        description="Управление продавцами"
                                    />

                                    <QuickAction
                                        href="/founder/roles"
                                        icon="♜"
                                        title="Роли и права"
                                        description="Настройка доступа"
                                    />

                                    <QuickAction
                                        href="/founder/finance"
                                        icon="₽"
                                        title="Финансы"
                                        description="Доходы и выплаты"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Управление ролями */}
                        <div className="mt-5 rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-6">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div>
                                    <h3 className="text-base font-semibold text-white">
                                        Роли и доступ
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-600">
                                        Управление уровнями доступа
                                        пользователей.
                                    </p>
                                </div>

                                <Link
                                    href="/founder/roles"
                                    className="inline-flex rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                                >
                                    Управлять ролями
                                </Link>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <RoleCard
                                    title="Пользователь"
                                    description="Обычный аккаунт"
                                    className="text-slate-300"
                                />

                                <RoleCard
                                    title="Продавец"
                                    description="Продажа товаров"
                                    className="text-blue-400"
                                />

                                <RoleCard
                                    title="Администратор"
                                    description="Управление сайтом"
                                    className="text-purple-400"
                                />

                                <RoleCard
                                    title="Основатель"
                                    description="Полный доступ"
                                    className="text-amber-400"
                                />
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
                                        Панель основателя
                                    </div>

                                    <p className="mt-1 text-xs leading-5 text-slate-600">
                                        Основатель имеет полный доступ
                                        ко всем разделам платформы.
                                        Здесь будут размещаться
                                        инструменты управления системой,
                                        ролями, финансами и магазином.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
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

function RoleCard({
    title,
    description,
    className,
}: {
    title: string;
    description: string;
    className: string;
}) {
    return (
        <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-4">
            <div className={`text-xs font-semibold ${className}`}>
                {title}
            </div>

            <div className="mt-1 text-[10px] text-slate-700">
                {description}
            </div>
        </div>
    );
}