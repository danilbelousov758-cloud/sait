"use client";

import Link from "next/link";

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
        icon: "◆",
    },
    {
        name: "Настройки",
        href: "/founder/settings",
        icon: "⚙",
    },
];

export default function FounderPage() {
    return (
        <main className="min-h-screen bg-[#080B10] text-slate-100">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-[-300px] h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-purple-600/[0.055] blur-[170px]" />

                <div className="absolute bottom-[-250px] right-[-200px] h-[500px] w-[500px] rounded-full bg-purple-500/[0.025] blur-[160px]" />
            </div>

            <div className="relative flex min-h-screen">
                <aside className="fixed left-0 top-0 hidden h-screen w-[250px] border-r border-white/[0.06] bg-[#0A0D12] lg:block">
                    <div className="flex h-full flex-col">
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

                        <div className="px-5 pb-3 pt-6">
                            <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-700">
                                Панель основателя
                            </div>
                        </div>

                        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
                            {menu.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all ${
                                        item.href === "/founder"
                                            ? "bg-purple-600 text-white shadow-lg shadow-purple-600/10"
                                            : "text-slate-500 hover:bg-white/[0.035] hover:text-white"
                                    }`}
                                >
                                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.025]">
                                        {item.icon}
                                    </span>

                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </nav>

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

                <section className="min-w-0 flex-1 lg:ml-[250px]">
                    <header className="flex min-h-[88px] items-center justify-between border-b border-white/[0.06] px-5 sm:px-8">
                        <div>
                            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-purple-500">
                                MAZEPOV CONNEXTION
                            </div>

                            <h1 className="mt-1 text-xl font-bold text-white">
                                Панель основателя
                            </h1>

                            <p className="mt-1 hidden text-xs text-slate-600 sm:block">
                                Полное управление платформой
                            </p>
                        </div>

                        <Link
                            href="/founder/users"
                            className="rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-600/10 transition hover:bg-purple-500"
                        >
                            Пользователи
                        </Link>
                    </header>

                    <div className="mx-auto max-w-7xl p-5 sm:p-8">
                        <div className="mb-7">
                            <div className="inline-flex items-center gap-2 rounded-lg border border-purple-500/[0.12] bg-purple-500/[0.05] px-3 py-1.5 text-[10px] font-semibold text-purple-400">
                                <span>◆</span>
                                Полный доступ
                            </div>

                            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
                                Добро пожаловать, основатель
                            </h2>

                            <p className="mt-2 text-sm text-slate-600">
                                Все основные инструменты управления MAZEPOV CONNEXTION находятся здесь.
                            </p>
                        </div>

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
                                description="Общий оборот"
                                icon="₽"
                            />
                        </div>

                        <div className="mt-5 grid gap-5 xl:grid-cols-2">
                            <Card
                                title="Состояние платформы"
                                description="Основная информация"
                            >
                                <div className="mt-5 space-y-3">
                                    <Status
                                        title="Сайт"
                                        value="Работает"
                                    />

                                    <Status
                                        title="База данных"
                                        value="Подключена"
                                    />

                                    <Status
                                        title="Магазин"
                                        value="Работает"
                                    />
                                </div>
                            </Card>

                            <Card
                                title="Управление"
                                description="Основные разделы"
                            >
                                <div className="mt-5 space-y-2">
                                    <Action
                                        href="/founder/users"
                                        icon="♙"
                                        title="Пользователи"
                                        text="Управление аккаунтами"
                                    />

                                    <Action
                                        href="/founder/sellers"
                                        icon="◆"
                                        title="Продавцы"
                                        text="Управление продавцами"
                                    />

                                    <Action
                                        href="/founder/roles"
                                        icon="◆"
                                        title="Роли и права"
                                        text="Настройка доступа"
                                    />

                                    <Action
                                        href="/founder/settings"
                                        icon="⚙"
                                        title="Настройки"
                                        text="Настройки платформы"
                                    />
                                </div>
                            </Card>
                        </div>

                        <div className="mt-5 rounded-[20px] border border-purple-500/[0.12] bg-purple-500/[0.025] p-5">
                            <div className="flex gap-4">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/[0.08] text-sm text-purple-400">
                                    ◆
                                </div>

                                <div>
                                    <div className="text-sm font-semibold text-slate-300">
                                        Полный доступ основателя
                                    </div>

                                    <p className="mt-1 text-xs leading-5 text-slate-600">
                                        Вы имеете полный доступ ко всем разделам
                                        платформы и можете управлять пользователями,
                                        продавцами, товарами, ролями и настройками.
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

                    <div className="mt-2 text-2xl font-bold text-white">
                        {value}
                    </div>

                    <div className="mt-1 text-[10px] text-slate-700">
                        {description}
                    </div>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/[0.07] text-sm text-purple-400">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function Card({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-6">
            <h3 className="text-base font-semibold text-white">
                {title}
            </h3>

            <p className="mt-1 text-xs text-slate-600">
                {description}
            </p>

            {children}
        </div>
    );
}

function Status({
    title,
    value,
}: {
    title: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-[#11161D] px-4 py-3">
            <span className="text-xs text-slate-400">
                {title}
            </span>

            <span className="rounded-lg bg-green-500/[0.08] px-2.5 py-1 text-[10px] font-semibold text-green-400">
                {value}
            </span>
        </div>
    );
}

function Action({
    href,
    icon,
    title,
    text,
}: {
    href: string;
    icon: string;
    title: string;
    text: string;
}) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] p-3 transition hover:border-white/[0.09] hover:bg-white/[0.03]"
        >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#11161D] text-slate-500 transition group-hover:text-purple-400">
                {icon}
            </div>

            <div className="flex-1">
                <div className="text-xs font-semibold text-slate-300">
                    {title}
                </div>

                <div className="mt-0.5 text-[10px] text-slate-700">
                    {text}
                </div>
            </div>

            <span className="text-xs text-slate-700 group-hover:text-slate-400">
                →
            </span>
        </Link>
    );
}