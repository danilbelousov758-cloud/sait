"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import Link from "next/link";

import Header from "@/components/Header";



type User = {
    id:number;
    username:string;
    role?:string;
};



type MarketProduct = {
    id:number;
    name:string;
    category:string;
    price:number;
    description:string;
    images:string[];
    author_id:number;
    author_name?:string;
    status:string;
    created_at?:string;
};



const categories = [
    "Все",
    "Сборки",
    "АХК",
    "Скрипты",
    "PRIVAT BLOCK",
];



export default function MarketPage(){


    const [user,setUser] =
        useState<User|null>(null);



    const [products,setProducts] =
        useState<MarketProduct[]>([]);



    const [search,setSearch] =
        useState("");



    const [category,setCategory] =
        useState(
            "Все"
        );



    const [sort,setSort] =
        useState(
            "new"
        );



    const [loading,setLoading] =
        useState(true);



    const [error,setError] =
        useState("");




    useEffect(()=>{


        loadUser();

        loadMarket();



        window.addEventListener(
            "userUpdated",
            loadUser
        );



        return()=>{

            window.removeEventListener(
                "userUpdated",
                loadUser
            );

        };


    },[]);





    function loadUser(){


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


    }






    async function loadMarket(){


        try{


            setLoading(true);

            setError("");



            const response =
                await fetch(
                    "/api/market",
                    {
                        cache:"no-store",
                    }
                );



            const data =
                await response.json();



            if(!response.ok){

                throw new Error(
                    data?.message ||
                    "Ошибка загрузки товаров"
                );

            }




            setProducts(

                Array.isArray(
                    data.products
                )
                ?
                data.products
                :
                []

            );



        }catch(err){


            console.error(
                err
            );


            setError(
                err instanceof Error
                ?
                err.message
                :
                "Ошибка загрузки"
            );

            setProducts([]);


        }
        finally{


            setLoading(false);


        }


    }






    const role =
        user?.role?.toUpperCase()
        ||
        "USER";




    const canCreate =
        role==="SELLER" ||
        role==="ADMIN" ||
        role==="FOUNDER";





    const filteredProducts =
        useMemo(()=>{


            let result =
                [...products];



            const text =
                search
                .trim()
                .toLowerCase();




            if(text){


                result =
                    result.filter(
                        item=>

                            item.name
                            .toLowerCase()
                            .includes(text)

                            ||

                            item.description
                            .toLowerCase()
                            .includes(text)

                    );


            }




            if(
                category !== "Все"
            ){


                result =
                    result.filter(
                        item=>

                            item.category
                            ===
                            category

                    );


            }





            if(sort==="cheap"){


                result.sort(
                    (a,b)=>
                        a.price-b.price
                );


            }




            if(sort==="expensive"){


                result.sort(
                    (a,b)=>
                        b.price-a.price
                );


            }



            return result;



        },[
            products,
            search,
            category,
            sort
        ]);


    return (

        <>

            <Header />


            <main
                className="
                    min-h-screen
                    px-4
                    pb-20
                    pt-[150px]
                    text-white
                "
            >


                <div
                    className="
                        mx-auto
                        max-w-7xl
                    "
                >


                    {/* Заголовок */}

                    <div
                        className="
                            mb-8
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
                                "
                            >
                                Торговая площадка
                            </h1>


                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Покупка и продажа сборок, АХК, скриптов и PRIVAT BLOCK
                            </p>


                        </div>




                        {canCreate && (

                            <Link
                                href="/market/create"
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
                                + Разместить товар
                            </Link>

                        )}


                    </div>





                    {/* Поиск */}

                    <div
                        className="
                            mb-5
                            rounded-2xl
                            border
                            border-white/10
                            bg-[#0D1117]
                            p-4
                        "
                    >

                        <input

                            value={search}

                            onChange={
                                e =>
                                setSearch(
                                    e.target.value
                                )
                            }

                            placeholder="Поиск товаров..."

                            className="
                                h-12
                                w-full
                                rounded-xl
                                border
                                border-white/10
                                bg-[#11161D]
                                px-4
                                text-sm
                                text-white
                                outline-none
                                placeholder:text-slate-700
                                focus:border-blue-500
                            "

                        />


                    </div>





                    {/* Фильтры */}

                    <div
                        className="
                            mb-6
                            flex
                            flex-wrap
                            items-center
                            justify-between
                            gap-3
                        "
                    >


                        <div
                            className="
                                flex
                                flex-wrap
                                gap-2
                            "
                        >

                            {categories.map(
                                item => (

                                    <button

                                        key={item}

                                        type="button"

                                        onClick={() =>
                                            setCategory(
                                                item
                                            )
                                        }

                                        className={`
                                            rounded-xl
                                            px-4
                                            py-2
                                            text-sm
                                            transition

                                            ${
                                                category === item
                                                ?
                                                "bg-blue-600 text-white"
                                                :
                                                "border border-white/10 bg-[#0D1117] text-slate-400 hover:text-white"
                                            }
                                        `}

                                    >

                                        {item}

                                    </button>

                                )
                            )}

                        </div>




                        <select

                            value={sort}

                            onChange={
                                e =>
                                setSort(
                                    e.target.value
                                )
                            }

                            className="
                                rounded-xl
                                border
                                border-white/10
                                bg-[#0D1117]
                                px-4
                                py-2
                                text-sm
                                text-slate-300
                                outline-none
                            "

                        >

                            <option value="new">
                                Новые
                            </option>


                            <option value="cheap">
                                Дешевле
                            </option>


                            <option value="expensive">
                                Дороже
                            </option>


                        </select>


                    </div>






                    {/* Контент */}


                    {loading ? (


                        <div
                            className="
                                flex
                                min-h-[300px]
                                items-center
                                justify-center
                                text-sm
                                text-slate-600
                            "
                        >

                            Загрузка товаров...

                        </div>



                    ) : error ? (


                        <div
                            className="
                                rounded-2xl
                                border
                                border-red-500/20
                                bg-red-500/5
                                p-6
                                text-center
                                text-sm
                                text-red-300
                            "
                        >

                            {error}

                        </div>



                    ) : filteredProducts.length === 0 ? (


                        <div
                            className="
                                rounded-2xl
                                border
                                border-white/10
                                bg-[#0D1117]
                                p-10
                                text-center
                            "
                        >

                            <div
                                className="
                                    text-lg
                                    font-semibold
                                "
                            >
                                Товаров нет
                            </div>


                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-slate-600
                                "
                            >
                                В данной категории пока ничего нет
                            </p>


                        </div>



                    ) : (


                        <div
                            className="
                                grid
                                gap-5
                                sm:grid-cols-2
                                lg:grid-cols-3
                            "
                        >


                            {filteredProducts.map(
                                product => (


                                    <MarketCard

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


            </main>


        </>

    );

}

type MarketCardProps = {
    product: MarketProduct;
};



function MarketCard({
    product,
}: MarketCardProps){


    const image =
        product.images &&
        product.images.length > 0
        ?
        product.images[0]
        :
        null;



    return (

        <div
            className="
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-[#0D1117]
                transition
                hover:border-white/20
                hover:-translate-y-0.5
            "
        >



            <Link
                href={`/market/${product.id}`}
            >

                <div
                    className="
                        aspect-video
                        overflow-hidden
                        bg-[#11161D]
                    "
                >

                    {image ? (

                        <img
                            src={image}
                            alt={product.name}
                            className="
                                h-full
                                w-full
                                object-contain
                                transition
                                duration-300
                                hover:scale-[1.02]
                            "
                        />

                    ) : (

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

                    )}

                </div>

            </Link>




            <div
                className="
                    p-4
                "
            >


                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-3
                    "
                >


                    <h2
                        className="
                            truncate
                            text-sm
                            font-semibold
                            text-white
                        "
                        title={product.name}
                    >
                        {product.name}
                    </h2>



                    <span
                        className="
                            shrink-0
                            rounded-lg
                            bg-white/5
                            px-2
                            py-1
                            text-xs
                            font-semibold
                            text-slate-300
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


                </div>





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
                        border-t
                        border-white/[0.06]
                        pt-3
                    "
                >


                    <div>

                        <div
                            className="
                                text-[11px]
                                text-slate-600
                            "
                        >
                            Автор
                        </div>


                        <div
                            className="
                                text-xs
                                text-slate-300
                            "
                        >
                            {
                                product.author_name ||
                                "Пользователь"
                            }
                        </div>

                    </div>





                    <Link
                        href={`/market/${product.id}`}
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