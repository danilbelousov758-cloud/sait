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



async function getOrder(id:number){

    const [rows] = await db.execute(

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

        [id]

    );


    const order = rows as any[];


    if(!order[0]){

        return null;

    }


    return order[0] as OrderData;

}





function getStatus(status:string){


    switch(status){


        case "WAIT_PAYMENT":

            return {

                text:"Ожидает оплаты",

                color:"yellow"

            };


        case "PAID":

            return {

                text:"Оплата подтверждена",

                color:"blue"

            };


        case "COMPLETED":

            return {

                text:"Заказ завершён",

                color:"green"

            };


        default:

            return {

                text:"Проверка заказа",

                color:"slate"

            };

    }

}





export default async function OrderPage({

    params

}:{

    params:Promise<{
        id:string
    }>

}){


    const {id} = await params;


    const orderId = Number(id);



    if(!Number.isInteger(orderId)){

        notFound();

    }



    const order = await getOrder(orderId);



    if(!order){

        notFound();

    }



    const status = getStatus(order.status);





    return (

        <>


        <Header />



        <main className="
            min-h-screen
            bg-[#070A0F]
            px-4
            pt-28
            pb-20
            text-white
        ">



        <div className="
            mx-auto
            max-w-5xl
        ">



        <Link

            href="/catalog"

            className="
                text-sm
                text-slate-500
                hover:text-white
                transition
            "

        >

            ← Назад в каталог


        </Link>





        <section className="
            mt-6
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-[#0D1117]
        ">



        <div className="
            p-6
        ">



        <div className="
            flex
            flex-col
            gap-5
            md:flex-row
            md:items-center
            md:justify-between
        ">



        <div>


        <h1 className="
            text-3xl
            font-bold
        ">

            {order.product_name}

        </h1>


        <p className="
            mt-2
            text-sm
            text-slate-500
        ">

            Заказ #{order.id}

        </p>


        </div>





        <div className="
            rounded-2xl
            bg-blue-500/10
            px-6
            py-4
            text-right
        ">

            <div className="
                text-xs
                text-slate-400
            ">

                Сумма заказа

            </div>


            <div className="
                text-3xl
                font-bold
                text-blue-400
            ">

                {order.price} ₽

            </div>


        </div>



        </div>







        <div className={`
            mt-6
            rounded-2xl
            border
            p-5

            ${
                status.color==="yellow"

                ?

                "border-yellow-500/30 bg-yellow-500/10"

                :

                status.color==="blue"

                ?

                "border-blue-500/30 bg-blue-500/10"

                :

                status.color==="green"

                ?

                "border-green-500/30 bg-green-500/10"

                :

                "border-white/10 bg-white/5"

            }
        `}>


            <p className="
                text-xs
                uppercase
                tracking-widest
                text-slate-400
            ">

                Статус

            </p>


            <h2 className="
                mt-2
                text-xl
                font-semibold
            ">

                {status.text}

            </h2>


        </div>







        <div className="
            mt-6
            grid
            gap-4
            md:grid-cols-2
        ">



            <div className="
                rounded-2xl
                border
                border-white/10
                bg-black/20
                p-5
            ">


                <p className="
                    text-xs
                    text-slate-500
                ">

                    Участники сделки

                </p>



                <div className="
                    mt-4
                    space-y-3
                ">


                    <div>

                        <span className="
                            text-slate-500
                            text-sm
                        ">

                            Продавец

                        </span>


                        <p className="font-semibold">

                            {order.seller_name}

                        </p>

                    </div>



                    <div>

                        <span className="
                            text-slate-500
                            text-sm
                        ">

                            Покупатель

                        </span>


                        <p className="font-semibold">

                            {order.buyer_name}

                        </p>

                    </div>


                </div>


            </div>






            <div className="
                rounded-2xl
                border
                border-white/10
                bg-black/20
                p-5
            ">


                <p className="
                    text-xs
                    text-slate-500
                ">

                    Информация

                </p>


                <div className="
                    mt-4
                ">


                    <span className="
                        text-slate-500
                        text-sm
                    ">

                        Создан

                    </span>


                    <p className="font-semibold">

                        {new Date(order.created_at)
                        .toLocaleString("ru-RU")}

                    </p>


                </div>


            </div>



        </div>






        <div className="
            mt-8
        ">

            <OrderChat

                orderId={order.id}

            />

        </div>







        <div className="
            mt-8
            flex
            items-center
            justify-between
            border-t
            border-white/10
            pt-6
        ">


            <span className="
                text-slate-400
            ">

                К оплате

            </span>



            <strong className="
                text-3xl
            ">

                {order.price} ₽

            </strong>


        </div>




        </div>


        </section>


        </div>


        </main>


        </>

    );

}