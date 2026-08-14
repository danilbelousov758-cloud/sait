"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
            { name: "ДПС / ППС / ФСБ" },
            { name: "Оружейка" },
            { name: "Ашан" },
            { name: "Аптека" },
            { name: "ПК клуб" },
            { name: "Особа" },
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
                children: [{ name: "ld_bum" }],
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
                            { name: "СВД ПСО" },
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
    const [user, setUser] = useState<User | null>(null);

    const [openCategories, setOpenCategories] = useState<string[]>([
        "Скины",
    ]);

    const [selectedCategory, setSelectedCategory] = useState("Скины");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const loadUser = () => {
            try {
                const savedUser = localStorage.getItem("user");

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
            }
        };

        loadUser();

        window.addEventListener("storage", loadUser);
        window.addEventListener("userUpdated", loadUser);

        return () => {
            window.removeEventListener("storage", loadUser);
            window.removeEventListener("userUpdated", loadUser);
        };
    }, []);

    const role = user?.role?.toUpperCase() || "USER";

    const canCreateProduct =
        role === "SELLER" ||
        role === "ADMIN" ||
        role === "FOUNDER";

    const toggleCategory = (name: string) => {
        setOpenCategories((current) =>
            current.includes(name)
                ? current.filter((item) => item !== name)
                : [...current, name]
        );

        setSelectedCategory(name);
    };

    const selectCategory = (name: string) => {
        setSelectedCategory(name);
    };

    const filteredExpandableCategories =
        expandableCategories.filter((category) =>
            category.name
                .toLowerCase()
                .includes(search.toLowerCase())
        );

    const filteredSimpleCategories =
        simpleCategories.filter((category) =>
            category
                .toLowerCase()
                .includes(search.toLowerCase())
        );

    return (
        <>
            <Header />

            <main className="min-h-screen bg-[#080B10] px-4 pb-20 pt-[125px] text-slate-100 sm:px-6">
                {/* Фон */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="absolute left-1/2 top-[-260px] h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-blue-600/[0.055] blur-[150px]" />

                    <div className="absolute bottom-[-250px] right-[-150px] h-[450px] w-[450px] rounded-full bg-blue-500/[0.025] blur-[150px]" />
                </div>

                <div className="relative mx-auto w-full max-w-7xl">
                    {/* Заголовок */}
                    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">
                                Каталог
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Найдите нужные моды и материалы для вашего клиента.
                            </p>
                        </div>

                        {/* Создание товара */}
                        {canCreateProduct && (
                            <Link
                                href="/catalog/create"
                                className="inline-flex w-fit items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500"
                            >
                                <span className="mr-2 text-base">
                                    +
                                </span>

                                Создать товар
                            </Link>
                        )}
                    </div>

                    {/* Поиск */}
                    <div className="mb-5">
                        <div className="relative max-w-xl">
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-600">
                                ⌕
                            </span>

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Поиск по каталогу..."
                                className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#0D1117] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500/40 focus:bg-[#11161D] focus:ring-4 focus:ring-blue-500/[0.06]"
                            />
                        </div>
                    </div>

                    {/* Каталог */}
                    <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
                        {/* Левая панель */}
                        <aside className="h-fit rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
                            {filteredExpandableCategories.length > 0 && (
                                <>
                                    <div className="px-3 pb-2 pt-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-700">
                                        Разделы
                                    </div>

                                    <div className="space-y-1">
                                        {filteredExpandableCategories.map(
                                            (category) => {
                                                const isOpen =
                                                    openCategories.includes(
                                                        category.name
                                                    );

                                                const isSelected =
                                                    selectedCategory ===
                                                    category.name;

                                                return (
                                                    <div
                                                        key={category.name}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleCategory(
                                                                    category.name
                                                                )
                                                            }
                                                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                                                                isSelected
                                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                                                                    : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                                                            }`}
                                                        >
                                                            <span>
                                                                {
                                                                    category.name
                                                                }
                                                            </span>

                                                            <span
                                                                className={`text-xs transition-transform duration-200 ${
                                                                    isOpen
                                                                        ? "rotate-90"
                                                                        : ""
                                                                }`}
                                                            >
                                                                ›
                                                            </span>
                                                        </button>

                                                        {isOpen &&
                                                            category.children && (
                                                                <div className="ml-2 mt-1 border-l border-white/[0.06] pl-2">
                                                                    <CatalogTree
                                                                        items={
                                                                            category.children
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
                                                                </div>
                                                            )}
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </>
                            )}

                            {filteredSimpleCategories.length > 0 && (
                                <div className="my-3 h-px bg-white/[0.05]" />
                            )}

                            {filteredSimpleCategories.length > 0 && (
                                <>
                                    <div className="px-3 pb-2 pt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-700">
                                        Категории
                                    </div>

                                    <div className="space-y-1">
                                        {filteredSimpleCategories.map(
                                            (category) => {
                                                const active =
                                                    selectedCategory ===
                                                    category;

                                                return (
                                                    <button
                                                        key={category}
                                                        type="button"
                                                        onClick={() =>
                                                            selectCategory(
                                                                category
                                                            )
                                                        }
                                                        className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                                                            active
                                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                                                                : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                                                        }`}
                                                    >
                                                        {category}
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>
                                </>
                            )}

                            {filteredExpandableCategories.length === 0 &&
                                filteredSimpleCategories.length === 0 && (
                                    <div className="px-3 py-8 text-center text-xs text-slate-600">
                                        Ничего не найдено
                                    </div>
                                )}
                        </aside>

                        {/* Правая часть */}
                        <section className="min-w-0">
                            <div className="rounded-[20px] border border-white/[0.07] bg-[#0D1117] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:p-7">
                                <div className="flex flex-col gap-2 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-500">
                                            Каталог
                                        </div>

                                        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
                                            {selectedCategory}
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-600">
                                            Материалы и модификации раздела.
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[10px] text-slate-600">
                                        Скоро
                                    </div>
                                </div>

                                <div className="flex min-h-[380px] items-center justify-center">
                                    <div className="max-w-sm text-center">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-[#11161D] text-2xl">
                                            ◈
                                        </div>

                                        <h3 className="mt-5 text-lg font-semibold text-white">
                                            Раздел готовится
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            Здесь будут размещаться моды,
                                            изображения, описание и информация
                                            о файлах.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}

type CatalogTreeProps = {
    items: CatalogItem[];
    selectedCategory: string;
    setSelectedCategory: (name: string) => void;
    openCategories: string[];
    setOpenCategories: React.Dispatch<
        React.SetStateAction<string[]>
    >;
};

function CatalogTree({
    items,
    selectedCategory,
    setSelectedCategory,
    openCategories,
    setOpenCategories,
}: CatalogTreeProps) {
    return (
        <div className="space-y-1">
            {items.map((item) => {
                const hasChildren = Boolean(
                    item.children?.length
                );

                const isOpen =
                    openCategories.includes(item.name);

                const isSelected =
                    selectedCategory === item.name;

                const handleClick = () => {
                    setSelectedCategory(item.name);

                    if (hasChildren) {
                        setOpenCategories((current) =>
                            current.includes(item.name)
                                ? current.filter(
                                      (name) =>
                                          name !== item.name
                                  )
                                : [...current, item.name]
                        );
                    }
                };

                return (
                    <div key={item.name}>
                        <button
                            type="button"
                            onClick={handleClick}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-all ${
                                isSelected
                                    ? "bg-blue-600/[0.12] text-blue-400"
                                    : "text-slate-500 hover:bg-white/[0.035] hover:text-slate-300"
                            }`}
                        >
                            <span>{item.name}</span>

                            {hasChildren && (
                                <span
                                    className={`text-[10px] transition-transform duration-200 ${
                                        isOpen
                                            ? "rotate-90"
                                            : ""
                                    }`}
                                >
                                    ›
                                </span>
                            )}
                        </button>

                        {hasChildren && isOpen && (
                            <div className="ml-2 mt-1 border-l border-white/[0.05] pl-2">
                                <CatalogTree
                                    items={item.children!}
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
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}