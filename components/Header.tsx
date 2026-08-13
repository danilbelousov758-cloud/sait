"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type User = {
    id: number;
    username: string;
    avatar: string | null;
    role: string;
};

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

function getRoleInfo(role: string) {
    switch (role) {
        case "FOUNDER":
            return {
                name: "Основатель",
                className:
                    "border-purple-500/20 bg-purple-500/10 text-purple-400",
            };

        case "ADMIN":
            return {
                name: "Администратор",
                className:
                    "border-red-500/20 bg-red-500/10 text-red-400",
            };

        case "SELLER":
            return {
                name: "Продавец",
                className:
                    "border-blue-500/20 bg-blue-500/10 text-blue-400",
            };

        default:
            return {
                name: "Пользователь",
                className:
                    "border-white/[0.08] bg-white/[0.04] text-slate-300",
            };
    }
}

function getPanel(role: string) {
    switch (role) {
        case "FOUNDER":
            return {
                name: "Панель основателя",
                href: "/founder",
            };

        case "ADMIN":
            return {
                name: "Панель администратора",
                href: "/admin",
            };

        case "SELLER":
            return {
                name: "Панель продавца",
                href: "/seller",
            };

        default:
            return null;
    }
}

function getInitial(username: string) {
    return username.trim().charAt(0).toUpperCase() || "?";
}

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await fetch("/api/me", {
                    method: "GET",
                    cache: "no-store",
                });

                if (!response.ok) {
                    setUser(null);
                    return;
                }

                const data = await response.json();

                if (data.success && data.user) {
                    setUser(data.user);
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
                setLoading(false);
            }
        };

        loadUser();
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                setProfileOpen(false);
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

    const handleLogout = async () => {
        try {
            await fetch("/api/logout", {
                method: "POST",
            });
        } catch (error) {
            console.error("Ошибка выхода:", error);
        }

        setUser(null);
        setProfileOpen(false);

        router.push("/");
        router.refresh();
    };

    const panel = user ? getPanel(user.role) : null;

    const roleInfo = user
        ? getRoleInfo(user.role)
        : null;

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

                {/* Авторизация */}
                <div
                    className="relative"
                    ref={profileRef}
                >
                    {loading ? (
                        <div className="h-10 w-24 animate-pulse rounded-xl bg-white/[0.04]" />
                    ) : user ? (
                        <>
                            {/* Кнопка профиля */}
                            <button
                                type="button"
                                onClick={() =>
                                    setProfileOpen(
                                        (value) => !value
                                    )
                                }
                                className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition-all ${
                                    profileOpen
                                        ? "border-white/[0.1] bg-white/[0.06]"
                                        : "border-transparent hover:border-white/[0.06] hover:bg-white/[0.04]"
                                }`}
                            >
                                {/* Аватар */}
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.username}
                                        className="h-8 w-8 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#11161D] text-xs font-bold text-white">
                                        {getInitial(
                                            user.username
                                        )}
                                    </div>
                                )}

                                {/* Ник + роль */}
                                <div className="hidden text-left sm:block">
                                    <div className="max-w-[130px] truncate text-xs font-semibold text-white">
                                        {user.username}
                                    </div>

                                    {roleInfo && (
                                        <span
                                            className={`mt-1 inline-flex rounded-md border px-2 py-0.5 text-[9px] font-semibold leading-none ${roleInfo.className}`}
                                        >
                                            {roleInfo.name}
                                        </span>
                                    )}
                                </div>

                                <span
                                    className={`hidden text-[10px] text-slate-600 transition-transform sm:block ${
                                        profileOpen
                                            ? "rotate-180"
                                            : ""
                                    }`}
                                >
                                    ↓
                                </span>
                            </button>

                            {/* Выпадающее меню */}
                            {profileOpen && (
                                <div className="absolute right-0 top-[calc(100%+10px)] w-[250px] overflow-hidden rounded-[17px] border border-white/[0.08] bg-[#0D1117] p-2 shadow-[0_20px_70px_rgba(0,0,0,0.55)]">

                                    {/* Информация о пользователе */}
                                    <div className="mb-1 rounded-xl bg-white/[0.025] px-3 py-3">
                                        <div className="flex items-center gap-3">

                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={user.username}
                                                    className="h-10 w-10 rounded-xl object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#11161D] text-sm font-bold text-white">
                                                    {getInitial(
                                                        user.username
                                                    )}
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <div className="truncate text-sm font-semibold text-white">
                                                    {user.username}
                                                </div>

                                                {roleInfo && (
                                                    <span
                                                        className={`mt-1 inline-flex rounded-md border px-2 py-0.5 text-[9px] font-semibold leading-none ${roleInfo.className}`}
                                                    >
                                                        {
                                                            roleInfo.name
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Профиль */}
                                    <Link
                                        href="/profile"
                                        onClick={() =>
                                            setProfileOpen(
                                                false
                                            )
                                        }
                                        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                                    >
                                        <span>
                                            Профиль
                                        </span>

                                        <span className="text-xs text-slate-700">
                                            →
                                        </span>
                                    </Link>

                                    {/* Настройки */}
                                    <Link
                                        href="/profile/settings"
                                        onClick={() =>
                                            setProfileOpen(
                                                false
                                            )
                                        }
                                        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                                    >
                                        <span>
                                            Настройки
                                        </span>

                                        <span className="text-xs text-slate-700">
                                            →
                                        </span>
                                    </Link>

                                    {/* Панель */}
                                    {panel && (
                                        <>
                                            <div className="my-1 h-px bg-white/[0.05]" />

                                            <Link
                                                href={
                                                    panel.href
                                                }
                                                onClick={() =>
                                                    setProfileOpen(
                                                        false
                                                    )
                                                }
                                                className="flex items-center justify-between rounded-xl bg-blue-600/[0.08] px-3 py-2.5 text-sm font-medium text-blue-400 transition hover:bg-blue-600/[0.14] hover:text-blue-300"
                                            >
                                                <span>
                                                    {
                                                        panel.name
                                                    }
                                                </span>

                                                <span className="text-xs">
                                                    →
                                                </span>
                                            </Link>
                                        </>
                                    )}

                                    <div className="my-1 h-px bg-white/[0.05]" />

                                    {/* Выход */}
                                    <button
                                        type="button"
                                        onClick={
                                            handleLogout
                                        }
                                        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-red-400/70 transition hover:bg-red-500/[0.06] hover:text-red-400"
                                    >
                                        <span>
                                            Выйти
                                        </span>

                                        <span className="text-xs">
                                            ↗
                                        </span>
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition-all duration-200 hover:bg-blue-500"
                        >
                            Войти
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}