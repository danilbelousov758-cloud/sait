"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import Link from "next/link";

import Header from "@/components/Header";


type Product = {
    id: number;
    name: string;
    category: string;
    price: number;
    description: string;
    images: string[];
    author_id?: number | null;
};



type User = {
    id:number;
    username:string;
    role?:string;
};



const categories = [
    "Все",
    "Скины",
    "Оружие",
    "Транспорт",
    "Интерьеры",
    "Карты",
    "Графика",
    "Другое",
];



export default function MarketPage(){

    const [products,setProducts] =
        useState<Product[]>([]);


    const [user,setUser] =
        useState<User|null>(null);


    const [search,setSearch] =
        useState("");


    const [category,setCategory] =
        useState("Все");


    const [sort,setSort] =
        useState(
            "new"
        );


    const [loading,setLoading] =
        useState(true);



    useEffect(()=>{

        loadProducts();


        const saved =
            localStorage.getItem(
                "user"
            );


        if(saved){
            setUser(
                JSON.parse(saved)
            );
        }


    },[]);



    async function loadProducts(){

        try{

            const res =
                await fetch(
                    "/api/products",
                    {
                        cache:"no-store"
                    }
                );


            const data =
                await res.json();


            setProducts(
                Array.isArray(
                    data.products
                )
                ?
                data.products
                :
                []
            );


        }catch(error){

            console.error(
                error
            );

        }
        finally{

            setLoading(false);

        }

    }



    const canCreate =
        user?.role === "SELLER" ||
        user?.role === "ADMIN" ||
        user?.role === "FOUNDER";



    const filtered =
        useMemo(()=>{


            let result =
                [...products];



            if(search){

                result =
                    result.filter(
                        item=>
                            item.name
                            .toLowerCase()
                            .includes(
                                search.toLowerCase()
                            )
                            ||
                            item.description
                            .toLowerCase()
                            .includes(
                                search.toLowerCase()
                            )
                    );

            }



            if(
                category !== "Все"
            ){

                result =
                    result.filter(
                        item =>
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

        <Header/>


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


            <div
                className="
                    mb-8
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
                        Торговая площадка
                    </h1>


                    <p
                        className="
                            mt-2
                            text-sm
                            text-slate-500
                        "
                    >
                        Покупка и продажа модификаций MAZEPOV CONNEXTION
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
                            hover:bg-blue-500
                        "
                    >
                        + Создать объявление
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


                <input

                    value={search}

                    onChange={
                        e=>
                        setSearch(
                            e.target.value
                        )
                    }

                    placeholder="
                        Поиск товаров...
                    "

                    className="
                        h-12
                        rounded-xl
                        border
                        border-white/10
                        bg-[#0D1117]
                        px-4
                        text-sm
                        outline-none
                        focus:border-blue-500
                    "

                />




                <div
                    className="
                        flex
                        flex-wrap
                        gap-2
                    "
                >

                {categories.map(item=>(

                    <button

                        key={item}

                        onClick={()=>
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
                                category===item
                                ?
                                "bg-blue-600 text-white"
                                :
                                "bg-[#0D1117] text-slate-400 hover:text-white"
                            }
                        `}

                    >
                        {item}
                    </button>

                ))}

                </div>



                <select

                    value={sort}

                    onChange={
                        e=>
                        setSort(
                            e.target.value
                        )
                    }

                    className="
                        w-fit
                        rounded-xl
                        border
                        border-white/10
                        bg-[#0D1117]
                        px-4
                        py-2
                        text-sm
                        text-slate-300
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





            {
                loading
                ?

                <div
                    className="
                        text-center
                        text-slate-500
                    "
                >
                    Загрузка...
                </div>

                :

                <div
                    className="
                        grid
                        gap-5
                        sm:grid-cols-2
                        lg:grid-cols-3
                    "
                >


                {filtered.map(product=>(


                    <div
                        key={product.id}

                        className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/10
                            bg-[#0D1117]
                        "
                    >


                        <Link
                            href={
                                `/market/${product.id}`
                            }
                        >

                        <div
                            className="
                                aspect-video
                                bg-[#11161D]
                            "
                        >

                        {product.images?.[0]
                        ?

                        <img
                            src={
                                product.images[0]
                            }
                            className="
                                h-full
                                w-full
                                object-contain
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

                            <h2
                                className="
                                    truncate
                                    font-semibold
                                "
                            >
                                {product.name}
                            </h2>


                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                "
                            >
                                {product.category}
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
                                        font-bold
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

                                    href={
                                        `/market/${product.id}`
                                    }

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


                ))}


                </div>

            }


        </div>


        </main>

        </>

    );

}