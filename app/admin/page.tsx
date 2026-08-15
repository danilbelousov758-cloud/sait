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

export default function AdminPage() {
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

    if (!loaded) {
        return <main className="min-h-screen " />;
    }

    if (!user || !["ADMIN", "FOUNDER"].includes(role)) {
        return (
            <>
                <Header />

                <main className="flex min-h-screen items-center justify-center  px-5 pt-24 text-white">
                    <div className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#11161D] text-2xl">
                            🔒
                        </div>

                        <h1 className="mt-5 text-2xl font-bold">
                            Доступ запрещён
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Эта панель доступна администраторам.
                        </p>

                        <Link
                            href="/"
                            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
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

            <main className="min-h-screen  pt-[95px] text-slate-100">
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="absolute left-1/2 top-[-300px] h-[550px] w-[750px] -translate-x-1/2 rounded-full bg-red-600/[0.045] blur-[160px]" />
                </div>

                <div className="relative flex min-h-[calc(100vh-95px)]">
                    <aside className="fixed bottom-0 left-0 top-[95px] hidden w-[250px] border-r border-white/[0.06] bg-[#0A0D12] lg:block">
                        <div className="flex h-full flex-col">
                            <div className="border-b border-white/[0.06] p-4">
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/[0.035]"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black font-bold text-white">
                                        {user.username
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="truncate text-xs font-semibold text-white">
                                            {user.username}
                                        </div>

                                        <div className="mt-1 inline-flex rounded-md border border-red-500/15 bg-red-500/15 px-2 py-0.5 text-[9px] font-semibold text-red-300">
                                            Администратор
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            <nav className="flex-1 overflow-y-auto px-3 py-5">
                                <div className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-700">
                                    Управление
                                </div>

                                <div className="space-y-1">
                                    <PanelLink
                                        href="/admin"
                                        icon="⌂"
                                        title="Обзор"
                                        active
                                    />

                                    <PanelLink
                                        href="/admin/users"
                                        icon="♙"
                                        title="Пользователи"
                                    />

                                    <PanelLink
                                        href="/admin/products"
                                        icon="▦"
                                        title="Товары"
                                    />

                                    <PanelLink
                                        href="/admin/orders"
                                        icon="◫"
                                        title="Заказы"
                                    />

                                    <PanelLink
                                        href="/admin/reports"
                                        icon="⚑"
                                        title="Жалобы"
                                    />

                                    <PanelLink
                                        href="/admin/moderation"
                                        icon="✓"
                                        title="Модерация"
                                    />

                                    <div className="my-3 h-px bg-white/[0.06]" />

                                    <PanelLink
                                        href="/seller"
                                        icon="💼"
                                        title="Панель продавца"
                                    />
                                </div>
                            </nav>
                        </div>
                    </aside>

                    <section className="min-w-0 flex-1 lg:ml-[250px]">
                        <header className="border-b border-white/[0.06] px-5 py-6 sm:px-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-400">
                                        Панель администратора
                                    </div>

                                    <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                                        Управление сайтом
                                    </h1>

                                    <p className="mt-1 text-xs text-slate-600">
                                        Контроль пользователей, товаров и заказов.
                                    </p>
                                </div>
                            </div>
                        </header>

                        <div className="mx-auto max-w-7xl p-5 sm:p-8">
                            <div className="mb-7">
                                <h2 className="text-2xl font-bold text-white">
                                    Панель администратора
                                </h2>

                                <p className="mt-2 text-sm text-slate-600">
                                    Основные инструменты управления платформой.
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
                                    description="В каталоге"
                                    icon="▦"
                                />

                                <StatCard
                                    title="Заказы"
                                    value="0"
                                    description="Всего заказов"
                                    icon="◫"
                                />

                                <StatCard
                                    title="Жалобы"
                                    value="0"
                                    description="Ожидают проверки"
                                    icon="⚑"
                                />
                            </div>

                            <div className="mt-5 grid gap-5 xl:grid-cols-2">
                                <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-6">
                                    <h3 className="text-base font-semibold text-white">
                                        Управление
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-600">
                                        Основные разделы администратора.
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
                                            href="/admin/orders"
                                            icon="◫"
                                            title="Заказы"
                                            description="Контроль заказов"
                                        />

                                        <QuickAction
                                            href="/admin/moderation"
                                            icon="✓"
                                            title="Модерация"
                                            description="Проверка контента"
                                        />
                                    </div>
                                </div>

                                <div className="rounded-[20px] border border-red-500/[0.10] bg-red-500/[0.02] p-6">
                                    <h3 className="text-base font-semibold text-white">
                                        Требует внимания
                                    </h3>

                                    <div className="flex h-[250px] items-center justify-center">
                                        <div className="text-center">
                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#11161D] text-xl text-slate-700">
                                                ✓
                                            </div>

                                            <div className="mt-4 text-sm font-medium text-slate-500">
                                                Нет новых задач
                                            </div>

                                            <div className="mt-1 text-xs text-slate-700">
                                                Сейчас всё обработано.
                                            </div>
                                        </div>
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
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/10"
                    : "text-slate-500 hover:bg-white/[0.035] hover:text-white"
            }`}
        >
            <span
                className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    active
                        ? "bg-white/[0.12]"
                        : "bg-white/[0.025] text-slate-600 group-hover:text-red-400"
                }`}
            >
                {icon}
            </span>

            <span className="flex-1">{title}</span>

            {!active && (
                <span className="text-xs text-slate-800 group-hover:text-slate-500">
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
        <div className="rounded-[18px] border border-white/[0.07] bg-[#0D1117] p-5">
            <div className="flex items-start justify-between">
                <div>
                    <div className="text-xs text-slate-600">{title}</div>

                    <div className="mt-2 text-2xl font-bold text-white">
                        {value}
                    </div>

                    <div className="mt-1 text-[10px] text-slate-700">
                        {description}
                    </div>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/[0.07] text-red-400">
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
            className="group flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] p-3 hover:bg-white/[0.03]"
        >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#11161D] text-slate-500 group-hover:text-red-400">
                {icon}
            </div>

            <div className="flex-1">
                <div className="text-xs font-semibold text-slate-300">
                    {title}
                </div>

                <div className="mt-0.5 text-[10px] text-slate-700">
                    {description}
                </div>
            </div>

            <span className="text-xs text-slate-700 group-hover:text-slate-400">
                →
            </span>
        </Link>
    );
}

