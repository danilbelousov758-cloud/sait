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


    const statuses:any = {


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
            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"

        },


        REJECTED:{

            text:"Отказано",

            style:
            "bg-red-500/10 text-red-400 border-red-500/20"

        }

    };



    const current =
        statuses[status] || {

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
                px-4
                py-1.5
                text-xs
                font-medium
                backdrop-blur
                ${current.style}
            `}

        >

            {current.text}

        </span>

    );


}









function OrderProgress({

    status

}:{

    status:string

}){


    const steps = [

        {

            title:"Создан",

            active:true

        },

        {

            title:"Проверка",

            active:[
                "REVIEW",
                "APPROVED",
                "REJECTED"
            ].includes(status)

        },

        {

            title:"Завершение",

            active:[
                "APPROVED",
                "REJECTED"
            ].includes(status)

        }

    ];




    return (

        <div

            className="
                mt-6
                rounded-xl
                border
                border-white/5
                bg-white/[0.02]
                p-4
            "

        >

            <div

                className="
                    flex
                    items-center
                    justify-between
                "

            >

                {
                    steps.map((step,index)=>(

                        <div

                            key={step.title}

                            className="
                                flex
                                flex-1
                                items-center
                            "

                        >


                            <div

                                className="
                                    flex
                                    flex-col
                                    items-center
                                "

                            >

                                <div

                                    className={`
                                        h-3
                                        w-3
                                        rounded-full
                                        ${
                                            step.active
                                            ?
                                            "bg-blue-400 shadow-lg shadow-blue-500/40"
                                            :
                                            "bg-white/20"
                                        }
                                    `}

                                />


                                <span

                                    className="
                                        mt-2
                                        text-[11px]
                                        text-slate-500
                                    "

                                >

                                    {step.title}

                                </span>


                            </div>



                            {
                                index !== steps.length - 1 && (

                                    <div

                                        className="
                                            mx-3
                                            h-px
                                            flex-1
                                            bg-white/10
                                        "

                                    />

                                )
                            }



                        </div>

                    ))
                }


            </div>


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

                    ← Вернуться в каталог

                </Link>






                <section

                    className="
                        mt-6
                        overflow-hidden
                        rounded-3xl
                        border
                        border-white/10
                        bg-[#0B0F16]
                        p-6
                        shadow-2xl
                        shadow-black/20
                    "

                >





                    <div

                        className="
                            flex
                            flex-col
                            gap-5
                            md:flex-row
                            md:items-start
                            md:justify-between
                        "

                    >



                        <div>


                            <div

                                className="
                                    flex
                                    items-center
                                    gap-3
                                "

                            >


                                <h1

                                    className="
                                        text-2xl
                                        font-semibold
                                        tracking-tight
                                    "

                                >

                                    {order.product_name}


                                </h1>


                            </div>



                            <div

                                className="
                                    mt-2
                                    flex
                                    flex-wrap
                                    gap-2
                                    text-sm
                                    text-slate-500
                                "

                            >


                                <span>

                                    Заказ #{order.id}

                                </span>


                                <span>

                                    •

                                </span>


                                <span>

                                    Продавец {order.seller_name}

                                </span>


                            </div>



                        </div>





                        <StatusTag

                            status={order.status}

                        />



                    </div>






                    <OrderProgress

                        status={order.status}

                    />









                    <div

                        className="
                            mt-6
                            grid
                            gap-6
                            lg:grid-cols-[1fr_320px]
                        "

                    >







                        <div

                            className="
                                overflow-hidden
                                rounded-2xl
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

                                    Общение по покупке и передача файлов

                                </p>



                            </div>







                            <div

                                className="
                                    min-h-[520px]
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
                                rounded-2xl
                                border
                                border-white/10
                                bg-[#0D1117]
                                p-5
                            "

                        >



                            <p

                                className="
                                    text-xs
                                    uppercase
                                    tracking-wider
                                    text-slate-500
                                "

                            >

                                Стоимость


                            </p>




                            <div

                                className="
                                    mt-2
                                    flex
                                    items-end
                                    gap-2
                                "

                            >


                                <span

                                    className="
                                        text-3xl
                                        font-bold
                                    "

                                >

                                    {order.price}

                                </span>


                                <span

                                    className="
                                        mb-1
                                        text-slate-400
                                    "

                                >

                                    ₽

                                </span>


                            </div>






                            <div

                                className="
                                    my-5
                                    h-px
                                    bg-white/10
                                "

                            />







                            <div

                                className="
                                    space-y-5
                                    text-sm
                                "

                            >




                                <div>


                                    <p

                                        className="
                                            text-xs
                                            text-slate-500
                                        "

                                    >

                                        Покупатель


                                    </p>



                                    <p

                                        className="
                                            mt-1
                                            font-medium
                                        "

                                    >

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

                                        Дата создания


                                    </p>



                                    <p

                                        className="
                                            mt-1
                                            font-medium
                                        "

                                    >


                                        {
                                            new Date(order.created_at)
                                            .toLocaleString(
                                                "ru-RU"
                                            )
                                        }


                                    </p>



                                </div>





                            </div>

                                                        <div

                                className="
                                    mt-6
                                    rounded-xl
                                    border
                                    border-white/10
                                    bg-white/[0.03]
                                    p-4
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






                            {
                                order.status === "APPROVED" && (

                                    <div

                                        className="
                                            mt-4
                                            rounded-xl
                                            border
                                            border-emerald-500/20
                                            bg-emerald-500/10
                                            p-4
                                        "

                                    >

                                        <p

                                            className="
                                                text-sm
                                                font-medium
                                                text-emerald-400
                                            "

                                        >

                                            ✓ Заказ одобрен


                                        </p>


                                        <p

                                            className="
                                                mt-1
                                                text-xs
                                                text-emerald-300/70
                                            "

                                        >

                                            Покупка успешно завершена


                                        </p>


                                    </div>

                                )
                            }






                            {
                                order.status === "REVIEW" && (

                                    <div

                                        className="
                                            mt-4
                                            rounded-xl
                                            border
                                            border-yellow-500/20
                                            bg-yellow-500/10
                                            p-4
                                        "

                                    >

                                        <p

                                            className="
                                                text-sm
                                                font-medium
                                                text-yellow-400
                                            "

                                        >

                                            ⏳ Проверка администратора


                                        </p>


                                        <p

                                            className="
                                                mt-1
                                                text-xs
                                                text-yellow-300/70
                                            "

                                        >

                                            Ожидайте подтверждения заказа


                                        </p>


                                    </div>

                                )
                            }






                            {
                                order.status === "REJECTED" && (

                                    <div

                                        className="
                                            mt-4
                                            rounded-xl
                                            border
                                            border-red-500/20
                                            bg-red-500/10
                                            p-4
                                        "

                                    >

                                        <p

                                            className="
                                                text-sm
                                                font-medium
                                                text-red-400
                                            "

                                        >

                                            ✕ Заказ отклонён


                                        </p>


                                        <p

                                            className="
                                                mt-1
                                                text-xs
                                                text-red-300/70
                                            "

                                        >

                                            Администратор отказал в выполнении заказа


                                        </p>


                                    </div>

                                )
                            }







                        </aside>







                    </div>






                </section>






            </div>





        </main>



        </>

    );


}