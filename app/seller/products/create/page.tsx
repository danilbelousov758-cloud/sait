"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Header from "@/components/Header";

type User = {
    id: number;
    username: string;
    avatar?: string | null;
    role?: string;
};

const categories = [
    "Скины / Государственные",
    "Скины / Мафии",
    "Скины / Банды",
    "Скины / Гражданские",
    "Оружие / Ганпак",
    "Оружие / Дигл",
    "Оружие / Юсп",
    "Оружие / Револьвер",
    "Оружие / АПС",
    "Оружие / СВД ПСО",
    "Оружие / СВД",
    "Оружие / M4A4",
    "Оружие / Абакан",
    "Оружие / Ас Вал",
    "Оружие / Гроза",
    "Оружие / Дробовик",
    "Дороги",
    "Карты",
    "Интерьеры",
    "Заменные территории",
    "Арзамас",
    "Батырево",
    "Южка",
    "Казино",
    "Порт",
    "Инвентарь",
    "Скайбоксы",
    "Эффекты / Кровь",
    "Эффекты / Эффект при попадании",
    "Эффекты / Эффект при убийстве и ноке",
    "Нефтевышки",
    "Прицелы",
    "Курсор мыши",
    "Фисты",
    "Звуки / Попадание / Пистолеты",
    "Звуки / Попадание / M4A4",
    "Звуки / Попадание / Абакан",
    "Звуки / Попадание / Гроза",
    "Звуки / Попадание / СВД",
    "Звуки / Попадание / СВД ПСО",
    "Таймциклы",
    "Пикапы",
    "АХК",
    "АСИ плагины",
    "Деревья",
    "Графика",
    "Загрузочный экран",
    "Подсказки для гос. сотрудников",
];

export default function CreateProductPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loaded, setLoaded] = useState(false);

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState("");

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

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

    const hasAccess = ["SELLER", "ADMIN", "FOUNDER"].includes(role);

    const firstLetter =
        user?.username?.trim().charAt(0).toUpperCase() || "?";

    const handlePreviewChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Можно загрузить только изображение.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Размер изображения не должен превышать 5 МБ.");
            return;
        }

        setFileName(file.name);

        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                setPreview(reader.result);
            }
        };

        reader.readAsDataURL(file);
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setMessage("");

        if (!name.trim()) {
            setMessage("Введите название товара.");
            return;
        }

        if (!category) {
            setMessage("Выберите категорию.");
            return;
        }

        if (!price || Number(price) < 0) {
            setMessage("Введите корректную цену.");
            return;
        }

        setSaving(true);

        try {
            /*
             * Здесь следующим этапом подключим API:
             *
             * POST /api/products
             *
             * Сейчас форма полностью готова визуально,
             * а сохранение подключим отдельно.
             */

            await new Promise((resolve) =>
                setTimeout(resolve, 700)
            );

            setMessage(
                "Товар заполнен. Подключение сохранения в базу данных сделаем следующим этапом."
            );
        } finally {
            setSaving(false);
        }
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
                            У вашего аккаунта нет прав для добавления товаров.
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

                {/* Фон */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden">

                    <div className="absolute left-1/2 top-[-300px] h-[550px] w-[750px] -translate-x-1/2 rounded-full bg-blue-600/[0.055] blur-[160px]" />

                    <div className="absolute bottom-[-250px] right-[-200px] h-[500px] w-[500px] rounded-full bg-blue-500/[0.025] blur-[160px]" />

                </div>

                <div className="relative flex min-h-[calc(100vh-95px)]">

                    {/* Боковое меню */}
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
                                            {role === "FOUNDER"
                                                ? "Основатель"
                                                : role === "ADMIN"
                                                ? "Администратор"
                                                : "Продавец"}
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

                                    <PanelLink
                                        href="/seller/statistics"
                                        icon="⌁"
                                        title="Статистика"
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
                                    Создание нового товара для каталога.
                                </p>

                            </div>

                        </header>

                        {/* Контент */}
                        <div className="mx-auto max-w-5xl p-5 sm:p-8">

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >

                                {/* Основная информация */}
                                <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-5 sm:p-6">

                                    <div className="mb-6">

                                        <h2 className="text-base font-semibold text-white">
                                            Основная информация
                                        </h2>

                                        <p className="mt-1 text-xs text-slate-600">
                                            Заполните основные данные товара.
                                        </p>

                                    </div>

                                    <div className="grid gap-5">

                                        {/* Название */}
                                        <div>

                                            <label className="mb-2 block text-xs font-medium text-slate-400">
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
                                                placeholder="Например: M4A4 Black Edition"
                                                className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#11161D] px-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/50 focus:bg-[#131920] focus:ring-4 focus:ring-blue-500/[0.07]"
                                            />

                                        </div>

                                        {/* Категория + цена */}
                                        <div className="grid gap-5 sm:grid-cols-2">

                                            <div>

                                                <label className="mb-2 block text-xs font-medium text-slate-400">
                                                    Категория
                                                </label>

                                                <select
                                                    value={category}
                                                    onChange={(event) =>
                                                        setCategory(
                                                            event.target.value
                                                        )
                                                    }
                                                    className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#11161D] px-4 text-sm text-white outline-none transition focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/[0.07]"
                                                >

                                                    <option
                                                        value=""
                                                        className="bg-[#11161D]"
                                                    >
                                                        Выберите категорию
                                                    </option>

                                                    {categories.map(
                                                        (item) => (
                                                            <option
                                                                key={item}
                                                                value={item}
                                                                className="bg-[#11161D]"
                                                            >
                                                                {item}
                                                            </option>
                                                        )
                                                    )}

                                                </select>

                                            </div>

                                            <div>

                                                <label className="mb-2 block text-xs font-medium text-slate-400">
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
                                                        className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#11161D] px-4 pr-12 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/50 focus:bg-[#131920] focus:ring-4 focus:ring-blue-500/[0.07]"
                                                    />

                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-600">
                                                        ₽
                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                        {/* Описание */}
                                        <div>

                                            <label className="mb-2 block text-xs font-medium text-slate-400">
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
                                                rows={6}
                                                className="w-full resize-none rounded-xl border border-white/[0.07] bg-[#11161D] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/50 focus:bg-[#131920] focus:ring-4 focus:ring-blue-500/[0.07]"
                                            />

                                            <div className="mt-2 text-[10px] text-slate-700">
                                                Хорошее описание поможет покупателям понять, что входит в товар.
                                            </div>

                                        </div>

                                    </div>

                                </div>

                                {/* Изображение */}
                                <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-5 sm:p-6">

                                    <div className="mb-6">

                                        <h2 className="text-base font-semibold text-white">
                                            Изображение товара
                                        </h2>

                                        <p className="mt-1 text-xs text-slate-600">
                                            Добавьте превью, которое будет отображаться в каталоге.
                                        </p>

                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-[180px_minmax(0,1fr)]">

                                        <div className="flex h-[180px] items-center justify-center overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11161D]">

                                            {preview ? (
                                                <img
                                                    src={preview}
                                                    alt="Превью товара"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-center">

                                                    <div className="text-3xl text-slate-700">
                                                        ▧
                                                    </div>

                                                    <div className="mt-2 text-[10px] text-slate-700">
                                                        Нет изображения
                                                    </div>

                                                </div>
                                            )}

                                        </div>

                                        <div>

                                            <label
                                                htmlFor="product-image"
                                                className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.09] bg-white/[0.015] px-5 text-center transition hover:border-blue-500/30 hover:bg-blue-500/[0.02]"
                                            >

                                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#11161D] text-lg text-slate-600">
                                                    ↑
                                                </div>

                                                <div className="mt-3 text-sm font-semibold text-slate-300">
                                                    Выберите изображение
                                                </div>

                                                <div className="mt-1 text-xs text-slate-700">
                                                    PNG, JPG или WEBP · до 5 МБ
                                                </div>

                                                {fileName && (
                                                    <div className="mt-3 rounded-lg bg-blue-500/[0.07] px-3 py-1.5 text-[10px] text-blue-400">
                                                        {fileName}
                                                    </div>
                                                )}

                                            </label>

                                            <input
                                                id="product-image"
                                                type="file"
                                                accept="image/png,image/jpeg,image/webp"
                                                onChange={handlePreviewChange}
                                                className="hidden"
                                            />

                                        </div>

                                    </div>

                                </div>

                                {/* Файлы товара */}
                                <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-5 sm:p-6">

                                    <div className="mb-6">

                                        <h2 className="text-base font-semibold text-white">
                                            Файлы товара
                                        </h2>

                                        <p className="mt-1 text-xs text-slate-600">
                                            Здесь позже можно будет загрузить архив с модом.
                                        </p>

                                    </div>

                                    <div className="rounded-xl border border-dashed border-white/[0.08] bg-white/[0.015] p-8 text-center">

                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#11161D] text-lg text-slate-600">
                                            ↑
                                        </div>

                                        <div className="mt-3 text-sm font-semibold text-slate-400">
                                            Загрузка файлов
                                        </div>

                                        <p className="mt-1 text-xs text-slate-700">
                                            Подключим загрузку ZIP/RAR и хранение файлов следующим этапом.
                                        </p>

                                    </div>

                                </div>

                                {/* Сообщение */}
                                {message && (
                                    <div className="rounded-xl border border-blue-500/[0.12] bg-blue-500/[0.025] px-4 py-3 text-xs leading-5 text-blue-400">
                                        {message}
                                    </div>
                                )}

                                {/* Кнопки */}
                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                    <Link
                                        href="/seller/products"
                                        className="inline-flex h-12 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] px-5 text-sm font-semibold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                                    >
                                        Отмена
                                    </Link>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="h-12 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {saving
                                            ? "Сохраняем..."
                                            : "Создать товар"}
                                    </button>

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