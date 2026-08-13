"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type User = {
    id: number;
    username: string;
    avatar?: string | null;
    role?: string;
    server?: string | null;
};

const roleNames: Record<string, string> = {
    USER: "Пользователь",
    SELLER: "Продавец",
    ADMIN: "Администратор",
    FOUNDER: "Основатель",
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

    const roleName =
        roleNames[user?.role || "USER"] || "Пользователь";

    if (!loaded) {
        return (
            <main className="min-h-screen bg-[#080B10]" />
        );
    }

    if (!user) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#080B10] px-5 text-white">
                <div className="text-center">
                    <div className="text-5xl">
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
        );
    }

    return (
        <main className="min-h-screen bg-[#080B10] px-4 pb-20 pt-[125px] text-slate-100 sm:px-6">

            {/* Фоновое свечение */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-[-250px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/[0.055] blur-[150px]" />

                <div className="absolute bottom-[-250px] left-[-150px] h-[450px] w-[450px] rounded-full bg-blue-500/[0.025] blur-[150px]" />
            </div>

            <div className="relative mx-auto w-full max-w-6xl">

                {/* Заголовок */}
                <div className="mb-7">

                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Link
                            href="/"
                            className="transition-colors hover:text-slate-400"
                        >
                            Главная
                        </Link>

                        <span>/</span>

                        <span className="text-slate-500">
                            Профиль
                        </span>
                    </div>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
                        Профиль
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Управляйте своим аккаунтом и настройками профиля.
                    </p>
                </div>

                <div className="grid gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">

                    {/* Левое меню */}
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

                                <div className="min-w-0">
                                    <div className="truncate text-sm font-semibold text-white">
                                        {user.username}
                                    </div>

                                    <div className="mt-0.5 text-[10px] text-slate-500">
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

                    {/* Основной контент */}
                    <section className="min-w-0">

                        {/* ================= PROFILE ================= */}
                        {activeSection === "profile" && (
                            <div className="space-y-5">

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
                                            <div className="text-xl font-bold text-white">
                                                {user.username}
                                            </div>

                                            <div className="mt-1 text-sm text-slate-500">
                                                {roleName}
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
                                                ID пользователя
                                            </div>

                                            <div className="flex h-12 items-center rounded-xl border border-white/[0.06] bg-[#11161D] px-4 text-sm text-slate-300">
                                                #{user.id}
                                            </div>
                                        </div>

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

                                            <div className="flex h-12 items-center rounded-xl border border-white/[0.06] bg-[#11161D] px-4 text-sm text-slate-300">
                                                {roleName}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="mb-2 text-xs font-medium text-slate-500">
                                                Сервер
                                            </div>

                                            <div className="flex h-12 items-center rounded-xl border border-white/[0.06] bg-[#11161D] px-4 text-sm text-slate-300">
                                                {user.server || "Не указан"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ================= SECURITY ================= */}
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

                                {/* Сессия */}
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

                        {/* ================= PRIVACY ================= */}
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

            {/* ================= DELETE MODAL ================= */}
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
    );
}