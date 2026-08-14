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

    const [dffFile, setDffFile] = useState<File | null>(null);
    const [txdFile, setTxdFile] = useState<File | null>(null);

    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [pinned, setPinned] = useState(false);

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

    useEffect(() => {
        return () => {
            imagePreviews.forEach((preview) => {
                URL.revokeObjectURL(preview);
            });
        };
    }, [imagePreviews]);

    const role =
        user?.role?.toUpperCase() || "USER";

    const hasAccess =
        allowedRoles.includes(role);

    const handleImagesChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFiles = Array.from(
            event.target.files || []
        );

        if (selectedFiles.length === 0) {
            return;
        }

        const imageFiles = selectedFiles.filter((file) =>
            file.type.startsWith("image/")
        );

        if (imageFiles.length === 0) {
            setError(
                "Можно загружать только изображения."
            );
            return;
        }

        const oldPreviews = imagePreviews;

        oldPreviews.forEach((preview) => {
            URL.revokeObjectURL(preview);
        });

        setImages(imageFiles);

        const previews = imageFiles.map((file) =>
            URL.createObjectURL(file)
        );

        setImagePreviews(previews);
        setError("");
    };

    const removeImage = (index: number) => {
        const preview = imagePreviews[index];

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setImages((current) =>
            current.filter((_, i) => i !== index)
        );

        setImagePreviews((current) =>
            current.filter((_, i) => i !== index)
        );
    };

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

        if (!dffFile) {
            setError("Выберите DFF-файл.");
            return;
        }

        if (!txdFile) {
            setError("Выберите TXD-файл.");
            return;
        }

        if (images.length === 0) {
            setError(
                "Добавьте хотя бы одну картинку товара."
            );
            return;
        }

        setSaving(true);

        /*
         * На следующем этапе здесь подключим API:
         *
         * - создание товара в Prisma;
         * - загрузку DFF;
         * - загрузку TXD;
         * - загрузку изображений;
         * - сохранение pinned;
         * - сохранение владельца товара;
         * - публикацию товара.
         */

        setTimeout(() => {
            setSaving(false);

            alert(
                "Форма товара готова. Сохранение на сервер подключим следующим этапом."
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
                                    Название, категория, цена и
                                    описание товара.
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
                                        placeholder="Например: Glock Pack"
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

                        {/* Закрепление */}
                        <section className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:p-7">
                            <div className="flex items-center justify-between gap-5">
                                <div>
                                    <h2 className="text-base font-semibold text-white">
                                        Закрепить товар
                                    </h2>

                                    <p className="mt-1 max-w-xl text-xs leading-5 text-slate-600">
                                        Закрепленный товар будет
                                        отображаться выше обычных
                                        товаров в каталоге.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setPinned(
                                            (current) =>
                                                !current
                                        )
                                    }
                                    className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                                        pinned
                                            ? "bg-blue-600"
                                            : "bg-[#202630]"
                                    }`}
                                >
                                    <span
                                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                                            pinned
                                                ? "translate-x-6"
                                                : "translate-x-1"
                                        }`}
                                    />
                                </button>
                            </div>

                            {pinned && (
                                <div className="mt-4 rounded-xl border border-blue-500/15 bg-blue-500/[0.05] px-4 py-3 text-xs text-blue-300">
                                    Товар будет закреплен в
                                    каталоге.
                                </div>
                            )}
                        </section>

                        {/* Файлы */}
                        <section className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:p-7">
                            <div className="border-b border-white/[0.06] pb-5">
                                <h2 className="text-base font-semibold text-white">
                                    Файлы мода
                                </h2>

                                <p className="mt-1 text-xs text-slate-600">
                                    Загрузите DFF и TXD файлы
                                    вашего мода.
                                </p>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                {/* DFF */}
                                <label className="group flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.10] bg-[#11161D] px-5 text-center transition hover:border-blue-500/30 hover:bg-[#131922]">
                                    <input
                                        type="file"
                                        accept=".dff"
                                        className="hidden"
                                        onChange={(event) =>
                                            setDffFile(
                                                event.target
                                                    .files?.[0] ||
                                                    null
                                            )
                                        }
                                    />

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#0D1117] text-sm font-bold text-blue-400">
                                        DFF
                                    </div>

                                    <div className="mt-4 text-sm font-semibold text-white">
                                        {dffFile
                                            ? dffFile.name
                                            : "Выберите DFF файл"}
                                    </div>

                                    <div className="mt-1 text-xs text-slate-600">
                                        {dffFile
                                            ? "Файл выбран"
                                            : "Формат .dff"}
                                    </div>
                                </label>

                                {/* TXD */}
                                <label className="group flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.10] bg-[#11161D] px-5 text-center transition hover:border-blue-500/30 hover:bg-[#131922]">
                                    <input
                                        type="file"
                                        accept=".txd"
                                        className="hidden"
                                        onChange={(event) =>
                                            setTxdFile(
                                                event.target
                                                    .files?.[0] ||
                                                    null
                                            )
                                        }
                                    />

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#0D1117] text-sm font-bold text-purple-400">
                                        TXD
                                    </div>

                                    <div className="mt-4 text-sm font-semibold text-white">
                                        {txdFile
                                            ? txdFile.name
                                            : "Выберите TXD файл"}
                                    </div>

                                    <div className="mt-1 text-xs text-slate-600">
                                        {txdFile
                                            ? "Файл выбран"
                                            : "Формат .txd"}
                                    </div>
                                </label>
                            </div>
                        </section>

                        {/* Изображения */}
                        <section className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:p-7">
                            <div className="border-b border-white/[0.06] pb-5">
                                <h2 className="text-base font-semibold text-white">
                                    Изображения товара
                                </h2>

                                <p className="mt-1 text-xs text-slate-600">
                                    Добавьте изображения, которые
                                    будут отображаться на странице
                                    товара.
                                </p>
                            </div>

                            <div className="mt-6">
                                <label className="flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.10] bg-[#11161D] px-5 text-center transition hover:border-blue-500/30 hover:bg-[#131922]">
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        multiple
                                        className="hidden"
                                        onChange={handleImagesChange}
                                    />

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#0D1117] text-xl text-slate-500">
                                        ▧
                                    </div>

                                    <div className="mt-4 text-sm font-semibold text-white">
                                        Добавить изображения
                                    </div>

                                    <div className="mt-1 text-xs text-slate-600">
                                        PNG, JPG или WEBP
                                    </div>
                                </label>
                            </div>

                            {imagePreviews.length > 0 && (
                                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                    {imagePreviews.map(
                                        (
                                            preview,
                                            index
                                        ) => (
                                            <div
                                                key={preview}
                                                className="group relative aspect-video overflow-hidden rounded-xl border border-white/[0.07] bg-[#11161D]"
                                            >
                                                <img
                                                    src={preview}
                                                    alt={`Изображение ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeImage(
                                                            index
                                                        )
                                                    }
                                                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/70 text-xs text-white opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-red-500"
                                                >
                                                    ×
                                                </button>

                                                {index ===
                                                    0 && (
                                                    <div className="absolute bottom-2 left-2 rounded-md bg-blue-600 px-2 py-1 text-[9px] font-semibold text-white">
                                                        Главное
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                            {images.length > 0 && (
                                <div className="mt-4 text-xs text-slate-600">
                                    Выбрано изображений:{" "}
                                    {images.length}
                                </div>
                            )}
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