"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

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

const roleStyles: Record<string, string> = {
    USER: "border-white/[0.10] bg-white/[0.06] text-white",
    SELLER: "border-blue-500/[0.20] bg-blue-500/[0.10] text-blue-400",
    ADMIN: "border-red-500/[0.20] bg-red-500/[0.10] text-red-400",
    FOUNDER: "border-purple-500/[0.20] bg-purple-500/[0.10] text-purple-400",
};

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loaded, setLoaded] = useState(false);

    const [activeSection, setActiveSection] = useState<
        "profile" | "security" | "privacy"
    >("profile");

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [deletingAccount, setDeletingAccount] = useState(false);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem("user");

            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);

                setUser(parsedUser);
                setAvatarPreview(parsedUser.avatar || null);
            }
        } catch (error) {
            console.error("Ошибка загрузки профиля:", error);
        } finally {
            setLoaded(true);
        }
    }, []);

    const handleAvatarChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Выберите изображение.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Размер изображения не должен превышать 5 МБ.");
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                setAvatarPreview(reader.result);

                if (user) {
                    const updatedUser = {
                        ...user,
                        avatar: reader.result,
                    };

                    setUser(updatedUser);

                    localStorage.setItem(
                        "user",
                        JSON.stringify(updatedUser)
                    );
                }
            }
        };

        reader.readAsDataURL(file);
    };

    const handlePasswordSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setPasswordMessage("");

        if (newPassword.length < 6) {
            setPasswordMessage(
                "Новый пароль должен содержать минимум 6 символов."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordMessage("Пароли не совпадают.");
            return;
        }

        setSavingPassword(true);

        try {
            await new Promise((resolve) =>
                setTimeout(resolve, 700)
            );

            setPasswordMessage(
                "Изменение пароля будет подключено следующим этапом."
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } finally {
            setSavingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) return;

        if (deleteConfirm !== user.username) {
            return;
        }

        setDeletingAccount(true);

        try {
            await new Promise((resolve) =>
                setTimeout(resolve, 800)
            );

            localStorage.removeItem("user");

            window.location.href = "/";
        } finally {
            setDeletingAccount(false);
        }
    };

    const firstLetter =
        user?.username?.trim().charAt(0).toUpperCase() || "?";

    const roleKey = user?.role || "USER";

    const roleName =
        roleNames[roleKey] || "Пользователь";

    const roleStyle =
        roleStyles[roleKey] ||
        roleStyles.USER;

    if (!loaded) {
        return (
            <main className="min-h-screen bg-[#080B10]" />
        );
    }

    if (!user) {
        return (
            <>
                <Header />

                <main className="flex min-h-screen items-center justify-center bg-[#080B10] px-5 pt-24 text-white">
                    <div className="text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-[#11161D] text-2xl">
                            🔒
                        </div>

                        <h1 className="mt-5 text-2xl font-bold">
                            Вы не авторизованы
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Войдите в аккаунт, чтобы открыть профиль.
                        </p>

                        <Link
                            href="/login"
                            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                        >
                            Войти
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header />

            <main className="min-h-screen bg-[#080B10] px-4 pb-20 pt-[125px] text-slate-100 sm:px-6">

                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="absolute left-1/2 top-[-250px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/[0.055] blur-[150px]" />

                    <div className="absolute bottom-[-250px] left-[-150px] h-[450px] w-[450px] rounded-full bg-blue-500/[0.025] blur-[150px]" />
                </div>

                <div className="relative mx-auto w-full max-w-6xl">

                    <div className="mb-7">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Профиль
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Управляйте своим аккаунтом и настройками профиля.
                        </p>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">

                        {/* ЛЕВОЕ МЕНЮ */}
                        <aside className="h-fit rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">

                            {/* Пользователь */}
                            <div className="mb-2 rounded-[15px] bg-white/[0.025] p-3">

                                <div className="flex items-center gap-3">

                                    {avatarPreview ? (
                                        <div className="h-10 w-10 overflow-hidden rounded-xl bg-black">
                                            <img
                                                src={avatarPreview}
                                                alt={user.username}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-black text-sm font-bold text-white">
                                            {firstLetter}
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1">

                                        <div className="truncate text-sm font-semibold text-white">
                                            {user.username}
                                        </div>

                                        {/* Бейдж роли */}
                                        <div
                                            className={`mt-1 inline-flex items-center rounded-md border px-2 py-[3px] text-[9px] font-semibold leading-none ${roleStyle}`}
                                        >
                                            {roleName}
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* Профиль */}
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveSection("profile")
                                }
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-all ${
                                    activeSection === "profile"
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                                        : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                                }`}
                            >
                                <span>👤</span>
                                <span>Профиль</span>
                            </button>

                            {/* Безопасность */}
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveSection("security")
                                }
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-all ${
                                    activeSection === "security"
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                                        : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                                }`}
                            >
                                <span>🔐</span>
                                <span>Безопасность</span>
                            </button>

                            {/* Приватность */}
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveSection("privacy")
                                }
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-all ${
                                    activeSection === "privacy"
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                                        : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                                }`}
                            >
                                <span>🛡️</span>
                                <span>Приватность</span>
                            </button>
                        </aside>

                        {/* ОСНОВНОЙ КОНТЕНТ */}
                        <section className="min-w-0">

                            {/* ПРОФИЛЬ */}
                            {activeSection === "profile" && (
                                <div className="space-y-5">

                                    {/* Основная информация */}
                                    <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:p-6">

                                        <div className="mb-6">

                                            <h2 className="text-lg font-bold text-white">
                                                Основная информация
                                            </h2>

                                            <p className="mt-1 text-xs text-slate-600">
                                                Информация вашего аккаунта.
                                            </p>

                                        </div>

                                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                                            {/* Аватар */}
                                            <div className="relative shrink-0">

                                                {avatarPreview ? (
                                                    <div className="h-28 w-28 overflow-hidden rounded-[24px] border border-white/[0.08] bg-black shadow-xl">
                                                        <img
                                                            src={avatarPreview}
                                                            alt={user.username}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex h-28 w-28 items-center justify-center rounded-[24px] border border-white/[0.08] bg-black text-4xl font-bold text-white shadow-xl">
                                                        {firstLetter}
                                                    </div>
                                                )}

                                                <label
                                                    htmlFor="avatar-upload"
                                                    className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-white/[0.08] bg-[#151B23] text-sm shadow-lg transition hover:bg-[#1B222C]"
                                                >
                                                    ✎
                                                </label>

                                                <input
                                                    id="avatar-upload"
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/webp"
                                                    onChange={handleAvatarChange}
                                                    className="hidden"
                                                />

                                            </div>

                                            <div>

                                                <div className="flex flex-wrap items-center gap-3">

                                                    <div className="text-xl font-bold text-white">
                                                        {user.username}
                                                    </div>

                                                    {/* Бейдж роли в самом профиле */}
                                                    <div
                                                        className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-semibold ${roleStyle}`}
                                                    >
                                                        {roleName}
                                                    </div>

                                                </div>

                                                <label
                                                    htmlFor="avatar-upload"
                                                    className="mt-4 inline-flex cursor-pointer rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                                                >
                                                    Изменить аватар
                                                </label>

                                                <div className="mt-2 text-[10px] text-slate-700">
                                                    PNG, JPG или WEBP · до 5 МБ
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    {/* Данные аккаунта */}
                                    <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:p-6">

                                        <div className="mb-6">

                                            <h2 className="text-lg font-bold text-white">
                                                Данные аккаунта
                                            </h2>

                                            <p className="mt-1 text-xs text-slate-600">
                                                Основная информация об аккаунте.
                                            </p>

                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">

                                            <div>

                                                <div className="mb-2 text-xs font-medium text-slate-500">
                                                    Логин
                                                </div>

                                                <div className="flex h-12 items-center rounded-xl border border-white/[0.06] bg-[#11161D] px-4 text-sm text-slate-300">
                                                    {user.username}
                                                </div>

                                            </div>

                                            <div>

                                                <div className="mb-2 text-xs font-medium text-slate-500">
                                                    Роль
                                                </div>

                                                <div className="flex h-12 items-center rounded-xl border border-white/[0.06] bg-[#11161D] px-4">

                                                    <span
                                                        className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-semibold ${roleStyle}`}
                                                    >
                                                        {roleName}
                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            )}

                            {/* БЕЗОПАСНОСТЬ */}
                            {activeSection === "security" && (
                                <div className="space-y-5">

                                    <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:p-6">

                                        <div className="mb-6">

                                            <h2 className="text-lg font-bold text-white">
                                                Изменение пароля
                                            </h2>

                                            <p className="mt-1 text-xs text-slate-600">
                                                Используйте сложный пароль, который не используется на других сайтах.
                                            </p>

                                        </div>

                                        <form
                                            onSubmit={handlePasswordSubmit}
                                            className="space-y-5"
                                        >

                                            <div>

                                                <label className="mb-2 block text-xs font-medium text-slate-400">
                                                    Текущий пароль
                                                </label>

                                                <input
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={(event) =>
                                                        setCurrentPassword(
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Введите текущий пароль"
                                                    required
                                                    className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#11161D] px-4 text-sm text-white outline-none transition focus:border-blue-500/50 focus:bg-[#131920] focus:ring-4 focus:ring-blue-500/[0.07]"
                                                />

                                            </div>

                                            <div>

                                                <label className="mb-2 block text-xs font-medium text-slate-400">
                                                    Новый пароль
                                                </label>

                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(event) =>
                                                        setNewPassword(
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Введите новый пароль"
                                                    required
                                                    className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#11161D] px-4 text-sm text-white outline-none transition focus:border-blue-500/50 focus:bg-[#131920] focus:ring-4 focus:ring-blue-500/[0.07]"
                                                />

                                            </div>

                                            <div>

                                                <label className="mb-2 block text-xs font-medium text-slate-400">
                                                    Повторите новый пароль
                                                </label>

                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(event) =>
                                                        setConfirmPassword(
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Повторите новый пароль"
                                                    required
                                                    className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#11161D] px-4 text-sm text-white outline-none transition focus:border-blue-500/50 focus:bg-[#131920] focus:ring-4 focus:ring-blue-500/[0.07]"
                                                />

                                            </div>

                                            {passwordMessage && (
                                                <div className="rounded-xl border border-blue-500/10 bg-blue-500/[0.05] px-4 py-3 text-xs text-blue-400">
                                                    {passwordMessage}
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={savingPassword}
                                                className="h-12 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {savingPassword
                                                    ? "Сохраняем..."
                                                    : "Изменить пароль"}
                                            </button>

                                        </form>

                                    </div>

                                    <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:p-6">

                                        <h2 className="text-lg font-bold text-white">
                                            Текущая сессия
                                        </h2>

                                        <p className="mt-1 text-xs text-slate-600">
                                            Информация о текущем входе в аккаунт.
                                        </p>

                                        <div className="mt-5 flex items-center justify-between rounded-xl border border-white/[0.05] bg-[#11161D] px-4 py-3">

                                            <div>

                                                <div className="text-sm font-medium text-white">
                                                    Это устройство
                                                </div>

                                                <div className="mt-1 text-[11px] text-slate-600">
                                                    Текущая активная сессия
                                                </div>

                                            </div>

                                            <div className="rounded-lg bg-green-500/[0.08] px-2.5 py-1 text-[10px] font-semibold text-green-400">
                                                Активна
                                            </div>

                                        </div>

                                    </div>

                                </div>
                            )}

                            {/* ПРИВАТНОСТЬ */}
                            {activeSection === "privacy" && (
                                <div className="space-y-5">

                                    <div className="rounded-[20px] border border-red-500/[0.12] bg-[#0D1117] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:p-6">

                                        <div className="mb-6">

                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/[0.08] text-lg">
                                                ⚠
                                            </div>

                                            <h2 className="mt-5 text-lg font-bold text-white">
                                                Удаление аккаунта
                                            </h2>

                                            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                                                После удаления аккаунта восстановить его будет невозможно. Все связанные с аккаунтом данные могут быть удалены.
                                            </p>

                                        </div>

                                        <div className="rounded-xl border border-red-500/[0.08] bg-red-500/[0.025] p-4">

                                            <div className="text-sm font-semibold text-red-400">
                                                Опасная зона
                                            </div>

                                            <div className="mt-1 text-xs leading-5 text-slate-600">
                                                Это действие необратимо. Перед удалением убедитесь, что вы действительно хотите удалить свой аккаунт.
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowDeleteModal(true)
                                                }
                                                className="mt-4 rounded-xl border border-red-500/[0.15] bg-red-500/[0.06] px-4 py-2.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/[0.1] hover:text-red-300"
                                            >
                                                Удалить аккаунт
                                            </button>

                                        </div>

                                    </div>

                                </div>
                            )}

                        </section>

                    </div>

                </div>

                {/* МОДАЛЬНОЕ ОКНО УДАЛЕНИЯ */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">

                        <div className="w-full max-w-[420px] rounded-[22px] border border-white/[0.08] bg-[#0D1117] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.6)]">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/[0.08] text-xl">
                                ⚠
                            </div>

                            <h3 className="mt-5 text-xl font-bold text-white">
                                Удалить аккаунт?
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Это действие нельзя отменить. Все данные аккаунта будут удалены.
                            </p>

                            <div className="mt-5">

                                <label className="mb-2 block text-xs font-medium text-slate-400">
                                    Введите ваш логин для подтверждения
                                </label>

                                <input
                                    type="text"
                                    value={deleteConfirm}
                                    onChange={(event) =>
                                        setDeleteConfirm(
                                            event.target.value
                                        )
                                    }
                                    placeholder={user.username}
                                    className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#11161D] px-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-red-500/40 focus:ring-4 focus:ring-red-500/[0.05]"
                                />

                            </div>

                            <div className="mt-6 flex gap-3">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeleteConfirm("");
                                    }}
                                    className="h-11 flex-1 rounded-xl border border-white/[0.07] bg-white/[0.03] text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                                >
                                    Отмена
                                </button>

                                <button
                                    type="button"
                                    disabled={
                                        deleteConfirm !== user.username ||
                                        deletingAccount
                                    }
                                    onClick={handleDeleteAccount}
                                    className="h-11 flex-1 rounded-xl bg-red-600 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {deletingAccount
                                        ? "Удаляем..."
                                        : "Удалить"}
                                </button>

                            </div>

                        </div>

                    </div>
                )}

            </main>
        </>
    );
}