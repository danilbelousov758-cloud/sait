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



    const result = rows as any[];



    if(!result[0]){

        return null;

    }



    return result[0] as OrderData;


}





function StatusBadge({

    status

}:{

    status:string

}){


    const data = {


        WAIT_PAYMENT:{

            text:"Ожидает оплаты",

            style:
            "bg-blue-500/10 text-blue-400 border-blue-500/20"

        },


        PAID:{

            text:"Оплата подтверждена",

            style:
            "bg-green-500/10 text-green-400 border-green-500/20"

        },


        COMPLETED:{

            text:"Завершён",

            style:
            "bg-purple-500/10 text-purple-400 border-purple-500/20"

        },


        CANCELLED:{

            text:"Отменён",

            style:
            "bg-red-500/10 text-red-400 border-red-500/20"

        }


    }[status] || {


        text:"Проверка",

        style:
        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"

    };



    return (

        <div

        className={`
            rounded-xl
            border
            px-4
            py-2
            text-sm
            font-semibold
            ${data.style}
        `}

        >

            {data.text}


        </div>

    );

}





export default async function OrderPage({

    params

}:{

    params:Promise<{
        id:string
    }>

}){


    const {
        id
    } = await params;



    const orderId =
        Number(id);



    if(!Number.isInteger(orderId)){

        notFound();

    }



    const order =
        await getOrder(orderId);



    if(!order){

        notFound();

    }




    return (

        <>


        <Header />



        <main

        className="
            min-h-screen
            bg-[#05070D]
            px-4
            pt-[120px]
            pb-20
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
            hover:text-white
            transition
        "

        >

            ← Вернуться в каталог


        </Link>







        <div

        className="
            mt-6
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

                    {" • "}

                    Продавец: {order.seller_name}


                </p>


            </div>



            <StatusBadge

                status={order.status}

            />



        </div>







        <div

        className="
            mt-6
            grid
            gap-5
            lg:grid-cols-[1fr_350px]
        "

        >






        <section

        className="
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-[#0D1117]
            min-h-[600px]
        "

        >




            <div

            className="
                border-b
                border-white/10
                px-6
                py-5
            "

            >


                <h2

                className="
                    text-xl
                    font-bold
                "

                >

                    💬 Чат заказа

                </h2>


                <p

                className="
                    mt-1
                    text-sm
                    text-slate-500
                "

                >

                    Сообщения обновляются автоматически

                </p>


            </div>




            <div

            className="
                p-6
            "

            >


                <OrderChat

                    orderId={order.id}

                />


            </div>




        </section>









        <aside

        className="
            h-fit
            rounded-3xl
            border
            border-white/10
            bg-[#0D1117]
            p-6
        "

        >



            <h3

            className="
                text-sm
                text-slate-500
            "

            >

                Цена товара

            </h3>




            <div

            className="
                mt-2
                text-2xl
                font-bold
            "

            >

                {order.price} ₽


            </div>






            <div

            className="
                my-6
                border-t
                border-white/10
            "

            />






            <div

            className="
                space-y-4
            "

            >



                <div>


                    <p

                    className="
                        text-xs
                        text-slate-500
                    "

                    >

                        Продавец

                    </p>


                    <p className="font-semibold">

                        {order.seller_name}

                    </p>


                </div>





                <div>


                    <p

                    className="
                        text-xs
                        text-slate-500
                    "

                    >

                        Покупатель

                    </p>


                    <p className="font-semibold">

                        {order.buyer_name}

                    </p>


                </div>





                <div>


                    <p

                    className="
                        text-xs
                        text-slate-500
                    "

                    >

                        Создан

                    </p>


                    <p className="font-semibold">

                        {new Date(order.created_at)
                        .toLocaleString("ru-RU")}

                    </p>


                </div>



            </div>






            <div

            className="
                mt-6
                rounded-2xl
                bg-blue-500/10
                p-5
            "

            >


                <p

                className="
                    text-sm
                    text-slate-400
                "

                >

                    К оплате

                </p>



                <p

                className="
                    mt-1
                    text-3xl
                    font-bold
                    text-blue-400
                "

                >

                    {order.price} ₽


                </p>



            </div>




        </aside>







        </div>






        </div>



        </main>



        </>

    );

}