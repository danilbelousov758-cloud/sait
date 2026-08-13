"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

type User = {
    id: number;
    username: string;
    avatar?: string | null;
    role?: string;
};

function UserAvatar({
    username,
    avatar,
    size = "small",
}: {
    username: string;
    avatar?: string | null;
    size?: "small" | "large";
}) {
    const firstLetter = username?.trim().charAt(0).toUpperCase() || "?";

    const sizeClass =
        size === "large"
            ? "h-20 w-20 text-2xl"
            : "h-7 w-7 text-xs";

    if (avatar) {
        return (
            <div
                className={`${sizeClass} overflow-hidden rounded-lg bg-black`}
            >
                <img
                    src={avatar}
                    alt={username}
                    className="h-full w-full object-cover"
                />
            </div>
        );
    }

    return (
        <div
            className={`${sizeClass} flex items-center justify-center rounded-lg border border-white/[0.08] bg-black font-bold text-white`}
        >
            {firstLetter}
        </div>
    );
}

export default function Header() {
    const pathname = usePathname();

    const [user, setUser] = useState<User | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const loadUser = () => {
            try {
                const savedUser = localStorage.getItem("user");

                if (savedUser) {
                    const parsedUser = JSON.parse(savedUser);

                    setUser(parsedUser);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error(
                    "Ошибка загрузки пользователя:",
                    error
                );

                setUser(null);
            } finally {
                setLoaded(true);
            }
        };

        loadUser();

        window.addEventListener("storage", loadUser);

        return () => {
            window.removeEventListener("storage", loadUser);
        };
    }, []);

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
                {!loaded ? (
                    <div className="h-10 w-[80px] rounded-xl bg-white/[0.03]" />
                ) : user ? (
                    <Link
                        href="/profile"
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition-all duration-200 hover:bg-blue-500"
                    >
                        <UserAvatar
                            username={user.username}
                            avatar={user.avatar}
                        />

                        <span className="max-w-[120px] truncate">
                            {user.username}
                        </span>
                    </Link>
                ) : (
                    <Link
                        href="/login"
                        className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition-all duration-200 hover:bg-blue-500"
                    >
                        Войти
                    </Link>
                )}
            </div>
        </header>
    );
}