"use client";

import Link from "next/link";
import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useMemo,
    useState,
} from "react";

import Header from "@/components/Header";

type User = {
    id: number;
    username: string;
    avatar?: string | null;
    role?: string;
};

type CatalogItem = {
    name: string;
    children?: CatalogItem[];
};

const expandableCategories: CatalogItem[] = [
    {
        name: "Скины",
        children: [
            { name: "Государственные" },
            { name: "Мафии" },
            { name: "Банды" },
            { name: "Гражданские" },
        ],
    },

    {
        name: "Оружие",
        children: [
            { name: "Ганпак" },
            { name: "Дигл" },
            { name: "ЮСП" },
            { name: "Револьвер" },
            { name: "АПС" },
            { name: "СВД ПСО" },
            { name: "СВД" },
            { name: "M4A4" },
            { name: "Абакан" },
            { name: "АС ВАЛ" },
            { name: "Гроза" },
            { name: "Дробовик" },
        ],
    },

    {
        name: "Интерьеры",
        children: [
            { name: "24/7" },
            { name: "ДПС / ППС / ФСБ" },
            { name: "Оружейка" },
            { name: "Ашан" },
            { name: "Аптека" },
            { name: "ПК клуб" },
            { name: "Особа" },
            { name: "Банк" },
        ],
    },

    {
        name: "Заменные территории",
        children: [
            { name: "24/7" },
            { name: "ЦР" },
            { name: "ФСИН" },
            { name: "Арзамас" },
            { name: "Батырево" },
            { name: "Южный" },
            { name: "Бизвар локации" },
            { name: "Вокзалы" },
        ],
    },

    {
        name: "Эффекты",
        children: [
            { name: "Кровь" },
            { name: "Эффект при попадании" },
            {
                name: "Эффект при убийстве и ноке",
                children: [
                    {
                        name: "ld_bum",
                    },
                ],
            },
        ],
    },

    {
        name: "Звуки",
        children: [
            {
                name: "Попадание",
                children: [
                    {
                        name: "Пистолеты",
                        children: [
                            { name: "M4A4" },
                            { name: "Абакан" },
                            { name: "Гроза" },
                            { name: "СВД" },
                        ],
                    },
                ],
            },
        ],
    },
];

const simpleCategories = [
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
    const [user, setUser] = useState<User | null>(null);

    const [loaded, setLoaded] = useState(false);

    const [openCategories, setOpenCategories] = useState<string[]>([
        "Скины",
    ]);

    /*
     * Здесь хранится ТОЛЬКО конечный выбранный путь.
     *
     * Например:
     *
     * ["Скины", "Банды"]
     *
     * или:
     *
     * ["Звуки", "Попадание", "Пистолеты", "M4A4"]
     */
    const [categoryPath, setCategoryPath] = useState<string[]>([
        "Скины",
        "Государственные",
    ]);

    const [name, setName] = useState("");

    const [price, setPrice] = useState("");

    const [description, setDescription] = useState("");

    const [dffFile, setDffFile] = useState<File | null>(null);

    const [txdFile, setTxdFile] = useState<File | null>(null);

    const [images, setImages] = useState<File[]>([]);

    const [previewImages, setPreviewImages] = useState<string[]>([]);

    const [pinned, setPinned] = useState(false);

    const [error, setError] = useState("");

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadUser = () => {
            try {
                const saved = localStorage.getItem("user");

                if (saved) {
                    setUser(JSON.parse(saved));
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            } finally {
                setLoaded(true);
            }
        };

        loadUser();

        window.addEventListener("userUpdated", loadUser);

        return () => {
            window.removeEventListener("userUpdated", loadUser);
        };
    }, []);

    const role =
        user?.role?.toUpperCase() || "USER";

    const hasAccess =
        allowedRoles.includes(role);

    /*
     * Реальный путь, который отправляется в API.
     *
     * Например:
     * Скины/Банды
     */
    const categorySavePath =
        categoryPath.join("/");

    /*
     * Красивый путь для интерфейса.
     */
    const categoryText =
        categoryPath.join(" / ");

    /*
     * Конечная выбранная категория.
     */
    const selectedCategory =
        categoryPath[categoryPath.length - 1];

    /*
     * Проверяем, выбрана ли вообще конечная категория.
     */
    const hasSelectedCategory =
        categoryPath.length > 0;

    /*
     * Открытие / закрытие родительской категории.
     *
     * ВАЖНО:
     * эта функция НЕ меняет categoryPath.
     *
     * Поэтому при нажатии "Скины" путь товара
     * не становится просто "Скины".
     */
    function toggleCategory(name: string) {
        setOpenCategories((current) => {
            if (current.includes(name)) {
                return current.filter(
                    (item) => item !== name
                );
            }

            return [
                ...current,
                name,
            ];
        });
    }

    /*
     * Выбор ТОЛЬКО конечной категории.
     *
     * Например:
     *
     * selectCategory("Банды", ["Скины"])
     *
     * даст:
     *
     * ["Скины", "Банды"]
     */
    function selectCategory(
        name: string,
        parents: string[]
    ) {
        setCategoryPath([
            ...parents,
            name,
        ]);

        setError("");
    }

    /*
     * Простые категории являются конечными,
     * поэтому их можно выбирать напрямую.
     */
    function selectSimpleCategory(name: string) {
        setCategoryPath([
            name,
        ]);

        setError("");
    }

    /*
     * Сброс выбора.
     *
     * После сброса пользователь снова увидит
     * первую категорию, но товар нельзя будет
     * создать, пока не выбрана конечная категория.
     */
    function clearCategory() {
        setCategoryPath([]);

        setError("");
    }

    function changeImages(
        e: ChangeEvent<HTMLInputElement>
    ) {
        const files =
            Array.from(
                e.target.files || []
            );

        const onlyImages =
            files.filter((file) =>
                file.type.startsWith("image/")
            );

        /*
         * Ограничиваем количество изображений.
         */
        const limitedImages =
            onlyImages.slice(0, 8);

        setImages(limitedImages);

        /*
         * Освобождаем старые Object URL.
         */
        previewImages.forEach((url) => {
            URL.revokeObjectURL(url);
        });

        const urls =
            limitedImages.map((file) =>
                URL.createObjectURL(file)
            );

        setPreviewImages(urls);
    }

    async function handleSubmit(
        e: FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setError("");

        if (!user) {
            setError(
                "Пользователь не найден"
            );

            return;
        }

        /*
         * Главное ограничение:
         *
         * нельзя создать товар,
         * если выбран только родитель.
         *
         * Для Скины:
         * ❌ Скины
         *
         * Для Оружие:
         * ❌ Оружие
         *
         * Для Банды:
         * ✅ Скины/Банды
         */
        if (!hasSelectedCategory) {
            setError(
                "Выберите конечную категорию товара"
            );

            return;
        }

        /*
         * Дополнительная проверка:
         * путь должен содержать минимум 2 элемента
         * для древовидной категории.
         *
         * Простые категории имеют один элемент
         * и разрешены.
         */
        const rootCategory =
            categoryPath[0];

        const rootObject =
            expandableCategories.find(
                (item) =>
                    item.name === rootCategory
            );

        if (
            rootObject &&
            categoryPath.length < 2
        ) {
            setError(
                "Нельзя выбрать основной раздел. Выберите вложенную категорию."
            );

            return;
        }

        if (!name.trim()) {
            setError(
                "Введите название товара"
            );

            return;
        }

        if (!dffFile) {
            setError(
                "Добавьте DFF файл"
            );

            return;
        }

        if (!txdFile) {
            setError(
                "Добавьте TXD файл"
            );

            return;
        }

        const numberPrice =
            price.trim()
                ? Number(
                      price
                          .replace(",", ".")
                          .trim()
                  )
                : 0;

        if (
            Number.isNaN(numberPrice) ||
            numberPrice < 0
        ) {
            setError(
                "Некорректная цена"
            );

            return;
        }

        setSaving(true);

        try {
            const formData =
                new FormData();

            formData.append(
                "name",
                name.trim()
            );

            /*
             * В базу отправляется полный путь.
             *
             * Например:
             *
             * Скины/Банды
             *
             * Оружие/Ганпак
             *
             * Звуки/Попадание/Пистолеты/M4A4
             */
            formData.append(
                "category",
                categorySavePath
            );

            formData.append(
                "path",
                categorySavePath
            );

            formData.append(
                "price",
                String(numberPrice)
            );

            formData.append(
                "description",
                description.trim()
            );

            formData.append(
                "pinned",
                String(pinned)
            );

            formData.append(
                "author_id",
                String(user.id)
            );

            formData.append(
                "dff",
                dffFile
            );

            formData.append(
                "txd",
                txdFile
            );

            images.forEach((image) => {
                formData.append(
                    "images",
                    image
                );
            });

            const response =
                await fetch(
                    "/api/products/create",
                    {
                        method: "POST",
                        body: formData,
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Ошибка создания товара"
                );
            }

            alert(
                "Товар успешно создан"
            );

            window.location.href =
                "/catalog";
        } catch (error) {
            if (error instanceof Error) {
                setError(
                    error.message
                );
            } else {
                setError(
                    "Ошибка сервера"
                );
            }
        } finally {
            setSaving(false);
        }
    }

    if (!loaded) {
        return null;
    }

    if (!user || !hasAccess) {
        return (
            <>
                <Header />

                <main className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-[#080B10]
                    px-4
                    text-white
                ">
                    <div className="
                        w-full
                        max-w-md
                        rounded-2xl
                        border
                        border-white/[0.07]
                        bg-[#0D1117]
                        p-8
                        text-center
                    ">
                        <div className="
                            mx-auto
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-2xl
                            bg-red-500/10
                            text-2xl
                            text-red-400
                        ">
                            !
                        </div>

                        <h1 className="
                            mt-5
                            text-2xl
                            font-bold
                        ">
                            Доступ запрещён
                        </h1>

                        <p className="
                            mt-2
                            text-sm
                            text-slate-500
                        ">
                            У вас нет прав для создания
                            товаров в каталоге.
                        </p>

                        <Link
                            href="/catalog"
                            className="
                                mt-6
                                inline-flex
                                rounded-xl
                                bg-blue-600
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                transition
                                hover:bg-blue-500
                            "
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

            <main className="
                min-h-screen
                bg-[#080B10]
                px-4
                pb-20
                pt-[120px]
                text-white
            ">
                <div className="
                    mx-auto
                    max-w-7xl
                ">
                    {/* HEADER */}
                    <div className="
                        mb-8
                        flex
                        flex-col
                        gap-5
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    ">
                        <div>
                            <div className="
                                inline-flex
                                items-center
                                rounded-lg
                                border
                                border-blue-500/10
                                bg-blue-500/[0.06]
                                px-3
                                py-1.5
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.18em]
                                text-blue-400
                            ">
                                MAZEPOV CONNEXTION
                            </div>

                            <h1 className="
                                mt-4
                                text-3xl
                                font-bold
                                tracking-tight
                            ">
                                Создание товара
                            </h1>

                            <p className="
                                mt-2
                                text-sm
                                text-slate-500
                            ">
                                Загрузите мод и укажите,
                                где он должен находиться
                                в каталоге.
                            </p>
                        </div>

                        <Link
                            href="/catalog"
                            className="
                                inline-flex
                                w-fit
                                items-center
                                rounded-xl
                                border
                                border-white/[0.08]
                                bg-white/[0.02]
                                px-4
                                py-2.5
                                text-sm
                                font-medium
                                text-slate-300
                                transition
                                hover:bg-white/[0.05]
                                hover:text-white
                            "
                        >
                            ← Назад
                        </Link>
                    </div>

                    <div className="
                        grid
                        gap-5
                        lg:grid-cols-[300px_minmax(0,1fr)]
                    ">
                        {/* SIDEBAR */}
                        <aside className="
                            h-fit
                            rounded-2xl
                            border
                            border-white/[0.07]
                            bg-[#0D1117]
                            p-3
                            shadow-[0_20px_60px_rgba(0,0,0,0.18)]
                            lg:sticky
                            lg:top-28
                        ">
                            <div className="
                                px-3
                                pb-2
                                pt-1
                            ">
                                <div className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.18em]
                                    text-slate-600
                                ">
                                    Категория
                                </div>

                                <p className="
                                    mt-1.5
                                    text-xs
                                    leading-5
                                    text-slate-600
                                ">
                                    Выберите конечную
                                    категорию мода
                                </p>
                            </div>

                            {/* ТЕКУЩИЙ ПУТЬ */}
                            <div className="
                                mb-3
                                rounded-xl
                                border
                                border-blue-500/10
                                bg-blue-500/[0.045]
                                p-3
                            ">
                                <div className="
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.16em]
                                    text-blue-500
                                ">
                                    Выбранный путь
                                </div>

                                {hasSelectedCategory ? (
                                    <div className="
                                        mt-2
                                        flex
                                        items-start
                                        justify-between
                                        gap-2
                                    ">
                                        <div className="
                                            min-w-0
                                            text-xs
                                            font-medium
                                            leading-5
                                            text-white
                                            break-words
                                        ">
                                            {categoryText}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={
                                                clearCategory
                                            }
                                            className="
                                                shrink-0
                                                rounded-lg
                                                px-2
                                                py-1
                                                text-[10px]
                                                text-slate-500
                                                transition
                                                hover:bg-white/[0.05]
                                                hover:text-white
                                            "
                                        >
                                            Сбросить
                                        </button>
                                    </div>
                                ) : (
                                    <div className="
                                        mt-2
                                        text-xs
                                        text-slate-600
                                    ">
                                        Категория не выбрана
                                    </div>
                                )}
                            </div>

                            {/* ДЕРЕВО */}
                            <div className="
                                space-y-0.5
                            ">
                                {expandableCategories.map(
                                    (item) => (
                                        <CategoryTree
                                            key={item.name}
                                            item={item}
                                            parents={[]}
                                            path={
                                                categoryPath
                                            }
                                            open={
                                                openCategories
                                            }
                                            select={
                                                selectCategory
                                            }
                                            toggle={
                                                toggleCategory
                                            }
                                        />
                                    )
                                )}
                            </div>

                            <div className="
                                my-4
                                h-px
                                bg-white/[0.06]
                            " />

                            {/* ПРОСТЫЕ КАТЕГОРИИ */}
                            <div className="
                                px-3
                                pb-2
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.18em]
                                text-slate-600
                            ">
                                Дополнительные
                            </div>

                            <div className="
                                space-y-0.5
                            ">
                                {simpleCategories.map(
                                    (item) => {
                                        const active =
                                            categoryPath.length ===
                                                1 &&
                                            categoryPath[0] ===
                                                item;

                                        return (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() =>
                                                    selectSimpleCategory(
                                                        item
                                                    )
                                                }
                                                className={`
                                                    group
                                                    flex
                                                    w-full
                                                    items-center
                                                    rounded-xl
                                                    px-3
                                                    py-2.5
                                                    text-left
                                                    text-sm
                                                    transition

                                                    ${
                                                        active
                                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                                                            : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                                                    }
                                                `}
                                            >
                                                <span className="
                                                    mr-2
                                                    h-1.5
                                                    w-1.5
                                                    shrink-0
                                                    rounded-full
                                                    bg-slate-700
                                                    transition
                                                    group-hover:bg-blue-400
                                                " />

                                                {item}
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </aside>

                        {/* FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            {/* CATEGORY INFO */}
                            <section className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-white/[0.07]
                                bg-[#0D1117]
                                shadow-[0_20px_60px_rgba(0,0,0,0.18)]
                            ">
                                <div className="
                                    border-b
                                    border-white/[0.06]
                                    px-6
                                    py-5
                                ">
                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                    ">
                                        <div className="
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-blue-500/10
                                            text-blue-400
                                        ">
                                            #
                                        </div>

                                        <div>
                                            <h2 className="
                                                text-sm
                                                font-semibold
                                            ">
                                                Категория товара
                                            </h2>

                                            <p className="
                                                mt-0.5
                                                text-xs
                                                text-slate-600
                                            ">
                                                Место мода в каталоге
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="
                                    p-6
                                ">
                                    <div className="
                                        rounded-xl
                                        border
                                        border-blue-500/15
                                        bg-blue-500/[0.045]
                                        p-4
                                    ">
                                        <div className="
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.16em]
                                            text-blue-500
                                        ">
                                            Путь сохранения
                                        </div>

                                        <div className="
                                            mt-2
                                            text-sm
                                            font-semibold
                                            text-white
                                        ">
                                            {hasSelectedCategory
                                                ? categoryText
                                                : "Категория не выбрана"}
                                        </div>

                                        {hasSelectedCategory && (
                                            <div className="
                                                mt-2
                                                break-all
                                                font-mono
                                                text-[11px]
                                                text-slate-600
                                            ">
                                                {categorySavePath}
                                            </div>
                                        )}
                                    </div>

                                    <input
                                        value={name}
                                        onChange={(e) =>
                                            setName(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Название товара"
                                        className="
                                            mt-5
                                            h-12
                                            w-full
                                            rounded-xl
                                            border
                                            border-white/[0.06]
                                            bg-[#11161D]
                                            px-4
                                            text-sm
                                            text-white
                                            outline-none
                                            transition
                                            placeholder:text-slate-700
                                            focus:border-blue-500/40
                                            focus:bg-[#131922]
                                            focus:ring-4
                                            focus:ring-blue-500/[0.05]
                                        "
                                    />

                                    <input
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(
                                                e.target.value.replace(
                                                    /[^0-9.,]/g,
                                                    ""
                                                )
                                            )
                                        }
                                        placeholder="Цена ₽"
                                        inputMode="decimal"
                                        className="
                                            mt-3
                                            h-12
                                            w-full
                                            rounded-xl
                                            border
                                            border-white/[0.06]
                                            bg-[#11161D]
                                            px-4
                                            text-sm
                                            text-white
                                            outline-none
                                            transition
                                            placeholder:text-slate-700
                                            focus:border-blue-500/40
                                            focus:bg-[#131922]
                                            focus:ring-4
                                            focus:ring-blue-500/[0.05]
                                        "
                                    />

                                    <textarea
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Описание товара"
                                        rows={5}
                                        className="
                                            mt-3
                                            w-full
                                            resize-none
                                            rounded-xl
                                            border
                                            border-white/[0.06]
                                            bg-[#11161D]
                                            p-4
                                            text-sm
                                            leading-6
                                            text-white
                                            outline-none
                                            transition
                                            placeholder:text-slate-700
                                            focus:border-blue-500/40
                                            focus:bg-[#131922]
                                            focus:ring-4
                                            focus:ring-blue-500/[0.05]
                                        "
                                    />
                                </div>
                            </section>

                            {/* PINNED */}
                            <section className="
                                rounded-2xl
                                border
                                border-white/[0.07]
                                bg-[#0D1117]
                                p-6
                            ">
                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-5
                                ">
                                    <div>
                                        <h2 className="
                                            text-sm
                                            font-semibold
                                        ">
                                            Закрепить товар
                                        </h2>

                                        <p className="
                                            mt-1
                                            text-xs
                                            leading-5
                                            text-slate-600
                                        ">
                                            Закреплённые товары
                                            отображаются выше
                                            остальных.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPinned(
                                                !pinned
                                            )
                                        }
                                        aria-label="Закрепить товар"
                                        className={`
                                            relative
                                            h-7
                                            w-12
                                            shrink-0
                                            rounded-full
                                            transition
                                            ${
                                                pinned
                                                    ? "bg-blue-600"
                                                    : "bg-white/10"
                                            }
                                        `}
                                    >
                                        <div
                                            className={`
                                                absolute
                                                top-1
                                                h-5
                                                w-5
                                                rounded-full
                                                bg-white
                                                shadow
                                                transition
                                                ${
                                                    pinned
                                                        ? "left-6"
                                                        : "left-1"
                                                }
                                            `}
                                        />
                                    </button>
                                </div>
                            </section>

                            {/* FILES */}
                            <section className="
                                rounded-2xl
                                border
                                border-white/[0.07]
                                bg-[#0D1117]
                                p-6
                            ">
                                <div>
                                    <h2 className="
                                        text-sm
                                        font-semibold
                                    ">
                                        Файлы мода
                                    </h2>

                                    <p className="
                                        mt-1
                                        text-xs
                                        text-slate-600
                                    ">
                                        Добавьте основные файлы
                                        модификации.
                                    </p>
                                </div>

                                <div className="
                                    mt-5
                                    grid
                                    gap-4
                                    sm:grid-cols-2
                                ">
                                    <UploadBox
                                        title="DFF файл"
                                        subtitle="Модель GTA"
                                        accept=".dff"
                                        file={dffFile}
                                        setFile={
                                            setDffFile
                                        }
                                    />

                                    <UploadBox
                                        title="TXD файл"
                                        subtitle="Текстуры GTA"
                                        accept=".txd"
                                        file={txdFile}
                                        setFile={
                                            setTxdFile
                                        }
                                    />
                                </div>
                            </section>

                            {/* IMAGES */}
                            <section className="
                                rounded-2xl
                                border
                                border-white/[0.07]
                                bg-[#0D1117]
                                p-6
                            ">
                                <div className="
                                    flex
                                    items-end
                                    justify-between
                                    gap-4
                                ">
                                    <div>
                                        <h2 className="
                                            text-sm
                                            font-semibold
                                        ">
                                            Изображения
                                        </h2>

                                        <p className="
                                            mt-1
                                            text-xs
                                            text-slate-600
                                        ">
                                            До 8 изображений
                                            для карточки товара.
                                        </p>
                                    </div>

                                    <div className="
                                        rounded-lg
                                        bg-white/[0.03]
                                        px-2.5
                                        py-1
                                        text-[10px]
                                        text-slate-600
                                    ">
                                        {images.length}/8
                                    </div>
                                </div>

                                <label className="
                                    mt-5
                                    block
                                    cursor-pointer
                                    rounded-xl
                                    border
                                    border-dashed
                                    border-white/[0.09]
                                    bg-[#11161D]
                                    p-10
                                    text-center
                                    transition
                                    hover:border-blue-500/30
                                    hover:bg-[#131922]
                                ">
                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={
                                            changeImages
                                        }
                                    />

                                    <div className="
                                        mx-auto
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-500/10
                                        text-xl
                                        text-blue-400
                                    ">
                                        +
                                    </div>

                                    <div className="
                                        mt-4
                                        text-sm
                                        font-medium
                                        text-slate-300
                                    ">
                                        Загрузить изображения
                                    </div>

                                    <div className="
                                        mt-1
                                        text-xs
                                        text-slate-600
                                    ">
                                        PNG, JPG или WEBP
                                    </div>
                                </label>

                                {previewImages.length >
                                    0 && (
                                    <div className="
                                        mt-5
                                        grid
                                        grid-cols-2
                                        gap-3
                                        md:grid-cols-3
                                    ">
                                        {previewImages.map(
                                            (
                                                image,
                                                index
                                            ) => (
                                                <div
                                                    key={
                                                        image
                                                    }
                                                    className="
                                                        group
                                                        relative
                                                        overflow-hidden
                                                        rounded-xl
                                                        border
                                                        border-white/[0.07]
                                                        bg-[#11161D]
                                                    "
                                                >
                                                    <img
                                                        src={
                                                            image
                                                        }
                                                        alt={`preview-${index}`}
                                                        className="
                                                            aspect-video
                                                            w-full
                                                            object-cover
                                                        "
                                                    />

                                                    <div className="
                                                        absolute
                                                        inset-x-0
                                                        bottom-0
                                                        bg-black/60
                                                        px-2
                                                        py-1.5
                                                        text-[10px]
                                                        text-slate-300
                                                    ">
                                                        Изображение{" "}
                                                        {index +
                                                            1}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </section>

                            {/* ERROR */}
                            {error && (
                                <div className="
                                    rounded-xl
                                    border
                                    border-red-500/20
                                    bg-red-500/[0.08]
                                    p-4
                                    text-sm
                                    leading-6
                                    text-red-400
                                ">
                                    <div className="
                                        flex
                                        gap-3
                                    ">
                                        <span className="
                                            font-bold
                                        ">
                                            !
                                        </span>

                                        <span>
                                            {error}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                disabled={saving}
                                className="
                                    h-13
                                    w-full
                                    rounded-xl
                                    bg-blue-600
                                    px-5
                                    font-semibold
                                    text-white
                                    shadow-lg
                                    shadow-blue-600/10
                                    transition
                                    hover:bg-blue-500
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                {saving
                                    ? "Загрузка в S3..."
                                    : "Создать товар"}
                            </button>

                            <p className="
                                text-center
                                text-[11px]
                                leading-5
                                text-slate-700
                            ">
                                После создания товар появится
                                в выбранном разделе каталога.
                            </p>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}

type CategoryTreeProps = {
    item: CatalogItem;
    parents: string[];
    path: string[];
    open: string[];
    select: (
        name: string,
        parents: string[]
    ) => void;
    toggle: (
        name: string
    ) => void;
};

function CategoryTree({
    item,
    parents,
    path,
    open,
    select,
    toggle,
}: CategoryTreeProps) {
    const hasChildren =
        Boolean(
            item.children &&
                item.children.length > 0
        );

    const isOpen =
        open.includes(item.name);

    /*
     * Категория считается выбранной ТОЛЬКО если
     * она является последним элементом пути.
     *
     * Например:
     *
     * Скины / Банды
     *
     * "Скины" НЕ selected.
     * "Банды" selected.
     */
    const selected =
        path[path.length - 1] ===
            item.name &&
        !hasChildren;

    /*
     * Родительская категория.
     *
     * Например:
     * Скины
     * Оружие
     * Эффекты
     */
    const parent =
        hasChildren;

    function handleClick() {
        /*
         * ЕСЛИ У КАТЕГОРИИ ЕСТЬ CHILDREN:
         *
         * НИКОГДА НЕ ВЫБИРАЕМ ЕЁ.
         *
         * Только раскрываем / сворачиваем.
         */
        if (hasChildren) {
            toggle(item.name);
            return;
        }

        /*
         * Если children нет — это конечная
         * категория, которую разрешено выбрать.
         */
        select(
            item.name,
            parents
        );
    }

    return (
        <div>
            <button
                type="button"
                onClick={handleClick}
                className={`
                    group
                    mb-1
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    px-3
                    py-2.5
                    text-left
                    transition

                    ${
                        selected
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                            : parent
                            ? "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                            : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                    }
                `}
            >
                <span className="
                    flex
                    min-w-0
                    items-center
                    gap-2
                ">
                    {/* Индикатор типа */}
                    <span
                        className={`
                            h-1.5
                            w-1.5
                            shrink-0
                            rounded-full
                            transition

                            ${
                                selected
                                    ? "bg-white"
                                    : parent
                                    ? "bg-blue-500/50"
                                    : "bg-slate-700 group-hover:bg-blue-400"
                            }
                        `}
                    />

                    <span className="
                        truncate
                    ">
                        {item.name}
                    </span>
                </span>

                {hasChildren && (
                    <span
                        className={`
                            ml-2
                            shrink-0
                            text-xs
                            text-slate-600
                            transition-transform
                            duration-200

                            ${
                                isOpen
                                    ? "rotate-90 text-blue-400"
                                    : ""
                            }
                        `}
                    >
                        ›
                    </span>
                )}
            </button>

            {hasChildren &&
                isOpen && (
                    <div className="
                        ml-3
                        mb-1
                        border-l
                        border-white/[0.06]
                        pl-2
                    ">
                        {item.children!.map(
                            (child) => (
                                <CategoryTree
                                    key={
                                        child.name
                                    }
                                    item={
                                        child
                                    }
                                    parents={[
                                        ...parents,
                                        item.name,
                                    ]}
                                    path={
                                        path
                                    }
                                    open={
                                        open
                                    }
                                    select={
                                        select
                                    }
                                    toggle={
                                        toggle
                                    }
                                />
                            )
                        )}
                    </div>
                )}
        </div>
    );
}

type UploadBoxProps = {
    title: string;
    subtitle: string;
    accept: string;
    file: File | null;
    setFile: (
        file: File | null
    ) => void;
};

function UploadBox({
    title,
    subtitle,
    accept,
    file,
    setFile,
}: UploadBoxProps) {
    return (
        <label className="
            group
            cursor-pointer
            rounded-xl
            border
            border-dashed
            border-white/[0.09]
            bg-[#11161D]
            p-6
            transition
            hover:border-blue-500/30
            hover:bg-[#131922]
        ">
            <input
                type="file"
                hidden
                accept={accept}
                onChange={(e) =>
                    setFile(
                        e.target.files?.[0] ||
                            null
                    )
                }
            />

            <div className="
                flex
                items-center
                gap-4
            ">
                <div className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-500/10
                    text-xs
                    font-bold
                    text-blue-400
                    transition
                    group-hover:bg-blue-500/15
                ">
                    {title
                        .replace(
                            " файл",
                            ""
                        )
                        .toUpperCase()}
                </div>

                <div className="
                    min-w-0
                ">
                    <div className="
                        text-sm
                        font-semibold
                        text-white
                    ">
                        {title}
                    </div>

                    <div className="
                        mt-1
                        text-xs
                        text-slate-600
                    ">
                        {subtitle}
                    </div>
                </div>
            </div>

            <div
                className={`
                    mt-5
                    truncate
                    rounded-lg
                    border
                    border-white/[0.05]
                    bg-[#0D1117]
                    px-3
                    py-2.5
                    text-xs

                    ${
                        file
                            ? "text-blue-400"
                            : "text-slate-600"
                    }
                `}
            >
                {file
                    ? file.name
                    : "Нажмите, чтобы выбрать файл"}
            </div>
        </label>
    );
}