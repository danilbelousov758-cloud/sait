"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

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
            }
        };

        loadUser();

        window.addEventListener("storage", loadUser);
        window.addEventListener("userUpdated", loadUser);

        return () => {
            window.removeEventListener("storage", loadUser);
            window.removeEventListener("userUpdated", loadUser);
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

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");

        setUser(null);
        setMenuOpen(false);

        window.dispatchEvent(new Event("userUpdated"));

        router.push("/");
        router.refresh();
    };

    const firstLetter =
        user?.username?.trim().charAt(0).toUpperCase() || "?";

    const role = user?.role?.toUpperCase() || "USER";

    const roleName =
        roleNames[role] || "Пользователь";

    const getRoleBadgeClass = () => {
        switch (role) {
            case "FOUNDER":
                return "bg-purple-500/15 text-purple-300 border-purple-500/15";

            case "ADMIN":
                return "bg-red-500/15 text-red-300 border-red-500/15";

            case "SELLER":
                return "bg-emerald-500/15 text-emerald-300 border-emerald-500/15";

            default:
                return "bg-white/[0.07] text-slate-300 border-white/[0.06]";
        }
    };

    /*
     * Панели пользователя.
     *
     * SELLER:
     * - Панель продавца
     *
     * ADMIN:
     * - Панель администратора
     * - Панель продавца
     *
     * FOUNDER:
     * - Панель основателя
     * - Панель администратора
     * - Панель продавца
     */
    const getPanels = () => {
        switch (role) {
            case "FOUNDER":
                return [
                    {
                        title: "Панель основателя",
                        href: "/founder",
                        icon: "👑",
                        color: "text-purple-300",
                        background:
                            "hover:bg-purple-500/[0.06]",
                    },
                    {
                        title: "Панель администратора",
                        href: "/admin",
                        icon: "🛡️",
                        color: "text-red-300",
                        background:
                            "hover:bg-red-500/[0.06]",
                    },
                    {
                        title: "Панель продавца",
                        href: "/seller",
                        icon: "💼",
                        color: "text-emerald-300",
                        background:
                            "hover:bg-emerald-500/[0.06]",
                    },
                ];

            case "ADMIN":
                return [
                    {
                        title: "Панель администратора",
                        href: "/admin",
                        icon: "🛡️",
                        color: "text-red-300",
                        background:
                            "hover:bg-red-500/[0.06]",
                    },
                    {
                        title: "Панель продавца",
                        href: "/seller",
                        icon: "💼",
                        color: "text-emerald-300",
                        background:
                            "hover:bg-emerald-500/[0.06]",
                    },
                ];

            case "SELLER":
                return [
                    {
                        title: "Панель продавца",
                        href: "/seller",
                        icon: "💼",
                        color: "text-emerald-300",
                        background:
                            "hover:bg-emerald-500/[0.06]",
                    },
                ];

            default:
                return [];
        }
    };

    const panels = getPanels();

    return (
<header className="
    fixed
    left-1/2
    top-5
    z-50
    w-[calc(100%-24px)]
    max-w-7xl
    -translate-x-1/2
    sm:w-[calc(100%-32px)]
">

    <div className="
        flex
        h-[70px]
        items-center
        justify-between
        rounded-[20px]
        border
        border-white/10
        bg-black/30
        px-4
        shadow-[0_15px_50px_rgba(0,0,0,0.45)]
        backdrop-blur-2xl
        sm:px-5
        md:px-7
    ">
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
                        const active =
                            pathname === item.href;

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

                {/* Пользователь */}
                <div
                    ref={menuRef}
                    className="relative"
                >
                    {!user ? (
                        <Link
                            href="/login"
                            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition-all duration-200 hover:bg-blue-500"
                        >
                            Войти
                        </Link>
                    ) : (
                        <>
                            {/* Кнопка пользователя */}
                            <button
                                type="button"
                                onClick={() =>
                                    setMenuOpen(
                                        (value) => !value
                                    )
                                }
                                className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-all duration-200 ${
                                    menuOpen
                                        ? "bg-blue-600 shadow-lg shadow-blue-600/20"
                                        : "bg-blue-600 hover:bg-blue-500"
                                }`}
                            >
                                {/* Аватар */}
                                {user.avatar ? (
                                    <div className="h-8 w-8 overflow-hidden rounded-lg border border-white/10 bg-black">
                                        <img
                                            src={user.avatar}
                                            alt={user.username}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black text-xs font-bold text-white">
                                        {firstLetter}
                                    </div>
                                )}

                                {/* Ник + бейдж роли */}
                                <div className="hidden max-w-[160px] text-left sm:block">
                                    <div className="truncate text-xs font-semibold text-white">
                                        {user.username}
                                    </div>

                                    <span
                                        className={`mt-0.5 inline-flex max-w-full items-center truncate rounded-md border px-1.5 py-0.5 text-[9px] font-semibold leading-none ${getRoleBadgeClass()}`}
                                    >
                                        {roleName}
                                    </span>
                                </div>

                                {/* Стрелка */}
                                <svg
                                    className={`h-3.5 w-3.5 shrink-0 text-blue-100 transition-transform duration-200 ${
                                        menuOpen
                                            ? "rotate-180"
                                            : ""
                                    }`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01-1.08 1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>

                            {/* Выпадающее меню */}
                            {menuOpen && (
                                <div className="absolute right-0 top-[calc(100%+10px)] w-[250px] overflow-hidden rounded-[17px] border border-white/[0.08] bg-[#0D1117] p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">

                                    {/* Пользователь */}
                                    <div className="mb-1 rounded-[13px] bg-white/[0.025] px-3 py-2.5">
                                        <div className="flex items-center gap-3">

                                            {user.avatar ? (
                                                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-black">
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.username}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black text-xs font-bold text-white">
                                                    {firstLetter}
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <div className="truncate text-sm font-semibold text-white">
                                                    {user.username}
                                                </div>

                                                <span
                                                    className={`mt-1 inline-flex items-center rounded-md border px-1.5 py-0.5 text-[9px] font-semibold ${getRoleBadgeClass()}`}
                                                >
                                                    {roleName}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Профиль */}
                                    <Link
                                        href="/profile"
                                        onClick={() =>
                                            setMenuOpen(false)
                                        }
                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                                    >
                                        <span>👤</span>

                                        <span>
                                            Профиль
                                        </span>
                                    </Link>

                                    {/* Настройки */}
                                    <Link
                                        href="/profile"
                                        onClick={() =>
                                            setMenuOpen(false)
                                        }
                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                                    >
                                        <span>⚙</span>

                                        <span>
                                            Настройки
                                        </span>
                                    </Link>

                                    {/* Панели */}
                                    {panels.length > 0 && (
                                        <>
                                            <div className="my-1.5 h-px bg-white/[0.06]" />

                                            <div className="px-3 pb-1 pt-1">
                                                <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-700">
                                                    Управление
                                                </div>
                                            </div>

                                            <div className="space-y-0.5">
                                                {panels.map((panel) => (
                                                    <Link
                                                        key={panel.href}
                                                        href={panel.href}
                                                        onClick={() =>
                                                            setMenuOpen(false)
                                                        }
                                                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:text-white ${panel.background}`}
                                                    >
                                                        <span
                                                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.035] text-sm ${panel.color}`}
                                                        >
                                                            {panel.icon}
                                                        </span>

                                                        <span className="flex-1">
                                                            {panel.title}
                                                        </span>

                                                        <span className="text-xs text-slate-700">
                                                            →
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    <div className="my-1.5 h-px bg-white/[0.06]" />

                                    {/* Выход */}
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/[0.06] hover:text-red-300"
                                    >
                                        <span>↪</span>

                                        <span>
                                            Выйти
                                        </span>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}