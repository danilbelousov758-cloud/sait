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

type Product = {
    id: number;
    name: string;
    category: string;
    price: number;
    status: "Опубликован" | "Черновик";
};

const roleNames: Record<string, string> = {
    USER: "Пользователь",
    SELLER: "Продавец",
    ADMIN: "Администратор",
    FOUNDER: "Основатель",
};

export default function ProductsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loaded, setLoaded] = useState(false);

    const [products] = useState<Product[]>([]);

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
                            У вашего аккаунта нет прав для управления товарами.
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
                                        active
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
                                        Мои товары
                                    </h1>

                                    <p className="mt-1 text-xs text-slate-600">
                                        Управление товарами вашего магазина.
                                    </p>

                                </div>

                                <Link
                                    href="/seller/products/create"
                                    className="inline-flex w-fit items-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500"
                                >
                                    + Добавить товар
                                </Link>

                            </div>

                        </header>

                        {/* Контент */}
                        <div className="mx-auto max-w-7xl p-5 sm:p-8">

                            {/* Верхние карточки */}
                            <div className="grid gap-4 sm:grid-cols-3">

                                <InfoCard
                                    title="Всего товаров"
                                    value={products.length.toString()}
                                    icon="▦"
                                />

                                <InfoCard
                                    title="Опубликовано"
                                    value={
                                        products
                                            .filter(
                                                (product) =>
                                                    product.status ===
                                                    "Опубликован"
                                            )
                                            .length.toString()
                                    }
                                    icon="✓"
                                />

                                <InfoCard
                                    title="Черновики"
                                    value={
                                        products
                                            .filter(
                                                (product) =>
                                                    product.status ===
                                                    "Черновик"
                                            )
                                            .length.toString()
                                    }
                                    icon="✎"
                                />

                            </div>

                            {/* Товары */}
                            <div className="mt-5 rounded-[20px] border border-white/[0.07] bg-[#0D1117]">

                                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-5 sm:px-6">

                                    <div>

                                        <h2 className="text-base font-semibold text-white">
                                            Товары
                                        </h2>

                                        <p className="mt-1 text-xs text-slate-600">
                                            Все товары, добавленные вами.
                                        </p>

                                    </div>

                                    <Link
                                        href="/seller/products/create"
                                        className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                                    >
                                        + Новый товар
                                    </Link>

                                </div>

                                {products.length === 0 ? (

                                    <div className="flex min-h-[360px] items-center justify-center px-5">

                                        <div className="text-center">

                                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#11161D] text-2xl text-slate-700">
                                                ▦
                                            </div>

                                            <h3 className="mt-5 text-sm font-semibold text-slate-400">
                                                У вас пока нет товаров
                                            </h3>

                                            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-700">
                                                Добавьте свой первый мод,
                                                чтобы он появился в вашем
                                                магазине.
                                            </p>

                                            <Link
                                                href="/seller/products/create"
                                                className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
                                            >
                                                Добавить первый товар
                                            </Link>

                                        </div>

                                    </div>

                                ) : (

                                    <div className="divide-y divide-white/[0.05]">

                                        {products.map((product) => (
                                            <ProductRow
                                                key={product.id}
                                                product={product}
                                            />
                                        ))}

                                    </div>

                                )}

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
        <div className="rounded-[18px] border border-white/[0.07] bg-[#0D1117] p-5">

            <div className="flex items-start justify-between">

                <div>

                    <div className="text-xs text-slate-600">
                        {title}
                    </div>

                    <div className="mt-2 text-2xl font-bold text-white">
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

function ProductRow({
    product,
}: {
    product: Product;
}) {
    return (
        <div className="flex items-center gap-4 px-5 py-4 transition hover:bg-white/[0.015] sm:px-6">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#11161D] text-sm text-slate-600">
                ▦
            </div>

            <div className="min-w-0 flex-1">

                <div className="truncate text-sm font-semibold text-white">
                    {product.name}
                </div>

                <div className="mt-1 text-[10px] text-slate-700">
                    {product.category}
                </div>

            </div>

            <div className="hidden text-sm font-semibold text-slate-300 sm:block">
                {product.price} ₽
            </div>

            <div
                className={`hidden rounded-lg px-2.5 py-1 text-[10px] font-semibold sm:block ${
                    product.status === "Опубликован"
                        ? "bg-green-500/[0.08] text-green-400"
                        : "bg-yellow-500/[0.08] text-yellow-400"
                }`}
            >
                {product.status}
            </div>

            <Link
                href={`/seller/products/${product.id}`}
                className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-xs text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
            >
                Открыть
            </Link>

        </div>
    );
}