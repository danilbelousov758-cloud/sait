"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

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

const roleNames: Record<string, string> = {
    USER: "Пользователь",
    SELLER: "Продавец",
    ADMIN: "Администратор",
    FOUNDER: "Основатель",
};

function UserAvatar({
    username,
    avatar,
    large = false,
}: {
    username: string;
    avatar?: string | null;
    large?: boolean;
}) {
    const firstLetter =
        username?.trim().charAt(0).toUpperCase() || "?";

    if (avatar) {
        return (
            <div
                className={`overflow-hidden rounded-xl bg-black ${
                    large ? "h-11 w-11" : "h-7 w-7"
                }`}
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
            className={`flex items-center justify-center rounded-xl border border-white/[0.08] bg-black font-bold text-white ${
                large
                    ? "h-11 w-11 text-sm"
                    : "h-7 w-7 text-xs"
            }`}
        >
            {firstLetter}
        </div>
    );
}

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();

    const menuRef = useRef<HTMLDivElement>(null);

    const [user, setUser] = useState<User | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const loadUser = () => {
            try {
                const savedUser = localStorage.getItem("user");

                if (savedUser) {
                    setUser(JSON.parse(savedUser));
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener(
                "mousedown",
                handleClickOutside
            );
        }

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [menuOpen]);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setMenuOpen(false);

        router.push("/");
    };

    const role = user?.role || "USER";
    const roleName = roleNames[role] || "Пользователь";

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

                {/* Правая часть */}
                {!loaded ? (
                    <div className="h-10 w-[80px] rounded-xl bg-white/[0.03]" />
                ) : user ? (
                    <div
                        ref={menuRef}
                        className="relative"
                    >
                        {/* Кнопка пользователя */}
                        <button
                            type="button"
                            onClick={() =>
                                setMenuOpen((value) => !value)
                            }
                            className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-semibold text-white transition-all duration-200 ${
                                menuOpen
                                    ? "bg-white/[0.08]"
                                    : "bg-blue-600 shadow-lg shadow-blue-600/10 hover:bg-blue-500"
                            }`}
                        >
                            <UserAvatar
                                username={user.username}
                                avatar={user.avatar}
                            />

                            <span className="max-w-[120px] truncate">
                                {user.username}
                            </span>

                            <svg
                                className={`h-3.5 w-3.5 text-white/60 transition-transform duration-200 ${
                                    menuOpen
                                        ? "rotate-180"
                                        : ""
                                }`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        {/* Выпадающее меню */}
                        {menuOpen && (
                            <div className="absolute right-0 top-[calc(100%+10px)] w-[270px] overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#0D1117] shadow-[0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">

                                {/* Информация о пользователе */}
                                <div className="border-b border-white/[0.06] p-4">
                                    <div className="flex items-center gap-3">
                                        <UserAvatar
                                            username={user.username}
                                            avatar={user.avatar}
                                            large
                                        />

                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-bold text-white">
                                                {user.username}
                                            </div>

                                            <div className="mt-1 text-xs text-slate-500">
                                                {roleName}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Основные пункты */}
                                <div className="p-2">

                                    {/* Профиль */}
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.05]"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-slate-400">
                                            <svg
                                                className="h-4 w-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="8"
                                                    r="3.5"
                                                />
                                                <path d="M5 20c.8-3.2 3.1-5 7-5s6.2 1.8 7 5" />
                                            </svg>
                                        </div>

                                        <div>
                                            <div className="text-sm font-medium text-white">
                                                Профиль
                                            </div>

                                            <div className="text-[11px] text-slate-600">
                                                Ваш аккаунт
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Настройки */}
                                    <Link
                                        href="/profile/settings"
                                        className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.05]"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-slate-400">
                                            <svg
                                                className="h-4 w-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                            >
                                                <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" />
                                                <path d="M19.4 15a1.7 1.7 0 00.34 1.88l.06.06-1.8 1.8-.06-.06a1.7 1.7 0 00-1.88-.34 1.7 1.7 0 00-1.03 1.56V20h-2.55v-.1a1.7 1.7 0 00-1.03-1.56 1.7 1.7 0 00-1.88.34l-.06.06-1.8-1.8.06-.06A1.7 1.7 0 008.1 15a1.7 1.7 0 00-1.56-1.03H6v-2.55h.1A1.7 1.7 0 007.66 10a1.7 1.7 0 00-.34-1.88l-.06-.06 1.8-1.8.06.06A1.7 1.7 0 0011 6.1 1.7 1.7 0 0012.03 4.55V4h2.55v.1A1.7 1.7 0 0015.6 5.66a1.7 1.7 0 001.88-.34l.06-.06 1.8 1.8-.06.06A1.7 1.7 0 0018.94 9a1.7 1.7 0 001.56 1.03h.1v2.55h-.1A1.7 1.7 0 0018.94 14a1.7 1.7 0 00.46 1z" />
                                            </svg>
                                        </div>

                                        <div>
                                            <div className="text-sm font-medium text-white">
                                                Настройки
                                            </div>

                                            <div className="text-[11px] text-slate-600">
                                                Настройки аккаунта
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Панель продавца */}
                                    {role === "SELLER" && (
                                        <Link
                                            href="/seller"
                                            className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.05]"
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-slate-400">
                                                🛒
                                            </div>

                                            <div>
                                                <div className="text-sm font-medium text-white">
                                                    Панель продавца
                                                </div>

                                                <div className="text-[11px] text-slate-600">
                                                    Управление магазином
                                                </div>
                                            </div>
                                        </Link>
                                    )}

                                    {/* Панель администратора */}
                                    {role === "ADMIN" && (
                                        <Link
                                            href="/admin"
                                            className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.05]"
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-slate-400">
                                                🛡
                                            </div>

                                            <div>
                                                <div className="text-sm font-medium text-white">
                                                    Панель администратора
                                                </div>

                                                <div className="text-[11px] text-slate-600">
                                                    Управление сайтом
                                                </div>
                                            </div>
                                        </Link>
                                    )}

                                    {/* Панель основателя */}
                                    {role === "FOUNDER" && (
                                        <Link
                                            href="/founder"
                                            className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.05]"
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-slate-400">
                                                ★
                                            </div>

                                            <div>
                                                <div className="text-sm font-medium text-white">
                                                    Панель основателя
                                                </div>

                                                <div className="text-[11px] text-slate-600">
                                                    Полное управление
                                                </div>
                                            </div>
                                        </Link>
                                    )}
                                </div>

                                {/* Выход */}
                                <div className="border-t border-white/[0.06] p-2">
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-red-500/[0.06]"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/[0.06] text-red-400">
                                            <svg
                                                className="h-4 w-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                            >
                                                <path d="M10 17l5-5-5-5" />
                                                <path d="M15 12H3" />
                                                <path d="M21 19V5a2 2 0 00-2-2h-7" />
                                            </svg>
                                        </div>

                                        <div>
                                            <div className="text-sm font-medium text-red-400">
                                                Выйти
                                            </div>

                                            <div className="text-[11px] text-slate-600">
                                                Завершить сессию
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
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