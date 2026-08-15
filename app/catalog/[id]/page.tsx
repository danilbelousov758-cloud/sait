import Link from "next/link";
import { notFound } from "next/navigation";

import Header from "@/components/Header";
import BuyModal from "@/components/BuyModal";

import { db } from "@/lib/mysql";


type Product = {

    id: number;

    name: string;

    category: string;

    price: number;

    description: string | null;

    images: string[];

    author_id: number;

};



type Seller = {

    id: number;

    username: string;

    avatar: string | null;

};



async function getProduct(
    id: number
) {


    const [
        rows,
    ] =
        await db.execute(

            `
            SELECT

                p.id,
                p.name,
                p.category,
                p.price,
                p.description,
                p.images,
                p.author_id,

                u.id AS seller_id,
                u.username,
                u.avatar


            FROM products p


            JOIN users u

                ON u.id = p.author_id


            WHERE p.id = ?


            LIMIT 1
            `,

            [
                id,
            ]

        );



    const result =
        rows as any[];



    if (!result[0]) {

        return null;

    }



    const item =
        result[0];



    let images: string[] = [];



    try {

        if (
            Array.isArray(
                item.images
            )
        ) {

            images =
                item.images;

        } else {

            images =
                JSON.parse(
                    item.images || "[]"
                );

        }

    } catch {

        images = [];

    }



    return {


        product: {

            id:
                item.id,

            name:
                item.name,

            category:
                item.category,

            price:
                item.price,

            description:
                item.description,

            images,

            author_id:
                item.author_id,

        } as Product,



        seller: {

            id:
                item.seller_id,

            username:
                item.username,

            avatar:
                item.avatar,

        } as Seller,


    };


}





export default async function ProductPage({

    params,

}: {

    params: Promise<{
        id: string;
    }>;

}) {


    const {
        id,
    } =
        await params;



    const productId =
        Number(id);



    if (

        !Number.isInteger(
            productId
        )

    ) {

        notFound();

    }



    const data =
        await getProduct(
            productId
        );



    if (!data) {

        notFound();

    }



    const {

        product,

        seller,

    } =
        data;



    const image =
        product.images?.[0] || null;




    return (

        <>


            <Header />



            <main

                className="
                    min-h-screen
                    bg-[#080B10]
                    px-4
                    pb-20
                    pt-[120px]
                    text-white
                "

            >


                <div

                    className="
                        mx-auto
                        max-w-6xl
                    "

                >



                    <Link

                        href="/catalog"

                        className="
                            text-sm
                            text-slate-500
                            transition
                            hover:text-white
                        "

                    >

                        ← Назад


                    </Link>




                    <div

                        className="
                            mt-6
                            grid
                            gap-6
                            lg:grid-cols-[1fr_380px]
                        "

                    >




                        <section

                            className="
                                rounded-3xl
                                border
                                border-white/[0.07]
                                bg-[#0D1117]
                                p-6
                            "

                        >



                            {
                                image && (


                                    <img

                                        src={
                                            image
                                        }

                                        alt={
                                            product.name
                                        }

                                        className="
                                            aspect-video
                                            w-full
                                            rounded-2xl
                                            object-cover
                                        "

                                    />


                                )
                            }




                            <div

                                className="
                                    mt-6
                                "

                            >


                                <div

                                    className="
                                        text-xs
                                        uppercase
                                        tracking-widest
                                        text-blue-500
                                    "

                                >

                                    MAZEPOV CONNEXTION


                                </div>




                                <h1

                                    className="
                                        mt-2
                                        text-3xl
                                        font-bold
                                    "

                                >

                                    {
                                        product.name
                                    }


                                </h1>




                                <div

                                    className="
                                        mt-3
                                        text-sm
                                        text-slate-500
                                    "

                                >

                                    Категория:

                                    {" "}

                                    {
                                        product.category
                                    }


                                </div>





                                <p

                                    className="
                                        mt-5
                                        leading-7
                                        text-slate-300
                                    "

                                >

                                    {
                                        product.description ||
                                        "Описание отсутствует"
                                    }


                                </p>



                            </div>




                        </section>






                        <aside

                            className="
                                h-fit
                                rounded-3xl
                                border
                                border-white/[0.07]
                                bg-[#0D1117]
                                p-6
                            "

                        >





                            <div

                                className="
                                    flex
                                    items-center
                                    gap-3
                                "

                            >



                                {

                                    seller.avatar && (

                                        <img

                                            src={
                                                seller.avatar
                                            }

                                            alt=""
                                            
                                            className="
                                                h-12
                                                w-12
                                                rounded-full
                                                object-cover
                                            "

                                        />

                                    )

                                }





                                <div>


                                    <div

                                        className="
                                            text-xs
                                            text-slate-500
                                        "

                                    >

                                        Продавец


                                    </div>



                                    <div

                                        className="
                                            font-semibold
                                        "

                                    >

                                        {
                                            seller.username
                                        }


                                    </div>



                                </div>



                            </div>







                            <div

                                className="
                                    mt-6
                                    rounded-2xl
                                    bg-black/20
                                    p-5
                                "

                            >



                                <div

                                    className="
                                        text-sm
                                        text-slate-500
                                    "

                                >

                                    Цена


                                </div>




                                <div

                                    className="
                                        mt-1
                                        text-3xl
                                        font-bold
                                    "

                                >

                                    {
                                        product.price
                                    }

                                    ₽


                                </div>




                            </div>






                            <BuyModal


                                productId={
                                    product.id
                                }


                                productName={
                                    product.name
                                }


                                sellerName={
                                    seller.username
                                }


                                price={
                                    product.price
                                }


                            />




                        </aside>





                    </div>




                </div>



            </main>



        </>

    );


}