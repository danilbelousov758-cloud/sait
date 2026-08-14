"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
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

export default function CreateProductPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loaded, setLoaded] = useState(false);

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem("user");

            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (error) {
            console.error("Ошибка загрузки пользователя:", error);
        } finally {
            setLoaded(true);
        }
    }, []);

    const role = user?.role?.toUpperCase() || "USER";

    const roleName =
        roleNames[role] || "Пользователь";

    const firstLetter =
        user?.username?.trim().charAt(0).toUpperCase() || "?";

    const hasAccess =
        role === "SELLER" ||
        role === "ADMIN" ||
        role === "FOUNDER";

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        setFile(selectedFile);

        if (selectedFile.type.startsWith("image/")) {
            const imageUrl = URL.createObjectURL(selectedFile);
            setPreview(imageUrl);
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log({
            name,
            category,
            price,
            description,
            file,
        });

        alert("Товар пока не сохраняется в базу. Подключим сохранение следующим этапом.");
    };

    if (!loaded) {
        return (
            <main className="min-h-screen bg-[#080B10]" />
        );
    }

    if (!user || !hasAccess) {
        return (
            <>
                <Header />

                <main className="flex min-h-screen items-center justify-center bg-[#080B10] px-5 pt-24 text-white">
                    <div className="w-full max-w-md text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-[#11161D] text-2xl">
                            🔒
                        </div>

                        <h1 className="mt-5 text-2xl font-bold">
                            Доступ запрещён
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            У вашего аккаунта нет доступа к добавлению товаров.
                        </p>

                        <Link
                            href="/"
                            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                        >
                            На главную
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header />

            <main className="min-h-screen bg-[#080B10] pt-[95px] text-slate-100">
                {/* Фоновое свечение */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="absolute left-1/2 top-[-300px] h-[550px] w-[750px] -translate-x-1/2 rounded-full bg-blue-600/[0.055] blur-[160px]" />

                    <div className="absolute bottom-[-250px] right-[-200px] h-[500px] w-[500px] rounded-full bg-blue-500/[0.025] blur-[160px]" />
                </div>

                <div className="relative flex min-h-[calc(100vh-95px)]">
                    {/* Боковая панель */}
                    <aside className="fixed bottom-0 left-0 top-[95px] hidden w-[250px] border-r border-white/[0.06] bg-[#0A0D12] lg:block">
                        <div className="flex h-full flex-col">
                            {/* Пользователь */}
                            <div className="border-b border-white/[0.06] p-4">
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/[0.035]"
                                >
                                    {user.avatar ? (
                                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-black">
                                            <img
                                                src={user.avatar}
                                                alt={user.username}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
                                            {firstLetter}
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-xs font-semibold text-white">
                                            {user.username}
                                        </div>

                                        <div className="mt-1 flex w-fit rounded-md bg-blue-600 px-2 py-0.5 text-[9px] font-semibold text-white">
                                            {roleName}
                                        </div>
                                    </div>

                                    <span className="text-xs text-slate-700">
                                        →
                                    </span>
                                </Link>
                            </div>

                            {/* Меню */}
                            <nav className="flex-1 overflow-y-auto px-3 py-5">
                                <div className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-700">
                                    Магазин
                                </div>

                                <div className="space-y-1">
                                    <PanelLink
                                        href="/seller"
                                        icon="⌂"
                                        title="Обзор"
                                    />

                                    <PanelLink
                                        href="/seller/products"
                                        icon="▦"
                                        title="Мои товары"
                                    />

                                    <PanelLink
                                        href="/seller/products/create"
                                        icon="+"
                                        title="Добавить товар"
                                        active
                                    />

                                    <PanelLink
                                        href="/seller/sales"
                                        icon="↗"
                                        title="Мои продажи"
                                    />

                                    <PanelLink
                                        href="/seller/orders"
                                        icon="◫"
                                        title="Заказы"
                                    />

                                    <PanelLink
                                        href="/seller/finance"
                                        icon="₽"
                                        title="Финансы"
                                    />
                                </div>
                            </nav>

                            {/* Низ */}
                            <div className="border-t border-white/[0.06] p-3">
                                <Link
                                    href="/"
                                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 transition hover:bg-white/[0.035] hover:text-white"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#11161D] text-xs">
                                        ←
                                    </div>

                                    <div className="flex-1">
                                        <div className="text-xs font-semibold">
                                            На сайт
                                        </div>

                                        <div className="mt-0.5 text-[9px] text-slate-700">
                                            Вернуться в магазин
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Основная часть */}
                    <section className="min-w-0 flex-1 lg:ml-[250px]">
                        {/* Заголовок */}
                        <header className="border-b border-white/[0.06] px-5 py-6 sm:px-8">
                            <div>
                                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-500">
                                    MAZEPOV CONNEXTION
                                </div>

                                <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                                    Добавить товар
                                </h1>

                                <p className="mt-1 text-xs text-slate-600">
                                    Создайте новый товар для вашего магазина.
                                </p>
                            </div>
                        </header>

                        {/* Контент */}
                        <div className="mx-auto max-w-5xl p-5 sm:p-8">
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                                    {/* Основная информация */}
                                    <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-6">
                                        <div>
                                            <h2 className="text-base font-semibold text-white">
                                                Информация о товаре
                                            </h2>

                                            <p className="mt-1 text-xs text-slate-600">
                                                Основные данные вашего товара.
                                            </p>
                                        </div>

                                        <div className="mt-6 space-y-5">
                                            {/* Название */}
                                            <div>
                                                <label className="mb-2 block text-xs font-semibold text-slate-400">
                                                    Название товара
                                                </label>

                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(event) =>
                                                        setName(
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Например: Police Pack"
                                                    className="w-full rounded-xl border border-white/[0.07] bg-[#11161D] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/40 focus:bg-[#131922]"
                                                />
                                            </div>

                                            {/* Категория */}
                                            <div>
                                                <label className="mb-2 block text-xs font-semibold text-slate-400">
                                                    Категория
                                                </label>

                                                <select
                                                    value={category}
                                                    onChange={(event) =>
                                                        setCategory(
                                                            event.target.value
                                                        )
                                                    }
                                                    className="w-full appearance-none rounded-xl border border-white/[0.07] bg-[#11161D] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/40"
                                                >
                                                    <option
                                                        value=""
                                                        disabled
                                                    >
                                                        Выберите категорию
                                                    </option>

                                                    <option value="Моды">
                                                        Моды
                                                    </option>

                                                    <option value="Скины">
                                                        Скины
                                                    </option>

                                                    <option value="Транспорт">
                                                        Транспорт
                                                    </option>

                                                    <option value="Оружие">
                                                        Оружие
                                                    </option>

                                                    <option value="Другое">
                                                        Другое
                                                    </option>
                                                </select>
                                            </div>

                                            {/* Цена */}
                                            <div>
                                                <label className="mb-2 block text-xs font-semibold text-slate-400">
                                                    Цена
                                                </label>

                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="1"
                                                        value={price}
                                                        onChange={(event) =>
                                                            setPrice(
                                                                event.target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="0"
                                                        className="w-full rounded-xl border border-white/[0.07] bg-[#11161D] px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/40"
                                                    />

                                                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-600">
                                                        ₽
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Описание */}
                                            <div>
                                                <label className="mb-2 block text-xs font-semibold text-slate-400">
                                                    Описание
                                                </label>

                                                <textarea
                                                    value={description}
                                                    onChange={(event) =>
                                                        setDescription(
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Расскажите о товаре..."
                                                    rows={7}
                                                    className="w-full resize-none rounded-xl border border-white/[0.07] bg-[#11161D] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/40"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Файл и публикация */}
                                    <div className="space-y-5">
                                        {/* Файл */}
                                        <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-6">
                                            <h2 className="text-base font-semibold text-white">
                                                Файл товара
                                            </h2>

                                            <p className="mt-1 text-xs text-slate-600">
                                                Загрузите архив с модом.
                                            </p>

                                            <label className="mt-5 block cursor-pointer">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={
                                                        handleFileChange
                                                    }
                                                />

                                                <div className="rounded-2xl border border-dashed border-white/[0.09] bg-white/[0.015] p-5 text-center transition hover:border-blue-500/30 hover:bg-blue-500/[0.02]">
                                                    {preview ? (
                                                        <div className="overflow-hidden rounded-xl">
                                                            <img
                                                                src={preview}
                                                                alt="Предпросмотр"
                                                                className="mx-auto max-h-44 w-full object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#11161D] text-xl text-slate-600">
                                                                ↑
                                                            </div>

                                                            <div className="mt-4 text-xs font-semibold text-slate-400">
                                                                {file
                                                                    ? file.name
                                                                    : "Загрузить файл"}
                                                            </div>

                                                            <div className="mt-1 text-[10px] text-slate-700">
                                                                Нажмите, чтобы
                                                                выбрать файл
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </label>
                                        </div>

                                        {/* Публикация */}
                                        <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-6">
                                            <h2 className="text-base font-semibold text-white">
                                                Публикация
                                            </h2>

                                            <p className="mt-1 text-xs leading-5 text-slate-600">
                                                После подключения базы здесь
                                                можно будет выбрать статус
                                                товара.
                                            </p>

                                            <div className="mt-5 rounded-xl border border-blue-500/[0.12] bg-blue-500/[0.025] p-4">
                                                <div className="flex gap-3">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/[0.08] text-xs text-blue-400">
                                                        i
                                                    </div>

                                                    <div>
                                                        <div className="text-xs font-semibold text-slate-300">
                                                            Готов к публикации
                                                        </div>

                                                        <div className="mt-1 text-[10px] leading-5 text-slate-600">
                                                            Заполните основную
                                                            информацию и
                                                            загрузите файл.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500"
                                            >
                                                Создать товар
                                            </button>

                                            <Link
                                                href="/seller/products"
                                                className="mt-2 flex w-full items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-xs font-semibold text-slate-500 transition hover:bg-white/[0.04] hover:text-white"
                                            >
                                                Отмена
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

function PanelLink({
    href,
    icon,
    title,
    active = false,
}: {
    href: string;
    icon: string;
    title: string;
    active?: boolean;
}) {
    return (
        <Link
            href={href}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                    : "text-slate-500 hover:bg-white/[0.035] hover:text-white"
            }`}
        >
            <span
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm ${
                    active
                        ? "bg-white/[0.12] text-white"
                        : "bg-white/[0.025] text-slate-600 group-hover:text-blue-400"
                }`}
            >
                {icon}
            </span>

            <span className="flex-1">
                {title}
            </span>

            {!active && (
                <span className="text-xs text-slate-800 transition group-hover:text-slate-500">
                    →
                </span>
            )}
        </Link>
    );
}