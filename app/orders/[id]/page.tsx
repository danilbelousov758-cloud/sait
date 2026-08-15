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







function StatusTag({

    status

}:{

    status:string

}){


    const list:any = {


        WAIT_PAYMENT:{

            text:"Ожидает оплаты",

            style:
            "bg-blue-500/10 text-blue-400 border-blue-500/20"

        },


        REVIEW:{

            text:"Проверка администратора",

            style:
            "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"

        },


        APPROVED:{

            text:"Одобрено",

            style:
            "bg-green-500/10 text-green-400 border-green-500/20"

        },


        REJECTED:{

            text:"Отказано",

            style:
            "bg-red-500/10 text-red-400 border-red-500/20"

        },


    };



    const current = list[status] || {

        text:"Проверка",

        style:
        "bg-white/5 text-slate-400 border-white/10"

    };




    return (

        <span

        className={`
            inline-flex
            items-center
            rounded-full
            border
            px-3
            py-1
            text-xs
            font-medium
            ${current.style}
        `}

        >

            {current.text}


        </span>

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




    const orderId = Number(id);




    if(!Number.isInteger(orderId)){


        notFound();


    }




    const order = await getOrder(orderId);




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

            ← Каталог


        </Link>








        <div

        className="
            mt-6
            rounded-2xl
            border
            border-white/10
            bg-[#0B0F16]
            p-5
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
                    text-xl
                    font-semibold
                "

                >

                    {order.product_name}


                </h1>



                <p

                className="
                    mt-1
                    text-sm
                    text-slate-500
                "

                >

                    Заказ #{order.id}

                    {" • "}

                    Продавец {order.seller_name}


                </p>


            </div>





            <StatusTag

                status={order.status}

            />




        </div>









        <div

        className="
            mt-5
            grid
            gap-5
            lg:grid-cols-[1fr_260px]
        "

        >







        <div

        className="
            min-h-[520px]
            overflow-hidden
            rounded-xl
            border
            border-white/10
            bg-black/20
        "

        >


            <div

            className="
                border-b
                border-white/10
                px-5
                py-4
            "

            >

                <h2

                className="
                    text-sm
                    font-semibold
                "

                >

                    💬 Чат заказа


                </h2>


                <p

                className="
                    mt-1
                    text-xs
                    text-slate-500
                "

                >

                    Сообщения обновляются автоматически


                </p>


            </div>





            <div

            className="
                p-4
            "

            >

                <OrderChat

                    orderId={order.id}

                />


            </div>




        </div>










        <aside

        className="
            h-fit
            rounded-xl
            border
            border-white/10
            bg-[#0D1117]
            p-4
        "

        >




            <p

            className="
                text-xs
                text-slate-500
            "

            >

                Цена товара


            </p>



            <p

            className="
                mt-1
                text-2xl
                font-bold
            "

            >

                {order.price} ₽


            </p>







            <div

            className="
                my-4
                border-t
                border-white/10
            "

            />






            <div

            className="
                space-y-3
                text-sm
            "

            >



                <div>

                    <span className="
                        text-slate-500
                    ">

                        Покупатель

                    </span>


                    <p className="
                        font-medium
                    ">

                        {order.buyer_name}


                    </p>


                </div>





                <div>

                    <span className="
                        text-slate-500
                    ">

                        Создан


                    </span>


                    <p className="
                        font-medium
                    ">

                        {new Date(order.created_at)
                        .toLocaleString("ru-RU")}


                    </p>


                </div>



            </div>








            <div

            className="
                mt-5
                rounded-lg
                bg-white/5
                p-3
            "

            >

                <p

                className="
                    text-xs
                    text-slate-500
                "

                >

                    К оплате


                </p>


                <p

                className="
                    mt-1
                    text-xl
                    font-bold
                "

                >

                    {order.price} ₽


                </p>


            </div>





        </aside>








        </div>






        </div>






        </div>






        </main>



        </>

    );


}
