"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
            <div className="h-24 w-24 overflow-hidden rounded-[26px] border border-white/[0.08] bg-black shadow-2xl">
                <img
                    src={avatar}
                    alt={username}
                    className="h-full w-full object-cover"
                />
            </div>
        );
    }

    return (
        <div className="flex h-24 w-24 items-center justify-center rounded-[26px] border border-white/[0.08] bg-black text-3xl font-bold text-white shadow-2xl">
            {firstLetter}
        </div>
    );
}

export default function ProfilePage() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem("user");

            if (!savedUser) {
                router.replace("/login");
                return;
            }

            const parsedUser = JSON.parse(savedUser);

            setUser(parsedUser);
        } catch (error) {
            console.error(
                "Ошибка загрузки профиля:",
                error
            );

            localStorage.removeItem("user");
            router.replace("/login");
        } finally {
            setLoading(false);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("user");

        router.replace("/");

        window.location.reload();
    };

    if (loading || !user) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#080B10] text-white">
                <div className="text-sm text-slate-500">
                    Загрузка профиля...
                </div>
            </main>
        );
    }

    const role = user.role || "USER";

    const roleName =
        roleNames[role] || "Пользователь";

    const isSeller = role === "SELLER";
    const isAdmin = role === "ADMIN";
    const isFounder = role === "FOUNDER";

    return (
        <main className="min-h-screen bg-[#080B10] px-5 pb-16 pt-32 text-slate-100">
            <div className="mx-auto w-full max-w-5xl">

                {/* Верхняя карточка */}
                <div className="rounded-[28px] border border-white/[0.07] bg-[#0D1117] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)] sm:p-8">

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                        <UserAvatar
                            username={user.username}
                            avatar={user.avatar}
                        />

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight text-white">
                                    {user.username}
                                </h1>

                                <span className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-slate-400">
                                    {roleName}
                                </span>
                            </div>

                            <p className="mt-2 text-sm text-slate-500">
                                Добро пожаловать в MAZEPOV CONNEXTION
                            </p>
                        </div>
                    </div>
                </div>

                {/* Меню */}
                <div className="mt-5 grid gap-3">

                    {/* Профиль */}
                    <Link
                        href="/profile"
                        className="group flex items-center justify-between rounded-2xl border border-white/[0.07] bg-[#0D1117] px-5 py-4 transition-all hover:border-white/[0.12] hover:bg-[#11161D]"
                    >
                        <div>
                            <div className="text-sm font-semibold text-white">
                                Профиль
                            </div>

                            <div className="mt-1 text-xs text-slate-600">
                                Информация о вашем аккаунте
                            </div>
                        </div>

                        <span className="text-slate-600 transition-transform group-hover:translate-x-1">
                            →
                        </span>
                    </Link>

                    {/* Настройки */}
                    <Link
                        href="/profile/settings"
                        className="group flex items-center justify-between rounded-2xl border border-white/[0.07] bg-[#0D1117] px-5 py-4 transition-all hover:border-white/[0.12] hover:bg-[#11161D]"
                    >
                        <div>
                            <div className="text-sm font-semibold text-white">
                                Настройки
                            </div>

                            <div className="mt-1 text-xs text-slate-600">
                                Настройки аккаунта и профиля
                            </div>
                        </div>

                        <span className="text-slate-600 transition-transform group-hover:translate-x-1">
                            →
                        </span>
                    </Link>

                    {/* Панель продавца */}
                    {isSeller && (
                        <Link
                            href="/seller"
                            className="group flex items-center justify-between rounded-2xl border border-white/[0.07] bg-[#0D1117] px-5 py-4 transition-all hover:border-white/[0.12] hover:bg-[#11161D]"
                        >
                            <div>
                                <div className="text-sm font-semibold text-white">
                                    Панель продавца
                                </div>

                                <div className="mt-1 text-xs text-slate-600">
                                    Управление товарами и продажами
                                </div>
                            </div>

                            <span className="text-slate-600 transition-transform group-hover:translate-x-1">
                                →
                            </span>
                        </Link>
                    )}

                    {/* Панель администратора */}
                    {isAdmin && (
                        <Link
                            href="/admin"
                            className="group flex items-center justify-between rounded-2xl border border-white/[0.07] bg-[#0D1117] px-5 py-4 transition-all hover:border-white/[0.12] hover:bg-[#11161D]"
                        >
                            <div>
                                <div className="text-sm font-semibold text-white">
                                    Панель администратора
                                </div>

                                <div className="mt-1 text-xs text-slate-600">
                                    Управление сайтом и пользователями
                                </div>
                            </div>

                            <span className="text-slate-600 transition-transform group-hover:translate-x-1">
                                →
                            </span>
                        </Link>
                    )}

                    {/* Панель основателя */}
                    {isFounder && (
                        <Link
                            href="/founder"
                            className="group flex items-center justify-between rounded-2xl border border-white/[0.07] bg-[#0D1117] px-5 py-4 transition-all hover:border-white/[0.12] hover:bg-[#11161D]"
                        >
                            <div>
                                <div className="text-sm font-semibold text-white">
                                    Панель основателя
                                </div>

                                <div className="mt-1 text-xs text-slate-600">
                                    Полное управление проектом
                                </div>
                            </div>

                            <span className="text-slate-600 transition-transform group-hover:translate-x-1">
                                →
                            </span>
                        </Link>
                    )}

                    {/* Выход */}
                    <button
                        onClick={handleLogout}
                        className="mt-2 flex w-full items-center justify-between rounded-2xl border border-red-500/[0.08] bg-[#0D1117] px-5 py-4 text-left transition-all hover:border-red-500/[0.15] hover:bg-red-500/[0.03]"
                    >
                        <div>
                            <div className="text-sm font-semibold text-red-400">
                                Выйти
                            </div>

                            <div className="mt-1 text-xs text-slate-600">
                                Завершить текущую сессию
                            </div>
                        </div>

                        <span className="text-red-500/50">
                            →
                        </span>
                    </button>
                </div>
            </div>
        </main>
    );
}