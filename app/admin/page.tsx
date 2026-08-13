"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
    { name: "Обзор", href: "/admin", icon: "⌂" },
    { name: "Пользователи", href: "/admin/users", icon: "♙" },
    { name: "Товары", href: "/admin/products", icon: "▦" },
    { name: "Модерация", href: "/admin/moderation", icon: "✓" },
    { name: "Жалобы", href: "/admin/reports", icon: "!" },
    { name: "Заказы", href: "/admin/orders", icon: "◫" },
    { name: "Финансы", href: "/admin/finance", icon: "₽" },
    { name: "Статистика", href: "/admin/statistics", icon: "⌁" },
];

export default function AdminPage() {
    const pathname = usePathname();

    return (
        <main className="min-h-screen bg-[#080B10] text-slate-100">
            <Background />

            <div className="relative flex min-h-screen">
                <Sidebar
                    title="Панель администратора"
                    menu={menu}
                    pathname={pathname}
                />

                <section className="min-w-0 flex-1 lg:ml-[250px]">
                    <header className="flex min-h-[88px] items-center justify-between gap-4 border-b border-white/[0.06] px-5 sm:px-8">
                        <div>
                            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-500">
                                MAZEPOV CONNEXTION
                            </div>

                            <h1 className="mt-1 text-xl font-bold text-white">
                                Панель администратора
                            </h1>
                        </div>

                        <Link
                            href="/admin/moderation"
                            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500"
                        >
                            Модерация
                        </Link>
                    </header>

                    <div className="mx-auto max-w-7xl p-5 sm:p-8">
                        <div className="mb-7">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-500">
                                ADMIN
                            </div>

                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                Центр управления
                            </h1>

                            <p className="mt-2 text-sm text-slate-600">
                                Управляйте пользователями, товарами,
                                заказами и модерацией сайта.
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
                                title="Товары"
                                value="0"
                                description="На сайте"
                                icon="▦"
                            />

                            <StatCard
                                title="Жалобы"
                                value="0"
                                description="Требуют внимания"
                                icon="!"
                            />

                            <StatCard
                                title="Заказы"
                                value="0"
                                description="Всего заказов"
                                icon="◫"
                            />
                        </div>

                        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
                            <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-6">
                                <h2 className="text-base font-semibold text-white">
                                    Последние действия
                                </h2>

                                <p className="mt-1 text-xs text-slate-600">
                                    События административной панели
                                </p>

                                <div className="flex h-[280px] items-center justify-center">
                                    <div className="text-center">
                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#11161D] text-xl text-slate-600">
                                            ⌁
                                        </div>

                                        <div className="mt-4 text-sm font-medium text-slate-500">
                                            Пока нет действий
                                        </div>

                                        <p className="mt-1 text-xs text-slate-700">
                                            Здесь появится история действий
                                            администратора.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-6">
                                <h2 className="text-base font-semibold text-white">
                                    Быстрые действия
                                </h2>

                                <p className="mt-1 text-xs text-slate-600">
                                    Управление сайтом
                                </p>

                                <div className="mt-5 space-y-2">
                                    <QuickAction
                                        href="/admin/users"
                                        icon="♙"
                                        title="Пользователи"
                                        description="Управление аккаунтами"
                                    />

                                    <QuickAction
                                        href="/admin/products"
                                        icon="▦"
                                        title="Товары"
                                        description="Проверка товаров"
                                    />

                                    <QuickAction
                                        href="/admin/moderation"
                                        icon="✓"
                                        title="Модерация"
                                        description="Проверка контента"
                                    />

                                    <QuickAction
                                        href="/admin/reports"
                                        icon="!"
                                        title="Жалобы"
                                        description="Обращения пользователей"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 rounded-[20px] border border-blue-500/[0.12] bg-blue-500/[0.025] p-5">
                            <div className="flex gap-4">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/[0.08] text-sm text-blue-400">
                                    i
                                </div>

                                <div>
                                    <div className="text-sm font-semibold text-slate-300">
                                        Панель администратора
                                    </div>

                                    <p className="mt-1 text-xs leading-5 text-slate-600">
                                        Здесь будут находиться инструменты
                                        управления сайтом и модерации.
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

function Background() {
    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-[-300px] h-[550px] w-[750px] -translate-x-1/2 rounded-full bg-blue-600/[0.055] blur-[160px]" />
            <div className="absolute bottom-[-250px] right-[-200px] h-[500px] w-[500px] rounded-full bg-blue-500/[0.025] blur-[160px]" />
        </div>
    );
}

function Sidebar({
    title,
    menu,
    pathname,
}: {
    title: string;
    menu: { name: string; href: string; icon: string }[];
    pathname: string;
}) {
    return (
        <aside className="fixed left-0 top-0 hidden h-screen w-[250px] border-r border-white/[0.06] bg-[#0A0D12] lg:block">
            <div className="flex h-full flex-col">
                <div className="flex h-[88px] items-center border-b border-white/[0.06] px-6">
                    <Link href="/" className="flex items-center gap-3">
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
                        {title}
                    </div>
                </div>

                <nav className="flex-1 space-y-1 px-3">
                    {menu.map((item) => {
                        const active =
                            pathname === item.href ||
                            (item.href !== "/admin" &&
                                pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all ${
                                    active
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                                        : "text-slate-500 hover:bg-white/[0.035] hover:text-white"
                                }`}
                            >
                                <span
                                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm ${
                                        active
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

                        <span className="text-slate-700">→</span>
                    </Link>
                </div>
            </div>
        </aside>
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
                    <div className="text-xs text-slate-600">{title}</div>

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