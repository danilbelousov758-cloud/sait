"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (loading) return;

        setLoading(true);
        setError("");

        try {
            console.log("LOGIN: отправляем запрос");

            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            console.log("LOGIN: статус", response.status);

            const data = await response.json();

            console.log("LOGIN: ответ", data);

            if (!response.ok || !data.success) {
                setError(
                    data.message || "Неверный логин или пароль."
                );
                return;
            }

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            setError("Вход выполнен! Перенаправляем...");

            window.location.href = "/";
        } catch (error) {
            console.error("LOGIN ERROR:", error);

            setError(
                "Не удалось подключиться к серверу. Попробуйте ещё раз."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center px-5 py-10 text-slate-100">
            {/* Фоновое свечение */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-[-250px] h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/[0.06] blur-[150px]" />
            </div>

            <div className="relative w-full max-w-[430px]">

                {/* Логотип */}
                <Link
                    href="/"
                    className="mb-8 flex flex-col items-center"
                >
                    <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11161D] shadow-xl shadow-black/20">
                        <img
                            src="/images/avatar.png"
                            alt="MAZEPOV CONNEXTION"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="mt-4 text-sm font-bold tracking-tight text-white">
                        МАГАЗИН МОДОВ
                    </div>

                    <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                        MAZEPOV CONNEXTION
                    </div>
                </Link>

                {/* Карточка */}
                <div className="rounded-[24px] border border-white/[0.07] bg-[#0D1117] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)] sm:p-8">

                    {/* Заголовок */}
                    <div className="mb-7">
                        <h1 className="text-2xl font-bold tracking-tight text-white">
                            Вход в аккаунт
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Введите данные своего аккаунта, чтобы продолжить.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {/* Логин */}
                        <div>
                            <label
                                htmlFor="username"
                                className="mb-2 block text-xs font-medium text-slate-400"
                            >
                                Логин
                            </label>

                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(event) =>
                                    setUsername(event.target.value)
                                }
                                placeholder="Введите логин"
                                autoComplete="username"
                                required
                                className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#11161D] px-4 text-sm text-white outline-none transition-all placeholder:text-slate-700 focus:border-blue-500/50 focus:bg-[#131920] focus:ring-4 focus:ring-blue-500/[0.07]"
                            />
                        </div>

                        {/* Пароль */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-xs font-medium text-slate-400"
                                >
                                    Пароль
                                </label>

                                <button
                                    type="button"
                                    className="text-xs font-medium text-slate-600 transition-colors hover:text-blue-400"
                                >
                                    Забыли пароль?
                                </button>
                            </div>

                            <div className="relative">
                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="Введите пароль"
                                    autoComplete="current-password"
                                    required
                                    className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#11161D] px-4 pr-12 text-sm text-white outline-none transition-all placeholder:text-slate-700 focus:border-blue-500/50 focus:bg-[#131920] focus:ring-4 focus:ring-blue-500/[0.07]"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((value) => !value)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-600 transition-colors hover:text-slate-300"
                                    aria-label={
                                        showPassword
                                            ? "Скрыть пароль"
                                            : "Показать пароль"
                                    }
                                >
                                    {showPassword ? "◉" : "○"}
                                </button>
                            </div>
                        </div>

                        {/* Сообщение */}
                        {error && (
                            <div
                                className={`rounded-xl border px-4 py-3 text-sm ${
                                    error.includes("Вход выполнен")
                                        ? "border-green-500/10 bg-green-500/[0.06] text-green-400"
                                        : "border-red-500/10 bg-red-500/[0.06] text-red-400"
                                }`}
                            >
                                {error}
                            </div>
                        )}

                        {/* Кнопка */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="h-12 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition-all duration-200 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Входим..." : "Войти"}
                        </button>
                    </form>

                    {/* Регистрация */}
                    <div className="mt-7 border-t border-white/[0.06] pt-6 text-center">
                        <span className="text-sm text-slate-600">
                            Нет аккаунта?
                        </span>

                        <Link
                            href="/register"
                            className="ml-1.5 text-sm font-semibold text-blue-500 transition-colors hover:text-blue-400"
                        >
                            Зарегистрироваться
                        </Link>
                    </div>
                </div>

                {/* Назад */}
                <Link
                    href="/"
                    className="mt-6 block text-center text-xs text-slate-700 transition-colors hover:text-slate-400"
                >
                    ← Вернуться на главную
                </Link>
            </div>
        </main>
    );
}

