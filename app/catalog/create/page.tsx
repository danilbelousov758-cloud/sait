"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

type User = {
    id: number;
    username: string;
    avatar?: string | null;
    role?: string;
};

const categories = [
    "Скины",
    "Оружие",
    "Интерьеры",
    "Заменные территории",
    "Эффекты",
    "Звуки",
    "Дороги",
    "Карты",
    "Арзамас",
    "Казино",
    "Порт",
    "Инвентарь",
    "Скайбоксы",
    "Нефтевышки",
    "Прицелы",
    "Курсор мыши",
    "Фисты",
    "Таймциклы",
    "Пикапы",
    "АХК",
    "ASI плагины",
    "Деревья",
    "Графика",
    "Загрузочный экран",
    "Подсказки для гос. сотрудников",
];

const allowedRoles = [
    "SELLER",
    "ADMIN",
    "FOUNDER",
];

export default function CreateCatalogProductPage() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [loaded, setLoaded] = useState(false);

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadUser = () => {
            try {
                const savedUser =
                    localStorage.getItem("user");

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

        window.addEventListener(
            "storage",
            loadUser
        );

        window.addEventListener(
            "userUpdated",
            loadUser
        );

        return () => {
            window.removeEventListener(
                "storage",
                loadUser
            );

            window.removeEventListener(
                "userUpdated",
                loadUser
            );
        };
    }, []);

    const role =
        user?.role?.toUpperCase() || "USER";

    const hasAccess =
        allowedRoles.includes(role);

    const handleSubmit = (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");

        if (!name.trim()) {
            setError("Введите название товара.");
            return;
        }

        if (!category) {
            setError("Выберите категорию.");
            return;
        }

        if (!price.trim()) {
            setError("Укажите цену товара.");
            return;
        }

        const numericPrice =
            Number(price.replace(",", "."));

        if (
            Number.isNaN(numericPrice) ||
            numericPrice < 0
        ) {
            setError("Укажите корректную цену.");
            return;
        }

        setSaving(true);

        /*
         * Пока товар не отправляется на сервер.
         * Здесь позже подключим API создания товара,
         * загрузку файлов и Prisma.
         */

        setTimeout(() => {
            setSaving(false);

            alert(
                "Форма товара готова. Подключение сохранения сделаем следующим этапом."
            );
        }, 500);
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
                            Только продавец, администратор
                            или основатель могут добавлять
                            товары в каталог.
                        </p>

                        <Link
                            href="/catalog"
                            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                        >
                            Вернуться в каталог
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
                {/* Фон */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="absolute left-1/2 top-[-280px] h-[560px] w-[760px] -translate-x-1/2 rounded-full bg-blue-600/[0.055] blur-[160px]" />

                    <div className="absolute bottom-[-250px] right-[-150px] h-[450px] w-[450px] rounded-full bg-blue-500/[0.025] blur-[150px]" />
                </div>

                <div className="relative mx-auto w-full max-w-5xl">
                    {/* Верх */}
                    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-500">
                                MAZEPOV CONNEXTION
                            </div>

                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                Добавить товар
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Добавьте новый мод в каталог
                                магазина.
                            </p>
                        </div>

                        <Link
                            href="/catalog"
                            className="inline-flex w-fit items-center rounded-xl border border-white/[0.07] bg-[#0D1117] px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                        >
                            ← Назад в каталог
                        </Link>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {/* Основная информация */}
                        <section className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:p-7">
                            <div className="border-b border-white/[0.06] pb-5">
                                <h2 className="text-base font-semibold text-white">
                                    Основная информация
                                </h2>

                                <p className="mt-1 text-xs text-slate-600">
                                    Название, категория и описание
                                    товара.
                                </p>
                            </div>

                            <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                {/* Название */}
                                <div className="sm:col-span-2">
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
                                        placeholder="Например: GTA 5 Glock Pack"
                                        className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#11161D] px-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/[0.06]"
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
                                        className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#11161D] px-4 text-sm text-white outline-none transition focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/[0.06]"
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

                                {/* Цена */}
                                <div>
                                    <label className="mb-2 block text-xs font-semibold text-slate-400">
                                        Цена
                                    </label>

                                    <div className="relative">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={price}
                                            onChange={(event) =>
                                                setPrice(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="0"
                                            className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#11161D] px-4 pr-12 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/[0.06]"
                                        />

                                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-600">
                                            ₽
                                        </span>
                                    </div>
                                </div>

                                {/* Описание */}
                                <div className="sm:col-span-2">
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
                                        placeholder="Расскажите о моде..."
                                        rows={6}
                                        className="w-full resize-none rounded-xl border border-white/[0.07] bg-[#11161D] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/[0.06]"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Файлы */}
                        <section className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:p-7">
                            <div className="border-b border-white/[0.06] pb-5">
                                <h2 className="text-base font-semibold text-white">
                                    Файл товара
                                </h2>

                                <p className="mt-1 text-xs text-slate-600">
                                    Загрузите архив с модом.
                                </p>
                            </div>

                            <div className="mt-6">
                                <label className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.10] bg-[#11161D] px-5 text-center transition hover:border-blue-500/30 hover:bg-[#131922]">
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(event) =>
                                            setFile(
                                                event.target
                                                    .files?.[0] ||
                                                    null
                                            )
                                        }
                                    />

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#0D1117] text-xl text-slate-500">
                                        ↑
                                    </div>

                                    {file ? (
                                        <>
                                            <div className="mt-4 text-sm font-semibold text-white">
                                                {file.name}
                                            </div>

                                            <div className="mt-1 text-xs text-slate-600">
                                                Файл выбран
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="mt-4 text-sm font-semibold text-slate-300">
                                                Выберите файл
                                            </div>

                                            <div className="mt-1 text-xs text-slate-600">
                                                Нажмите для выбора
                                                файла с компьютера
                                            </div>
                                        </>
                                    )}
                                </label>
                            </div>
                        </section>

                        {/* Ошибка */}
                        {error && (
                            <div className="rounded-xl border border-red-500/15 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Кнопки */}
                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Link
                                href="/catalog"
                                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/[0.07] bg-[#0D1117] px-6 text-sm font-semibold text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                            >
                                Отмена
                            </Link>

                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-7 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving
                                    ? "Сохранение..."
                                    : "Добавить товар"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}