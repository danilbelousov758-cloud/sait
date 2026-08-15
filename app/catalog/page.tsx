"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import Link from "next/link";

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

    created_at?: string | null;
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



type CatalogTab =
    "mods"
    |
    "builds"
    |
    "tips";



export default function CatalogPage() {


    const [user,setUser] =
        useState<User | null>(null);



    const [products,setProducts] =
        useState<Product[]>([]);



    const [selectedCategory,setSelectedCategory] =
        useState(
            "Все моды"
        );



    const [openCategories,setOpenCategories] =
        useState<string[]>([
            "Скины",
        ]);



    const [search,setSearch] =
        useState("");



    const [catalogTab,setCatalogTab] =
        useState<CatalogTab>(
            "mods"
        );



    const [loading,setLoading] =
        useState(true);



    const [error,setError] =
        useState("");



    useEffect(() => {

        loadUser();

        loadProducts();



        const updateUser = () => {
            loadUser();
        };


        const updateProducts = () => {
            loadProducts();
        };


        window.addEventListener(
            "userUpdated",
            updateUser
        );


        window.addEventListener(
            "productsUpdated",
            updateProducts
        );



        return () => {

            window.removeEventListener(
                "userUpdated",
                updateUser
            );


            window.removeEventListener(
                "productsUpdated",
                updateProducts
            );

        };


    }, []);

    function loadUser() {

        try {

            const saved =
                localStorage.getItem(
                    "user"
                );


            if (!saved) {

                setUser(null);

                return;

            }


            setUser(
                JSON.parse(saved)
            );


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



            const items =
                Array.isArray(
                    data.products
                )
                    ? data.products
                    : [];



            const normalized =
                items.map(
                    (item:any) => ({

                        id:
                            Number(
                                item.id
                            ),


                        name:
                            String(
                                item.name ||
                                "Без названия"
                            ),


                        category:
                            String(
                                item.category ||
                                ""
                            ),


                        price:
                            Number(
                                item.price ||
                                0
                            ),


                        description:
                            String(
                                item.description ||
                                ""
                            ),


                        images:
                            Array.isArray(
                                item.images
                            )
                                ? item.images
                                : [],


                        dff_file:
                            item.dff_file ||
                            null,


                        txd_file:
                            item.txd_file ||
                            null,


                        author_id:
                            item.author_id
                                ? Number(
                                    item.author_id
                                )
                                : null,


                        status:
                            item.status ||
                            "ACTIVE",


                        pinned:
                            Boolean(
                                item.pinned
                            ),


                        created_at:
                            item.created_at ||
                            null,

                    })
                );



            setProducts(
                normalized
            );


        } catch(error) {


            console.error(
                error
            );


            setProducts([]);


            setError(
                error instanceof Error
                    ? error.message
                    : "Ошибка загрузки"
            );


        } finally {

            setLoading(false);

        }

    }





    const role =
        user?.role?.toUpperCase()
        ||
        "USER";



    const canCreateProduct =
        role === "ADMIN"
        ||
        role === "FOUNDER"
        ||
        role === "SELLER";







    const filteredProducts =
        useMemo(() => {


            const text =
                search
                    .trim()
                    .toLowerCase();



            return products.filter(
                product => {



                    if (
                        catalogTab === "builds"
                    ) {

                        return false;

                    }



                    if (
                        catalogTab === "tips"
                    ) {

                        return false;

                    }





                    if (
                        text
                        &&
                        !product.name
                            .toLowerCase()
                            .includes(text)
                        &&
                        !product.description
                            .toLowerCase()
                            .includes(text)
                    ) {

                        return false;

                    }





                    if (
                        selectedCategory ===
                        "Все моды"
                    ) {

                        return true;

                    }




                    const category =
                        normalizeCategory(
                            product.category
                        );


                    const selected =
                        normalizeCategory(
                            selectedCategory
                        );



                    return (
                        category === selected
                    );


                }
            );


        },[
            products,
            search,
            selectedCategory,
            catalogTab,
        ]);







    const filteredMainCategories =
        expandableCategories.filter(
            item =>
                item.name
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )
        );





    const filteredSimple =
        simpleCategories.filter(
            item =>
                item
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )
        );







    return (

        <>

            <Header />



            <main
                className="
                    min-h-screen
                    px-4
                    pb-20
                    pt-[120px]
                    text-white
                "
            >


                <div
                    className="
                        relative
                        mx-auto
                        max-w-7xl
                    "
                >



                    <div
                        className="
                            mb-8
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >


                        <div>

                            <h1
                                className="
                                    text-3xl
                                    font-bold
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
                                MAZEPOV CONNEXTION
                            </p>


                        </div>




                        {canCreateProduct && (

                            <Link
                                href="/catalog/create"
                                className="
                                    rounded-xl
                                    bg-blue-600
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    transition
                                    hover:bg-blue-500
                                "
                            >

                                + Создать товар

                            </Link>

                        )}



                    </div>

                                        <div
                        className="
                            mb-6
                            flex
                            flex-col
                            gap-4
                        "
                    >


                        {/* Вкладки каталога */}

                        <div
                            className="
                                flex
                                w-fit
                                items-center
                                gap-1
                                rounded-xl
                                border
                                border-white/10
                                bg-[#0D1117]
                                p-1
                            "
                        >


                            {[
                                {
                                    id:"mods",
                                    title:"Моды",
                                },
                                {
                                    id:"builds",
                                    title:"Сборки",
                                },
                                {
                                    id:"tips",
                                    title:"Подсказки",
                                },

                            ].map(tab => (

                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() =>
                                        setCatalogTab(
                                            tab.id as CatalogTab
                                        )
                                    }
                                    className={`
                                        rounded-lg
                                        px-5
                                        py-2
                                        text-sm
                                        transition
                                        ${
                                            catalogTab === tab.id
                                            ?
                                            "bg-blue-600 text-white"
                                            :
                                            "text-slate-400 hover:bg-white/5 hover:text-white"
                                        }
                                    `}
                                >

                                    {tab.title}

                                </button>

                            ))}


                        </div>





                        {/* Поиск */}

                        <input
                            value={search}
                            onChange={
                                event =>
                                    setSearch(
                                        event.target.value
                                    )
                            }
                            placeholder="Поиск по каталогу..."
                            className="
                                h-12
                                max-w-xl
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
                            "
                        />


                    </div>






                    <div
                        className="
                            grid
                            gap-5
                            lg:grid-cols-[250px_1fr]
                        "
                    >




                        {/* Сайдбар категорий */}


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



                            <p
                                className="
                                    mb-3
                                    px-3
                                    text-[10px]
                                    uppercase
                                    tracking-widest
                                    text-slate-600
                                "
                            >
                                Категории
                            </p>



                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedCategory(
                                        "Все моды"
                                    )
                                }
                                className={`
                                    mb-1
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
                                        ?
                                        "bg-blue-600 text-white"
                                        :
                                        "text-slate-400 hover:bg-white/5 hover:text-white"
                                    }
                                `}
                            >

                                Все моды

                            </button>





                            <div
                                className="
                                    mb-2
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

                                Другое

                            </div>





                            <div
                                className="
                                    space-y-1
                                "
                            >

                                {filteredSimple.map(
                                    category => (

                                        <button
                                            key={category}
                                            type="button"
                                            onClick={() =>
                                                setSelectedCategory(
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
                                                    selectedCategory === category
                                                    ?
                                                    "bg-blue-600 text-white"
                                                    :
                                                    "text-slate-400 hover:bg-white/5 hover:text-white"
                                                }
                                            `}
                                        >

                                            {category}

                                        </button>

                                    )
                                )}

                            </div>


                        </aside>







                        {/* Контент каталога */}



                        <section
                            className="
                                min-w-0
                            "
                        >


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
                                        items-center
                                        justify-between
                                        border-b
                                        border-white/10
                                        pb-5
                                    "
                                >


                                    <div>

                                        <h2
                                            className="
                                                text-2xl
                                                font-bold
                                            "
                                        >

                                            {
                                                catalogTab === "mods"
                                                ?
                                                selectedCategory
                                                :
                                                catalogTab === "builds"
                                                ?
                                                "Сборки"
                                                :
                                                "Подсказки"
                                            }

                                        </h2>


                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-slate-600
                                            "
                                        >

                                            MAZEPOV CONNEXTION

                                        </p>


                                    </div>




                                    <div
                                        className="
                                            rounded-lg
                                            bg-white/5
                                            px-3
                                            py-2
                                            text-xs
                                            text-slate-500
                                        "
                                    >

                                        {
                                            filteredProducts.length
                                        }{" "}

                                        {
                                            getProductWord(
                                                filteredProducts.length
                                            )
                                        }

                                    </div>


                                </div>

                                
                                {loading ? (

                                    <div
                                        className="
                                            flex
                                            min-h-[350px]
                                            items-center
                                            justify-center
                                            text-sm
                                            text-slate-600
                                        "
                                    >
                                        Загрузка каталога...
                                    </div>


                                ) : error ? (


                                    <div
                                        className="
                                            flex
                                            min-h-[350px]
                                            flex-col
                                            items-center
                                            justify-center
                                            text-center
                                        "
                                    >

                                        <div
                                            className="
                                                text-red-400
                                            "
                                        >
                                            {error}
                                        </div>


                                        <button
                                            onClick={loadProducts}
                                            className="
                                                mt-4
                                                rounded-xl
                                                bg-blue-600
                                                px-4
                                                py-2
                                                text-sm
                                            "
                                        >
                                            Повторить
                                        </button>


                                    </div>


                                ) : catalogTab !== "mods" ? (


                                    <div
                                        className="
                                            flex
                                            min-h-[300px]
                                            items-center
                                            justify-center
                                            text-center
                                            text-sm
                                            text-slate-600
                                        "
                                    >

                                        Раздел пока пуст

                                    </div>


                                ) : filteredProducts.length === 0 ? (


                                    <div
                                        className="
                                            flex
                                            min-h-[300px]
                                            items-center
                                            justify-center
                                            text-center
                                            text-slate-600
                                        "
                                    >

                                        Модов нет

                                    </div>


                                ) : (


                                    <div
                                        className="
                                            grid
                                            gap-4
                                            sm:grid-cols-2
                                            xl:grid-cols-3
                                        "
                                    >

                                        {
                                            filteredProducts.map(
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
                                            )
                                        }


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

    parentPath:string;

    selectedCategory:string;

    setSelectedCategory:
        (
            value:string
        ) => void;

    openCategories:string[];

    setOpenCategories:
        React.Dispatch<
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

}:CategoryTreeProps){



    const path =
        parentPath
            ?
            `${parentPath}/${item.name}`
            :
            item.name;



    const hasChildren =
        Boolean(
            item.children?.length
        );



    const open =
        openCategories.includes(
            path
        );



    function click(){


        if(hasChildren){

            setOpenCategories(
                current =>
                    current.includes(path)
                    ?
                    current.filter(
                        item =>
                            item !== path
                    )
                    :
                    [
                        ...current,
                        path,
                    ]
            );


            return;

        }



        setSelectedCategory(
            path
        );

    }



    return (

        <div>


            <button
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
                        selectedCategory === path
                        ?
                        "bg-blue-600 text-white"
                        :
                        "text-slate-400 hover:bg-white/5 hover:text-white"
                    }
                `}
            >

                {item.name}


                {
                    hasChildren &&
                    (
                        <span>
                            {open ? "⌄" : "›"}
                        </span>
                    )
                }


            </button>




            {
                hasChildren &&
                open &&
                (
                    <div
                        className="
                            ml-3
                            mt-1
                            border-l
                            border-white/10
                            pl-2
                        "
                    >

                        {
                            item.children?.map(
                                child => (

                                    <CategoryTree

                                        key={
                                            `${path}/${child.name}`
                                        }

                                        item={
                                            child
                                        }

                                        parentPath={
                                            path
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
                            )
                        }


                    </div>
                )
            }



        </div>

    );

}






function ProductCard({
    product,
}:{
    product:Product;
}){


    const image =
        product.images?.[0];



    return (

        <div
            className="
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-[#11161D]
            "
        >


            <Link
                href={`/catalog/${product.id}`}
            >

                <div
                    className="
                        aspect-video
                        bg-[#0D1117]
                    "
                >

                    {
                        image
                        ?
                        <img
                            src={image}
                            alt={product.name}
                            className="
                                h-full
                                w-full
                                object-cover
                            "
                        />
                        :
                        <div
                            className="
                                flex
                                h-full
                                items-center
                                justify-center
                                text-xs
                                text-slate-600
                            "
                        >
                            Нет изображения
                        </div>
                    }


                </div>


            </Link>




            <div
                className="
                    p-4
                "
            >

                <h3
                    className="
                        truncate
                        font-semibold
                    "
                >

                    {product.name}

                </h3>


                <p
                    className="
                        mt-2
                        line-clamp-2
                        text-xs
                        text-slate-500
                    "
                >

                    {
                        product.description ||
                        "Описание отсутствует"
                    }

                </p>



                <div
                    className="
                        mt-4
                        flex
                        items-center
                        justify-between
                    "
                >

                    <span
                        className="
                            text-sm
                            text-slate-400
                        "
                    >

                        {
                            product.price > 0
                            ?
                            `${product.price} ₽`
                            :
                            "Бесплатно"
                        }

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
                        "
                    >

                        {
                            product.price > 0
                            ?
                            "Купить"
                            :
                            "Открыть"
                        }

                    </Link>


                </div>


            </div>


        </div>

    );

}





function normalizeCategory(
    value:string
){

    return value
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

}





function getProductWord(
    count:number
){

    const lastTwo =
        count % 100;


    const last =
        count % 10;



    if(
        lastTwo >= 11 &&
        lastTwo <= 19
    )
        return "модов";



    if(last === 1)
        return "мод";



    if(
        last >= 2 &&
        last <= 4
    )
        return "мода";



    return "модов";

}