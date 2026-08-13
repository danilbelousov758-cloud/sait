"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

type DashboardMenuItem = {
    name: string;
    href: string;
    icon: string;
};

type DashboardLayoutProps = {
    title: string;
    subtitle: string;
    menu: DashboardMenuItem[];
    children: ReactNode;
};

export default function DashboardLayout({
    title,
    subtitle,
    menu,
    children,
}: DashboardLayoutProps) {
    const pathname = usePathname();

    return (
        <main className="min-h-screen bg-[#080B10] text-slate-100">
            {/* Фоновое свечение */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-[-300px] h-[550px] w-[750px] -translate-x-1/2 rounded-full bg-blue-600/[0.055] blur-[160px]" />

                <div className="absolute bottom-[-250px] right-[-200px] h-[500px] w-[500px] rounded-full bg-blue-500/[0.025] blur-[160px]" />
            </div>

            <div className="relative flex min-h-screen">
                {/* ЛЕВАЯ ПАНЕЛЬ */}
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

                        {/* Название панели */}
                        <div className="px-5 pb-3 pt-6">
                            <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-700">
                                {title}
                            </div>
                        </div>

                        {/* Меню */}
                        <nav className="flex-1 space-y-1 px-3">
                            {menu.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== "/" &&
                                        pathname.startsWith(
                                            item.href + "/"
                                        ));

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
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

                        {/* Профиль */}
                        <div className="border-t border-white/[0.06] p-3">
                            <Link
                                href="/profile"
                                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 transition hover:bg-white/[0.035] hover:text-white"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#11161D] text-xs font-bold text-white">
                                    ?
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

                {/* ОСНОВНАЯ ЧАСТЬ */}
                <section className="min-w-0 flex-1 lg:ml-[250px]">
                    {/* Верхняя панель */}
                    <header className="flex min-h-[88px] items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-5 sm:px-8">
                        <div>
                            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-500">
                                MAZEPOV CONNEXTION
                            </div>

                            <h1 className="mt-1 text-xl font-bold text-white">
                                {title}
                            </h1>

                            <p className="mt-1 text-xs text-slate-600">
                                {subtitle}
                            </p>
                        </div>
                    </header>

                    {/* Контент */}
                    <div className="mx-auto max-w-7xl p-5 sm:p-8">
                        {children}
                    </div>
                </section>
            </div>
        </main>
    );
}