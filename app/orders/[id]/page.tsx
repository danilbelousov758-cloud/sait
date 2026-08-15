import Link from "next/link";

import { notFound } from "next/navigation";

import Header from "@/components/Header";

import { db } from "@/lib/mysql";



type OrderData = {

    id:number;

    price:number;

    status:string;

    created_at:string;

    product_name:string;

    seller_name:string;

    buyer_name:string;

};



async function getOrder(
    id:number
) {


    const [
        rows
    ] =
        await db.execute(

            `
            SELECT

                o.id,
                o.price,
                o.status,
                o.created_at,


                p.name AS product_name,


                seller.username AS seller_name,


                buyer.username AS buyer_name


            FROM orders o


            JOIN products p

                ON p.id = o.product_id


            JOIN users seller

                ON seller.id = o.seller_id


            JOIN users buyer

                ON buyer.id = o.buyer_id


            WHERE o.id = ?


            LIMIT 1
            `,

            [
                id
            ]

        );



    const result =
        rows as any[];



    if(!result[0]){

        return null;

    }



    return result[0] as OrderData;


}







export default async function OrderPage({

    params

}:{

    params:Promise<{
        id:string;
    }>

}){


    const {
        id
    } =
        await params;



    const orderId =
        Number(id);



    if(
        !Number.isInteger(
            orderId
        )
    ){

        notFound();

    }




    const order =
        await getOrder(
            orderId
        );



    if(!order){

        notFound();

    }





    const statusText =

        order.status === "WAIT_PAYMENT"

            ? "Ожидает подтверждения оплаты"

            :

        order.status === "PAID"

            ? "Оплата подтверждена"

            :

        order.status === "COMPLETED"

            ? "Заказ завершён"

            :

        "Проверка заказа";






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
                        max-w-5xl
                    "

                >



                    <Link

                        href="/catalog"

                        className="
                            text-sm
                            text-slate-500
                            hover:text-white
                        "

                    >

                        ← Каталог


                    </Link>





                    <div

                        className="
                            mt-6
                            rounded-3xl
                            border
                            border-white/10
                            bg-[#0D1117]
                            p-6
                        "

                    >




                        <h1

                            className="
                                text-3xl
                                font-bold
                            "

                        >

                            {
                                order.product_name
                            }


                        </h1>



                        <div

                            className="
                                mt-2
                                text-sm
                                text-slate-500
                            "

                        >

                            Заказ #{order.id}

                            {" · "}

                            Продавец:

                            {" "}

                            {
                                order.seller_name
                            }


                        </div>







                        <div

                            className="
                                mt-6
                                rounded-2xl
                                border
                                border-yellow-500/20
                                bg-yellow-500/10
                                p-5
                            "

                        >


                            <div

                                className="
                                    text-xs
                                    uppercase
                                    tracking-widest
                                    text-yellow-400
                                "

                            >

                                Статус


                            </div>




                            <div

                                className="
                                    mt-2
                                    text-lg
                                    font-semibold
                                "

                            >

                                {
                                    statusText
                                }


                            </div>


                        </div>






                        <section

                            className="
                                mt-6
                                rounded-2xl
                                border
                                border-white/10
                                bg-[#11161D]
                                p-5
                            "

                        >



                            <h2

                                className="
                                    font-semibold
                                "

                            >

                                💬 Чат заказа


                            </h2>




                            <p

                                className="
                                    mt-2
                                    text-sm
                                    text-slate-500
                                "

                            >

                                Сообщения обновляются автоматически


                            </p>





                            <div

                                className="
                                    mt-5
                                    rounded-xl
                                    bg-black/20
                                    p-4
                                    text-sm
                                    text-slate-400
                                "

                            >

                                ℹ️ Заказ создан.
                                Ожидайте подтверждения оплаты
                                администратором.


                            </div>





                        </section>







                        <div

                            className="
                                mt-6
                                flex
                                justify-between
                                border-t
                                border-white/10
                                pt-5
                            "

                        >



                            <span

                                className="
                                    text-slate-500
                                "

                            >

                                К оплате


                            </span>




                            <b

                                className="
                                    text-xl
                                "

                            >

                                {
                                    order.price
                                }

                                ₽


                            </b>




                        </div>





                    </div>





                </div>


            </main>



        </>


    );


}