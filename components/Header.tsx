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
}: {
    username: string;
    avatar?: string | null;
}) {
    const firstLetter =
        username?.trim().charAt(0).toUpperCase() || "?";

    if (avatar) {
        return (
            <div className="h-7 w-7 shrink-0 overflow-hidden rounded-lg bg-black">
                <img
                    src={avatar}
                    alt={username}
                    className="h-full w-full object-cover"
                />
            </div>
        );
    }

    return (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-black text-xs font-bold text-white">
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

                {/* Авторизация */}
                {!loaded ? (
                    <div className="h-11 w-[185px] rounded-xl bg-white/[0.03]" />
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
                            className={`flex h-11 min-w-[185px] items-center gap-2 rounded-xl px-2.5 transition-all duration-200 ${
                                menuOpen
                                    ? "bg-white/[0.08]"
                                    : "bg-blue-600 shadow-lg shadow-blue-600/10 hover:bg-blue-500"
                            }`}
                        >
                            <UserAvatar
                                username={user.username}
                                avatar={user.avatar}
                            />

                            <span className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-white">
                                {user.username}
                            </span>

                            <svg
                                className={`h-3.5 w-3.5 shrink-0 text-white/60 transition-transform duration-200 ${
                                    menuOpen
                                        ? "rotate-180"
                                        : ""
                                }`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25-4.51a.75.75 0 01.02-1.06l4.25 4.51a.75.75 0 01-.02 1.06z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        {/* Выпадающее меню */}
                        {menuOpen && (
                            <div className="absolute right-0 top-[calc(100%+8px)] w-[205px] overflow-hidden rounded-[15px] border border-white/[0.08] bg-[#0D1117] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

                                {/* Имя и роль */}
                                <div className="mb-1 flex items-center gap-2.5 rounded-lg px-2.5 py-2">
                                    <UserAvatar
                                        username={user.username}
                                        avatar={user.avatar}
                                    />

                                    <div className="min-w-0">
                                        <div className="truncate text-xs font-semibold text-white">
                                            {user.username}
                                        </div>

                                        <div className="mt-0.5 truncate text-[10px] text-slate-500">
                                            {roleName}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-1 h-px bg-white/[0.06]" />

                                {/* Профиль */}
                                <Link
                                    href="/profile"
                                    className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                                >
                                    <span className="w-5 text-center text-slate-500">
                                        👤
                                    </span>

                                    <span>
                                        Профиль
                                    </span>
                                </Link>

                                {/* Настройки */}
                                <Link
                                    href="/profile/settings"
                                    className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                                >
                                    <span className="w-5 text-center text-slate-500">
                                        ⚙
                                    </span>

                                    <span>
                                        Настройки
                                    </span>
                                </Link>

                                {/* Продавец */}
                                {role === "SELLER" && (
                                    <Link
                                        href="/seller"
                                        className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                                    >
                                        <span className="w-5 text-center text-slate-500">
                                            🛒
                                        </span>

                                        <span>
                                            Панель продавца
                                        </span>
                                    </Link>
                                )}

                                {/* Администратор */}
                                {role === "ADMIN" && (
                                    <Link
                                        href="/admin"
                                        className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                                    >
                                        <span className="w-5 text-center text-slate-500">
                                            🛡
                                        </span>

                                        <span>
                                            Панель администратора
                                        </span>
                                    </Link>
                                )}

                                {/* Основатель */}
                                {role === "FOUNDER" && (
                                    <Link
                                        href="/founder"
                                        className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                                    >
                                        <span className="w-5 text-center text-slate-500">
                                            ★
                                        </span>

                                        <span>
                                            Панель основателя
                                        </span>
                                    </Link>
                                )}

                                <div className="my-1.5 h-px bg-white/[0.06]" />

                                {/* Выход */}
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm text-red-400 transition-colors hover:bg-red-500/[0.07]"
                                >
                                    <span className="w-5 text-center">
                                        ⇥
                                    </span>

                                    <span>
                                        Выйти
                                    </span>
                                </button>
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