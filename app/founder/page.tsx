"use client";

import DashboardLayout from "@/components/DashboardLayout";

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
        name: "Товары",
        href: "/founder/products",
        icon: "▦",
    },
    {
        name: "Продавцы",
        href: "/founder/sellers",
        icon: "♙",
    },
    {
        name: "Финансы",
        href: "/founder/finance",
        icon: "₽",
    },
    {
        name: "Настройки",
        href: "/founder/settings",
        icon: "⚙",
    },
    {
        name: "Логи",
        href: "/founder/logs",
        icon: "≡",
    },
];

export default function FounderPage() {
    return (
        <DashboardLayout
            title="Панель основателя"
            subtitle="Полное управление магазином и системой."
            menu={menu}
        >
            <div className="mb-7">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                    Панель основателя
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                    Полный контроль над пользователями, продавцами,
                    товарами и финансами.
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
                    description="Активные продавцы"
                    icon="♙"
                />

                <StatCard
                    title="Товары"
                    value="0"
                    description="Всего товаров"
                    icon="▦"
                />

                <StatCard
                    title="Оборот"
                    value="0 ₽"
                    description="Общий оборот"
                    icon="₽"
                />
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-3">
                <Panel
                    title="Пользователи"
                    description="Управление аккаунтами"
                    icon="♙"
                />

                <Panel
                    title="Продавцы"
                    description="Управление продавцами"
                    icon="♙"
                />

                <Panel
                    title="Финансы"
                    description="Финансовые показатели"
                    icon="₽"
                />
            </div>

            <div className="mt-5 rounded-[20px] border border-blue-500/[0.12] bg-blue-500/[0.025] p-5">
                <div className="flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/[0.08] text-blue-400">
                        ★
                    </div>

                    <div>
                        <div className="text-sm font-semibold text-slate-300">
                            Панель основателя
                        </div>

                        <p className="mt-1 text-xs leading-5 text-slate-600">
                            Здесь будут находиться самые важные настройки
                            и функции управления всей площадкой.
                        </p>
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
        <div className="rounded-[18px] border border-white/[0.07] bg-[#0D1117] p-5">
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

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/[0.07] text-blue-400">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function Panel({
    title,
    description,
    icon,
}: {
    title: string;
    description: string;
    icon: string;
}) {
    return (
        <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#11161D] text-slate-500">
                    {icon}
                </div>

                <div>
                    <h3 className="text-base font-semibold text-white">
                        {title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-600">
                        {description}
                    </p>
                </div>
            </div>

            <div className="flex h-[180px] items-center justify-center">
                <span className="text-xs text-slate-700">
                    Пока нет данных
                </span>
            </div>
        </div>
    );
}