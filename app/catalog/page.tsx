"use client";

import Link from "next/link";
import {
    useEffect,
    useState,
} from "react";

import Header from "@/components/Header";


type User = {
    id:number;
    username:string;
    avatar?:string|null;
    role?:string;
};



type Product = {
    id:number;
    name:string;
    category:string;
    price:number;
    description:string;
    images:string[];
    dff_file:string;
    txd_file:string;
};



type CatalogItem = {
    name:string;
    children?:CatalogItem[];
};



const expandableCategories:CatalogItem[] = [

    {
        name:"Скины",

        children:[

            {
                name:"Государственные"
            },

            {
                name:"Мафии"
            },

            {
                name:"Банды"
            },

            {
                name:"Гражданские"
            },

        ],
    },



    {
        name:"Оружие",

        children:[

            {
                name:"Ганпак"
            },

            {
                name:"Дигл"
            },

            {
                name:"ЮСП"
            },

            {
                name:"Револьвер"
            },

            {
                name:"АПС"
            },

            {
                name:"СВД ПСО"
            },

            {
                name:"СВД"
            },

            {
                name:"M4A4"
            },

            {
                name:"Абакан"
            },

            {
                name:"АС ВАЛ"
            },

            {
                name:"Гроза"
            },

            {
                name:"Дробовик"
            },

        ],
    },



    {
        name:"Интерьеры",

        children:[

            {
                name:"24/7"
            },

            {
                name:"ДПС / ППС / ФСБ"
            },

            {
                name:"Оружейка"
            },

            {
                name:"Ашан"
            },

            {
                name:"Аптека"
            },

            {
                name:"ПК клуб"
            },

            {
                name:"Особа"
            },

            {
                name:"Банк"
            },

        ],
    },


    {
        name:"Заменные территории",

        children:[

            {
                name:"ЦР"
            },

            {
                name:"ФСИН"
            },

            {
                name:"Арзамас"
            },

            {
                name:"Батырево"
            },

            {
                name:"Южный"
            },

            {
                name:"Бизвар локации"
            },

            {
                name:"Вокзалы"
            },

        ],
    },


    {
        name:"Эффекты",

        children:[

            {
                name:"Кровь"
            },

            {
                name:"Эффект при попадании"
            },


            {
                name:"Эффект при убийстве и ноке",

                children:[

                    {
                        name:"ld_bum"
                    }

                ]
            }

        ]
    },


    {
        name:"Звуки",

        children:[

            {
                name:"Попадание",

                children:[

                    {
                        name:"Пистолеты",

                        children:[

                            {
                                name:"M4A4"
                            },

                            {
                                name:"Абакан"
                            },

                            {
                                name:"Гроза"
                            },

                        ]
                    }

                ]

            }

        ]

    },


];



const simpleCategories=[

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



export default function CatalogPage(){


    const [user,setUser]=useState<User|null>(null);



    const [products,setProducts]=useState<Product[]>([]);



    const [selectedCategory,setSelectedCategory]=useState(
        "Все моды"
    );



    const [openCategories,setOpenCategories]=useState<string[]>([
        "Скины"
    ]);



    const [search,setSearch]=useState("");



    useEffect(()=>{


        try{

            const saved =
                localStorage.getItem(
                    "user"
                );


            if(saved){

                setUser(
                    JSON.parse(saved)
                );

            }


        }catch{

            setUser(null);

        }



        loadProducts();



    },[]);




    async function loadProducts(){


        try{


            const response =
                await fetch(
                    "/api/products"
                );


            const data =
                await response.json();



            if(Array.isArray(data)){

                setProducts(
                    data
                );

            }



        }catch(error){

            console.error(
                error
            );

        }


    }

        const role =
        user?.role?.toUpperCase() || "USER";



    const canCreateProduct =
        role === "SELLER" ||
        role === "ADMIN" ||
        role === "FOUNDER";




    function toggleCategory(
        name:string
    ){


        setSelectedCategory(
            name
        );


        setOpenCategories(
            current =>

                current.includes(name)

                ?

                current.filter(
                    item =>
                        item !== name
                )

                :

                [
                    ...current,
                    name
                ]

        );

    }





    function selectCategory(
        name:string
    ){

        setSelectedCategory(
            name
        );

    }





    const filteredProducts =
        products.filter(
            product => {


                if(
                    selectedCategory === "Все моды"
                ){

                    return true;

                }



                return (
                    product.category
                        .toLowerCase()
                        .includes(
                            selectedCategory.toLowerCase()
                        )
                );


            }
        )
        .filter(
            product =>

                product.name
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )

        );







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

                item.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )

        );





    return (

        <>

            <Header/>


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
                        mx-auto
                        max-w-7xl
                    "
                >



                    <div
                        className="
                            mb-7
                            flex
                            items-end
                            justify-between
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

                                Моды MAZEPOV CONNEXTION

                            </p>


                        </div>




                        {
                            canCreateProduct &&

                            (

                                <Link

                                    href="/catalog/create"

                                    className="
                                        rounded-xl
                                        bg-blue-600
                                        px-5
                                        py-3
                                        text-sm
                                        font-semibold
                                        hover:bg-blue-500
                                    "

                                >

                                    + Создать товар

                                </Link>

                            )

                        }


                    </div>





                    <div
                        className="
                            mb-5
                            max-w-xl
                        "
                    >

                        <input

                            value={
                                search
                            }


                            onChange={
                                e =>
                                    setSearch(
                                        e.target.value
                                    )
                            }


                            placeholder="
                                Поиск по каталогу...
                            "


                            className="
                                h-12
                                w-full
                                rounded-xl
                                border
                                border-white/10
                                bg-[#0D1117]
                                px-4
                                outline-none
                                focus:border-blue-500
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

                                onClick={()=>
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


                                    ${
                                        selectedCategory === "Все моды"

                                        ?

                                        "bg-blue-600 text-white"

                                        :

                                        "text-slate-400 hover:bg-white/5"

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





                            {
                                filteredMainCategories.map(
                                    category =>


                                        <CategoryTree

                                            key={
                                                category.name
                                            }


                                            item={
                                                category
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

                            }





                            <div
                                className="
                                    my-4
                                    h-px
                                    bg-white/10
                                "
                            />





                            {
                                filteredSimple.map(
                                    category =>


                                    (

                                        <button

                                            key={
                                                category
                                            }


                                            onClick={()=>
                                                selectCategory(
                                                    category
                                                )
                                            }


                                            className={`

                                                mb-1
                                                w-full
                                                rounded-xl
                                                px-3
                                                py-2
                                                text-left
                                                text-sm


                                                ${
                                                    selectedCategory===category

                                                    ?

                                                    "bg-blue-600 text-white"

                                                    :

                                                    "text-slate-400 hover:bg-white/5"

                                                }

                                            `}


                                        >

                                            {category}


                                        </button>


                                    )

                                )

                            }



                        </aside>

                                                <section>

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

                                        {filteredProducts.length} модов

                                    </div>


                                </div>





                                {
                                    filteredProducts.length === 0

                                    ?

                                    (

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

                                    )


                                    :

                                    (

                                        <div
                                            className="
                                                grid
                                                gap-5
                                                sm:grid-cols-2
                                                xl:grid-cols-3
                                            "
                                        >


                                            {
                                                filteredProducts.map(
                                                    product =>


                                                    (

                                                        <div

                                                            key={
                                                                product.id
                                                            }

                                                            className="
                                                                overflow-hidden
                                                                rounded-2xl
                                                                border
                                                                border-white/10
                                                                bg-[#11161D]
                                                            "

                                                        >



                                                            <ProductImage

                                                                src={
                                                                    product.images?.[0]
                                                                }

                                                                alt={
                                                                    product.name
                                                                }

                                                            />



                                                            <div
                                                                className="
                                                                    p-4
                                                                "
                                                            >


                                                                <h3
                                                                    className="
                                                                        font-semibold
                                                                        text-white
                                                                    "
                                                                >

                                                                    {product.name}

                                                                </h3>



                                                                <p
                                                                    className="
                                                                        mt-2
                                                                        text-sm
                                                                        text-slate-500
                                                                    "
                                                                >

                                                                    {product.description}

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
                                                                        "

                                                                    >

                                                                        Подробнее

                                                                    </Link>


                                                                </div>


                                                            </div>



                                                        </div>


                                                    )

                                                )

                                            }


                                        </div>

                                    )

                                }



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

    selectedCategory:string;

    setSelectedCategory:
        (
            name:string
        )=>void;


    openCategories:string[];

    setOpenCategories:
        React.Dispatch<
            React.SetStateAction<string[]>
        >;

};




function CategoryTree({

    item,

    selectedCategory,

    setSelectedCategory,

    openCategories,

    setOpenCategories,

}:CategoryTreeProps){



    const hasChildren =
        Boolean(
            item.children?.length
        );



    const open =
        openCategories.includes(
            item.name
        );



    const active =
        selectedCategory === item.name;



    function click(){


        setSelectedCategory(
            item.name
        );


        if(hasChildren){


            setOpenCategories(
                current =>

                    current.includes(
                        item.name
                    )

                    ?

                    current.filter(
                        x =>
                            x !== item.name
                    )

                    :

                    [
                        ...current,
                        item.name
                    ]
            );

        }

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


                    ${
                        active

                        ?

                        "bg-blue-600 text-white"

                        :

                        "text-slate-400 hover:bg-white/5"

                    }

                `}

            >

                <span>
                    {item.name}
                </span>


                {
                    hasChildren &&

                    <span>

                        {open ? "⌄" : "›"}

                    </span>

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
                            item.children!.map(
                                child =>


                                    <CategoryTree

                                        key={
                                            child.name
                                        }

                                        item={
                                            child
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
                        }


                    </div>

                )

            }


        </div>

    );


}





type ProductImageProps = {

    src?:string;

    alt:string;

};




function ProductImage({

    src,

    alt,

}:ProductImageProps){



    if(!src){


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

        <img

            src={src}

            alt={alt}

            className="
                h-44
                w-full
                object-cover
            "

        />

    );


}