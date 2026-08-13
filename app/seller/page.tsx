"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";

const menu = [
    {
        name: "Обзор",
        href: "/seller",
        icon: "⌂",
    },
    {
        name: "Мои товары",
        href: "/seller/products",
        icon: "▦",
    },
    {
        name: "Добавить товар",
        href: "/seller/products/create",
        icon: "+",
    },
    {
        name: "Мои продажи",
        href: "/seller/sales",
        icon: "↗",
    },
    {
        name: "Заказы",
        href: "/seller/orders",
        icon: "◫",
    },
    {
        name: "Финансы",
        href: "/seller/finance",
        icon: "₽",
    },
    {
        name: "Статистика",
        href: "/seller/statistics",
        icon: "⌁",
    },
];

export default function SellerPage() {
    return (
        <DashboardLayout
            title="Панель продавца"
            subtitle="Управление товарами, продажами и финансами."
            menu={menu}
        >
            <div className="mb-7">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                    Добро пожаловать, продавец
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                    Здесь вы можете управлять своим магазином.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Доход"
                    value="0 ₽"
                    description="За всё время"
                    icon="₽"
                />

                <StatCard
                    title="Продажи"
                    value="0"
                    description="Всего продаж"
                    icon="↗"
                />

                <StatCard
                    title="Товары"
                    value="0"
                    description="Опубликовано"
                    icon="▦"
                />

                <StatCard
                    title="Заказы"
                    value="0"
                    description="Ожидают обработки"
                    icon="◫"
                />
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
                <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-white">
                                Продажи
                            </h3>

                            <p className="mt-1 text-xs text-slate-600">
                                Динамика ваших продаж
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
                                Статистика появится после первой продажи.
                            </p>
                        </div>
                    </div>
                </div>

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
                            description="Опубликовать новый товар"
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
                            description="Просмотреть заказы"
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
                            Создайте первый товар, чтобы он появился в
                            каталоге и стал доступен покупателям.
                        </p>

                        <Link
                            href="/seller/products/create"
                            className="mt-3 inline-flex text-xs font-semibold text-blue-500 transition hover:text-blue-400"
                        >
                            Добавить первый товар →
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
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