"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
    {
        name: "Главная",
        href: "/",
    },
    {
        name: "Каталог",
        href: "/catalog",
    },
    {
        name: "Поддержка",
        href: "/support",
    },
];

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="fixed left-1/2 top-5 z-50 w-[calc(100%-24px)] max-w-7xl -translate-x-1/2 sm:w-[calc(100%-32px)]">
            <div className="flex h-[70px] items-center justify-between rounded-[20px] border border-white/[0.07] bg-[#0D1117]/90 px-4 shadow-[0_15px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-5 md:px-7">

                {/* Логотип */}
                <Link
                    href="/"
                    className="group flex items-center gap-3"
                >
                    <div className="h-10 w-10 overflow-hidden rounded-[13px] bg-[#11161D]">
                        <img
                            src="/images/avatar.png"
                            alt="MAZEPOV CONNEXTION"
                            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                    </div>

                    <div className="hidden sm:block">
                        <div className="text-sm font-bold tracking-tight text-white">
                            МАГАЗИН МОДОВ
                        </div>

                        <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                            MAZEPOV CONNEXTION
                        </div>
                    </div>
                </Link>

                {/* Навигация */}
                <nav className="hidden items-center gap-1 md:flex">
                    {navigation.map((item) => {
                        const active = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                                    active
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                                }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Авторизация */}
                <Link
                    href="/login"
                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition-all duration-200 hover:bg-blue-500"
                >
                    Войти
                </Link>
            </div>
        </header>
    );
}