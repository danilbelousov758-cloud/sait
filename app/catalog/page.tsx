"use client";

import Link from "next/link";
import {
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



type Product = {
    id: number;
    name: string;
    category: string;
    price: number;
    description: string;
    images: string[];
    dff_file: string | null;
    txd_file: string | null;
    author_id?: number | null;
    status?: string | null;
    pinned?: boolean;
    created_at?: string;
};



type CatalogItem = {
    name: string;
    children?: CatalogItem[];
};



const expandableCategories: CatalogItem[] = [
    {
        name: "Скины",
        children: [
            {
                name: "Государственные",
            },
            {
                name: "Мафии",
            },
            {
                name: "Банды",
            },
            {
                name: "Гражданские",
            },
        ],
    },

    {
        name: "Оружие",
        children: [
            {
                name: "Ганпак",
            },
            {
                name: "Дигл",
            },
            {
                name: "ЮСП",
            },
            {
                name: "Револьвер",
            },
            {
                name: "АПС",
            },
            {
                name: "СВД ПСО",
            },
            {
                name: "СВД",
            },
            {
                name: "M4A4",
            },
            {
                name: "Абакан",
            },
            {
                name: "АС ВАЛ",
            },
            {
                name: "Гроза",
            },
            {
                name: "Дробовик",
            },
        ],
    },

    {
        name: "Интерьеры",
        children: [
            {
                name: "24/7",
            },
            {
                name: "ДПС / ППС / ФСБ",
            },
            {
                name: "Оружейка",
            },
            {
                name: "Ашан",
            },
            {
                name: "Аптека",
            },
            {
                name: "ПК клуб",
            },
            {
                name: "Особа",
            },
            {
                name: "Банк",
            },
        ],
    },

    {
        name: "Заменные территории",
        children: [
            {
                name: "ЦР",
            },
            {
                name: "ФСИН",
            },
            {
                name: "Арзамас",
            },
            {
                name: "Батырево",
            },
            {
                name: "Южный",
            },
            {
                name: "Бизвар локации",
            },
            {
                name: "Вокзалы",
            },
        ],
    },

    {
        name: "Эффекты",
        children: [
            {
                name: "Кровь",
            },
            {
                name: "Эффект при попадании",
            },
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
                            {
                                name: "M4A4",
                            },
                            {
                                name: "Абакан",
                            },
                            {
                                name: "Гроза",
                            },
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



export default function CatalogPage() {
    const [user, setUser] =
        useState<User | null>(null);

    const [products, setProducts] =
        useState<Product[]>([]);

    const [selectedCategory, setSelectedCategory] =
        useState("Все моды");

    const [openCategories, setOpenCategories] =
        useState<string[]>([
            "Скины",
        ]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");



    useEffect(() => {
        loadUser();
        loadProducts();

        const handleUserUpdated = () => {
            loadUser();
        };

        const handleProductsUpdated = () => {
            loadProducts();
        };

        window.addEventListener(
            "userUpdated",
            handleUserUpdated
        );

        window.addEventListener(
            "productsUpdated",
            handleProductsUpdated
        );

        return () => {
            window.removeEventListener(
                "userUpdated",
                handleUserUpdated
            );

            window.removeEventListener(
                "productsUpdated",
                handleProductsUpdated
            );
        };
    }, []);



    function loadUser() {
        try {
            const saved =
                localStorage.getItem("user");

            if (!saved) {
                setUser(null);
                return;
            }

            const parsed =
                JSON.parse(saved);

            setUser(parsed);
        } catch {
            setUser(null);
        }
    }



    async function loadProducts() {
        try {
            setLoading(true);
            setError("");

            const response =
                await fetch(
                    "/api/products",
                    {
                        method: "GET",
                        cache: "no-store",
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Ошибка загрузки товаров"
                );
            }



            /*
             * API возвращает:
             *
             * {
             *     success: true,
             *     products: [...]
             * }
             *
             * Поэтому раньше здесь была ошибка:
             *
             * if (Array.isArray(data))
             *
             * Теперь забираем именно data.products.
             */

            const apiProducts =
                Array.isArray(data?.products)
                    ? data.products
                    : [];



            const normalizedProducts =
                apiProducts.map(
                    (product: Partial<Product>) => {
                        let images: string[] = [];

                        if (
                            Array.isArray(
                                product.images
                            )
                        ) {
                            images =
                                product.images.filter(
                                    (
                                        image
                                    ): image is string =>
                                        typeof image ===
                                        "string" &&
                                        image.length > 0
                                );
                        }

                        return {
                            id:
                                Number(
                                    product.id
                                ),

                            name:
                                String(
                                    product.name ||
                                    "Без названия"
                                ),

                            category:
                                String(
                                    product.category ||
                                    ""
                                ),

                            price:
                                Number(
                                    product.price ||
                                    0
                                ),

                            description:
                                String(
                                    product.description ||
                                    ""
                                ),

                            images,

                            dff_file:
                                product.dff_file ||
                                null,

                            txd_file:
                                product.txd_file ||
                                null,

                            author_id:
                                product.author_id
                                    ? Number(
                                          product.author_id
                                      )
                                    : null,

                            status:
                                product.status ||
                                "ACTIVE",

                            pinned:
                                Boolean(
                                    product.pinned
                                ),

                            created_at:
                                product.created_at,
                        };
                    }
                );



            console.log(
                "CATALOG PRODUCTS:",
                normalizedProducts
            );



            setProducts(
                normalizedProducts
            );
        } catch (err) {
            console.error(
                "CATALOG LOAD ERROR:",
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : "Ошибка загрузки товаров"
            );

            setProducts([]);
        } finally {
            setLoading(false);
        }
    }



    const role =
        user?.role?.toUpperCase() ||
        "USER";



    const canCreateProduct =
        role === "SELLER" ||
        role === "ADMIN" ||
        role === "FOUNDER";



    function toggleCategory(
        name: string
    ) {
        setOpenCategories(
            current =>
                current.includes(name)
                    ? current.filter(
                          item =>
                              item !== name
                      )
                    : [
                          ...current,
                          name,
                      ]
        );
    }



    function selectCategory(
        name: string
    ) {
        setSelectedCategory(name);
    }



    /*
     * Определяем конечные категории.
     *
     * Например:
     *
     * Скины
     *   ├ Государственные
     *   ├ Мафии
     *   ├ Банды
     *
     * У товара должна быть категория:
     *
     * Скины/Государственные
     *
     * или
     *
     * Скины > Государственные
     *
     * Родитель "Скины" НЕ должен показывать товар.
     */

    const leafCategories =
        useMemo(() => {
            const result: string[] = [];

            function walk(
                items: CatalogItem[],
                parents: string[]
            ) {
                items.forEach(item => {
                    const path = [
                        ...parents,
                        item.name,
                    ];

                    if (
                        item.children &&
                        item.children.length > 0
                    ) {
                        walk(
                            item.children,
                            path
                        );
                    } else {
                        result.push(
                            path.join("/")
                        );
                    }
                });
            }

            walk(
                expandableCategories,
                []
            );

            simpleCategories.forEach(
                category => {
                    result.push(category);
                }
            );

            return result;
        }, []);



    const filteredProducts =
        useMemo(() => {
            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase();



            return products.filter(
                product => {
                    /*
                     * Поиск.
                     */

                    if (
                        normalizedSearch &&
                        !product.name
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            ) &&
                        !product.description
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            )
                    ) {
                        return false;
                    }



                    /*
                     * Все моды.
                     */

                    if (
                        selectedCategory ===
                        "Все моды"
                    ) {
                        return true;
                    }



                    /*
                     * Родительские категории
                     * специально НЕ показываем.
                     *
                     * Например:
                     *
                     * selectedCategory = "Скины"
                     *
                     * товар:
                     * "Скины/Государственные"
                     *
                     * НЕ попадёт сюда.
                     */

                    const isParentCategory =
                        expandableCategories.some(
                            category =>
                                category.name ===
                                selectedCategory
                        );



                    if (
                        isParentCategory
                    ) {
                        return false;
                    }



                    /*
                     * Нормализуем разные варианты
                     * разделителей.
                     */

                    const productCategory =
                        product.category
                            .toLowerCase()
                            .replace(
                                /\s*>\s*/g,
                                "/"
                            )
                            .replace(
                                /\s*\/\s*/g,
                                "/"
                            )
                            .trim();



                    const selected =
                        selectedCategory
                            .toLowerCase()
                            .replace(
                                /\s*>\s*/g,
                                "/"
                            )
                            .replace(
                                /\s*\/\s*/g,
                                "/"
                            )
                            .trim();



                    /*
                     * Точное совпадение.
                     *
                     * Это важно:
                     *
                     * "Скины/Государственные"
                     *
                     * покажется только
                     * в "Государственные".
                     */

                    return (
                        productCategory ===
                        selected
                    );
                }
            );
        }, [
            products,
            selectedCategory,
            search,
        ]);





    const filteredMainCategories =
        expandableCategories.filter(
            item =>
                item.name
                    .toLowerCase()
                    .includes(
                        search
                            .toLowerCase()
                    )
        );



    const filteredSimple =
        simpleCategories.filter(
            item =>
                item.toLowerCase()
                    .includes(
                        search
                            .toLowerCase()
                    )
        );



    return (
        <>
            <Header />



            <main
                className="
                    min-h-screen
                    bg-[#080B10]
                    px-4
                    pb-20
                    pt-[125px]
                    text-white
                "
            >
                <div
                    className="
                        pointer-events-none
                        fixed
                        inset-0
                        overflow-hidden
                    "
                >
                    <div
                        className="
                            absolute
                            left-1/2
                            top-[-260px]
                            h-[520px]
                            w-[720px]
                            -translate-x-1/2
                            rounded-full
                            bg-blue-600/[0.055]
                            blur-[150px]
                        "
                    />

                    <div
                        className="
                            absolute
                            bottom-[-250px]
                            right-[-150px]
                            h-[450px]
                            w-[450px]
                            rounded-full
                            bg-blue-500/[0.025]
                            blur-[150px]
                        "
                    />
                </div>



                <div
                    className="
                        relative
                        mx-auto
                        max-w-7xl
                    "
                >
                    <div
                        className="
                            mb-7
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-end
                            sm:justify-between
                        "
                    >
                        <div>
                            <h1
                                className="
                                    text-3xl
                                    font-bold
                                    tracking-tight
                                    text-white
                                "
                            >
                                Каталог
                            </h1>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Моды MAZEPOV CONNEXTION
                            </p>
                        </div>



                        {canCreateProduct && (
                            <Link
                                href="/catalog/create"
                                className="
                                    inline-flex
                                    w-fit
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-600
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-blue-500
                                "
                            >
                                <span className="mr-2">
                                    +
                                </span>

                                Создать товар
                            </Link>
                        )}
                    </div>



                    <div
                        className="
                            mb-5
                            max-w-xl
                        "
                    >
                        <input
                            value={search}
                            onChange={event =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Поиск по каталогу..."
                            className="
                                h-12
                                w-full
                                rounded-xl
                                border
                                border-white/10
                                bg-[#0D1117]
                                px-4
                                text-sm
                                text-white
                                outline-none
                                transition
                                placeholder:text-slate-700
                                focus:border-blue-500
                                focus:bg-[#11161D]
                            "
                        />
                    </div>



                    <div
                        className="
                            grid
                            gap-5
                            lg:grid-cols-[270px_1fr]
                        "
                    >
                        <aside
                            className="
                                h-fit
                                rounded-2xl
                                border
                                border-white/10
                                bg-[#0D1117]
                                p-3
                            "
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    selectCategory(
                                        "Все моды"
                                    )
                                }
                                className={`
                                    mb-2
                                    w-full
                                    rounded-xl
                                    px-3
                                    py-2.5
                                    text-left
                                    text-sm
                                    transition
                                    ${
                                        selectedCategory ===
                                        "Все моды"
                                            ? "bg-blue-600 text-white"
                                            : "text-slate-400 hover:bg-white/5"
                                    }
                                `}
                            >
                                Все моды
                            </button>



                            <div
                                className="
                                    mb-3
                                    mt-5
                                    text-[10px]
                                    uppercase
                                    tracking-widest
                                    text-slate-600
                                "
                            >
                                Разделы
                            </div>



                            <div
                                className="
                                    space-y-1
                                "
                            >
                                {filteredMainCategories.map(
                                    category => (
                                        <CategoryTree
                                            key={
                                                category.name
                                            }
                                            item={
                                                category
                                            }
                                            parentPath=""
                                            selectedCategory={
                                                selectedCategory
                                            }
                                            setSelectedCategory={
                                                setSelectedCategory
                                            }
                                            openCategories={
                                                openCategories
                                            }
                                            setOpenCategories={
                                                setOpenCategories
                                            }
                                        />
                                    )
                                )}
                            </div>



                            <div
                                className="
                                    my-4
                                    h-px
                                    bg-white/10
                                "
                            />



                            <div
                                className="
                                    mb-2
                                    text-[10px]
                                    uppercase
                                    tracking-widest
                                    text-slate-600
                                "
                            >
                                Категории
                            </div>



                            <div className="space-y-1">
                                {filteredSimple.map(
                                    category => (
                                        <button
                                            key={
                                                category
                                            }
                                            type="button"
                                            onClick={() =>
                                                selectCategory(
                                                    category
                                                )
                                            }
                                            className={`
                                                w-full
                                                rounded-xl
                                                px-3
                                                py-2
                                                text-left
                                                text-sm
                                                transition
                                                ${
                                                    selectedCategory ===
                                                    category
                                                        ? "bg-blue-600 text-white"
                                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                                }
                                            `}
                                        >
                                            {category}
                                        </button>
                                    )
                                )}
                            </div>
                        </aside>



                        <section className="min-w-0">
                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-[#0D1117]
                                    p-6
                                "
                            >
                                <div
                                    className="
                                        mb-6
                                        flex
                                        flex-col
                                        gap-3
                                        border-b
                                        border-white/10
                                        pb-5
                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-between
                                    "
                                >
                                    <div>
                                        <p
                                            className="
                                                text-xs
                                                uppercase
                                                tracking-widest
                                                text-blue-500
                                            "
                                        >
                                            Каталог
                                        </p>

                                        <h2
                                            className="
                                                mt-2
                                                text-2xl
                                                font-bold
                                            "
                                        >
                                            {selectedCategory}
                                        </h2>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-slate-600
                                            "
                                        >
                                            {selectedCategory ===
                                            "Все моды"
                                                ? "Все доступные моды"
                                                : "Моды выбранной категории"}
                                        </p>
                                    </div>



                                    <div
                                        className="
                                            w-fit
                                            rounded-lg
                                            bg-white/5
                                            px-3
                                            py-2
                                            text-xs
                                            text-slate-500
                                        "
                                    >
                                        {filteredProducts.length}{" "}
                                        {getProductWord(
                                            filteredProducts.length
                                        )}
                                    </div>
                                </div>



                                {loading ? (
                                    <div
                                        className="
                                            flex
                                            min-h-[350px]
                                            items-center
                                            justify-center
                                        "
                                    >
                                        <div
                                            className="
                                                text-sm
                                                text-slate-600
                                            "
                                        >
                                            Загрузка каталога...
                                        </div>
                                    </div>
                                ) : error ? (
                                    <div
                                        className="
                                            flex
                                            min-h-[350px]
                                            items-center
                                            justify-center
                                            text-center
                                        "
                                    >
                                        <div>
                                            <div
                                                className="
                                                    mx-auto
                                                    flex
                                                    h-16
                                                    w-16
                                                    items-center
                                                    justify-center
                                                    rounded-2xl
                                                    bg-red-500/10
                                                    text-xl
                                                    text-red-400
                                                "
                                            >
                                                !
                                            </div>

                                            <h3
                                                className="
                                                    mt-5
                                                    text-lg
                                                    font-semibold
                                                "
                                            >
                                                Ошибка загрузки
                                            </h3>

                                            <p
                                                className="
                                                    mt-2
                                                    text-sm
                                                    text-slate-600
                                                "
                                            >
                                                {error}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={
                                                    loadProducts
                                                }
                                                className="
                                                    mt-5
                                                    rounded-xl
                                                    bg-blue-600
                                                    px-4
                                                    py-2
                                                    text-sm
                                                    font-semibold
                                                    hover:bg-blue-500
                                                "
                                            >
                                                Повторить
                                            </button>
                                        </div>
                                    </div>
                                ) : filteredProducts.length ===
                                  0 ? (
                                    <div
                                        className="
                                            flex
                                            min-h-[350px]
                                            items-center
                                            justify-center
                                            text-center
                                        "
                                    >
                                        <div>
                                            <div
                                                className="
                                                    mx-auto
                                                    flex
                                                    h-16
                                                    w-16
                                                    items-center
                                                    justify-center
                                                    rounded-2xl
                                                    bg-[#11161D]
                                                    text-2xl
                                                "
                                            >
                                                ◈
                                            </div>

                                            <h3
                                                className="
                                                    mt-5
                                                    text-lg
                                                    font-semibold
                                                "
                                            >
                                                Модов нет
                                            </h3>

                                            <p
                                                className="
                                                    mt-2
                                                    text-sm
                                                    text-slate-600
                                                "
                                            >
                                                В данном разделе пока ничего нет
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="
                                            grid
                                            gap-5
                                            sm:grid-cols-2
                                            xl:grid-cols-3
                                        "
                                    >
                                        {filteredProducts.map(
                                            product => (
                                                <ProductCard
                                                    key={
                                                        product.id
                                                    }
                                                    product={
                                                        product
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}



type CategoryTreeProps = {
    item: CatalogItem;
    parentPath: string;
    selectedCategory: string;
    setSelectedCategory: (
        name: string
    ) => void;
    openCategories: string[];
    setOpenCategories: React.Dispatch<
        React.SetStateAction<string[]>
    >;
};



function CategoryTree({
    item,
    parentPath,
    selectedCategory,
    setSelectedCategory,
    openCategories,
    setOpenCategories,
}: CategoryTreeProps) {
    const hasChildren =
        Boolean(
            item.children &&
            item.children.length > 0
        );



    const currentPath =
        parentPath
            ? `${parentPath}/${item.name}`
            : item.name;



    const open =
        openCategories.includes(
            currentPath
        );



    /*
     * Родительские категории:
     *
     * Скины
     * Оружие
     * Интерьеры
     *
     * не являются конечными категориями.
     *
     * Поэтому на них не устанавливаем
     * выбор товаров.
     */

    function click() {
        if (hasChildren) {
            setOpenCategories(
                current =>
                    current.includes(
                        currentPath
                    )
                        ? current.filter(
                              item =>
                                  item !==
                                  currentPath
                          )
                        : [
                              ...current,
                              currentPath,
                          ]
            );

            return;
        }



        /*
         * Только конечная категория
         * выбирается для отображения товаров.
         */

        setSelectedCategory(
            currentPath
        );
    }



    const active =
        selectedCategory ===
        currentPath;



    return (
        <div>
            <button
                type="button"
                onClick={click}
                className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    px-3
                    py-2
                    text-left
                    text-sm
                    transition
                    ${
                        active
                            ? "bg-blue-600 text-white"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }
                `}
            >
                <span>
                    {item.name}
                </span>

                {hasChildren && (
                    <span
                        className={`
                            text-xs
                            transition-transform
                            ${
                                open
                                    ? "rotate-90"
                                    : ""
                            }
                        `}
                    >
                        ›
                    </span>
                )}
            </button>



            {hasChildren &&
                open &&
                item.children && (
                    <div
                        className="
                            ml-3
                            mt-1
                            border-l
                            border-white/10
                            pl-2
                        "
                    >
                        {item.children.map(
                            child => (
                                <CategoryTree
                                    key={
                                        `${currentPath}/${child.name}`
                                    }
                                    item={
                                        child
                                    }
                                    parentPath={
                                        currentPath
                                    }
                                    selectedCategory={
                                        selectedCategory
                                    }
                                    setSelectedCategory={
                                        setSelectedCategory
                                    }
                                    openCategories={
                                        openCategories
                                    }
                                    setOpenCategories={
                                        setOpenCategories
                                    }
                                />
                            )
                        )}
                    </div>
                )}
        </div>
    );
}



type ProductCardProps = {
    product: Product;
};



function ProductCard({
    product,
}: ProductCardProps) {
    const image =
        product.images &&
        product.images.length > 0
            ? product.images[0]
            : null;



    return (
        <div
            className="
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-[#11161D]
                transition
                hover:border-white/15
                hover:bg-[#131920]
            "
        >
            <ProductImage
                src={image || undefined}
                alt={product.name}
            />



            <div className="p-4">
                <h3
                    className="
                        line-clamp-1
                        font-semibold
                        text-white
                    "
                >
                    {product.name}
                </h3>



                {product.category && (
                    <div
                        className="
                            mt-2
                            text-[10px]
                            uppercase
                            tracking-wider
                            text-blue-500
                        "
                    >
                        {product.category}
                    </div>
                )}



                <p
                    className="
                        mt-2
                        line-clamp-3
                        text-sm
                        leading-6
                        text-slate-500
                    "
                >
                    {product.description ||
                        "Описание отсутствует"}
                </p>



                <div
                    className="
                        mt-4
                        flex
                        items-center
                        justify-between
                        gap-3
                    "
                >
                    <span
                        className="
                            font-bold
                            text-blue-400
                        "
                    >
                        {product.price} ₽
                    </span>



                    <Link
                        href={`/catalog/${product.id}`}
                        className="
                            rounded-lg
                            bg-blue-600
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            text-white
                            transition
                            hover:bg-blue-500
                        "
                    >
                        Подробнее
                    </Link>
                </div>
            </div>
        </div>
    );
}



type ProductImageProps = {
    src?: string;
    alt: string;
};



function ProductImage({
    src,
    alt,
}: ProductImageProps) {
    if (!src) {
        return (
            <div
                className="
                    flex
                    h-44
                    items-center
                    justify-center
                    bg-[#0D1117]
                    text-sm
                    text-slate-600
                "
            >
                Нет изображения
            </div>
        );
    }



    return (
        <div
            className="
                h-44
                w-full
                overflow-hidden
                bg-[#0D1117]
            "
        >
            <img
                src={src}
                alt={alt}
                className="
                    h-full
                    w-full
                    object-cover
                    transition
                    duration-300
                    hover:scale-105
                "
                onError={event => {
                    event.currentTarget.style.display =
                        "none";
                }}
            />
        </div>
    );
}



function getProductWord(
    count: number
) {
    const lastTwo =
        count % 100;

    const last =
        count % 10;



    if (
        lastTwo >= 11 &&
        lastTwo <= 19
    ) {
        return "модов";
    }



    if (last === 1) {
        return "мод";
    }



    if (
        last >= 2 &&
        last <= 4
    ) {
        return "мода";
    }



    return "модов";
}