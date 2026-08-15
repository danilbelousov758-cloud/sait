import Link from "next/link";

import { notFound } from "next/navigation";

import Header from "@/components/Header";
import OrderChat from "@/components/OrderChat";

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
){

    const [
        rows
    ] = await db.execute(

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
    } = await params;



    const orderId =
        Number(id);



    if(
        !Number.isInteger(orderId)
    ){

        notFound();

    }



    const order =
        await getOrder(orderId);



    if(!order){

        notFound();

    }





    const statusText =

        order.status === "WAIT_PAYMENT"

        ?

        "Ожидает подтверждения оплаты"


        :


        order.status === "PAID"

        ?

        "Оплата подтверждена"


        :


        order.status === "COMPLETED"

        ?

        "Заказ завершён"


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
            transition
            hover:text-white
        "

        >

            ← Вернуться в каталог


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



        <div

        className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-start
            sm:justify-between
        "

        >



        <div>


        <h1

        className="
            text-3xl
            font-bold
        "

        >

            {order.product_name}


        </h1>



        <p

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

            {order.seller_name}


        </p>


        </div>





        <div

        className="
            rounded-xl
            bg-blue-500/10
            px-4
            py-2
            text-sm
            font-semibold
            text-blue-400
        "

        >

            {order.price} ₽


        </div>



        </div>









        <div

        className="
            mt-6
            rounded-2xl
            border
            border-yellow-500/20
            bg-yellow-500/[0.08]
            p-5
        "

        >


        <div

        className="
            text-[10px]
            font-semibold
            uppercase
            tracking-widest
            text-yellow-400
        "

        >

            Статус заказа


        </div>



        <div

        className="
            mt-2
            text-lg
            font-semibold
        "

        >

            {statusText}


        </div>


        </div>









        <div

        className="
            mt-6
            grid
            gap-4
            sm:grid-cols-2
        "

        >



        <div

        className="
            rounded-2xl
            border
            border-white/10
            bg-black/20
            p-4
        "

        >

        <div className="text-xs text-slate-600">

            Покупатель

        </div>


        <div className="mt-2 font-semibold">

            {order.buyer_name}

        </div>


        </div>





        <div

        className="
            rounded-2xl
            border
            border-white/10
            bg-black/20
            p-4
        "

        >

        <div className="text-xs text-slate-600">

            Создан

        </div>


        <div className="mt-2 font-semibold">

            {new Date(order.created_at)
                .toLocaleDateString("ru-RU")}

        </div>


        </div>



        </div>








        <OrderChat

            orderId={order.id}

        />








        <div

        className="
            mt-6
            flex
            items-center
            justify-between
            border-t
            border-white/10
            pt-5
        "

        >


        <span className="text-slate-500">

            К оплате

        </span>



        <b

        className="
            text-2xl
            font-bold
        "

        >

            {order.price} ₽


        </b>


        </div>







        </div>





        </div>



        </main>


        </>

    );

}