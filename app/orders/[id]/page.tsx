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



    const data:any = {



        WAIT_PAYMENT:{

            text:"Ожидает оплаты",

            dot:"bg-neutral-400"

        },



        REVIEW:{

            text:"Проверка администратора",

            dot:"bg-yellow-400"

        },



        APPROVED:{

            text:"Одобрено",

            dot:"bg-emerald-400"

        },



        REJECTED:{

            text:"Отказано",

            dot:"bg-red-400"

        }



    };





    const current = data[status] || {


        text:"Проверка",

        dot:"bg-neutral-400"


    };







    return (


        <div


            className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-white/10
                bg-white/[0.03]
                px-4
                py-2
                text-sm
                text-neutral-200
            "


        >


            <span


                className={`
                    h-2
                    w-2
                    rounded-full
                    ${current.dot}
                `}


            />


            {current.text}


        </div>


    );


}









function InfoBlock({

    title,

    children


}:{

    title:string;

    children:React.ReactNode;


}){


    return (


        <div


            className="
                rounded-3xl
                border
                border-white/10
                bg-[#0A0A0A]
                p-5
            "


        >


            <p


                className="
                    text-xs
                    uppercase
                    tracking-widest
                    text-neutral-500
                "


            >

                {title}


            </p>


            <div


                className="
                    mt-3
                "


            >


                {children}


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
                bg-[#050505]
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
                        text-neutral-500
                        transition
                        hover:text-white
                    "


                >

                    ← Вернуться в каталог


                </Link>








                <section


                    className="
                        mt-6
                        rounded-3xl
                        border
                        border-white/10
                        bg-[#090909]
                        p-6
                        shadow-2xl
                        shadow-black/50
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


                            <p


                                className="
                                    text-xs
                                    uppercase
                                    tracking-[0.2em]
                                    text-neutral-500
                                "


                            >

                                Заказ #{order.id}


                            </p>





                            <h1


                                className="
                                    mt-3
                                    text-3xl
                                    font-semibold
                                    tracking-tight
                                "


                            >

                                {order.product_name}


                            </h1>





                            <p


                                className="
                                    mt-3
                                    text-sm
                                    text-neutral-500
                                "


                            >

                                Продавец


                                <span


                                    className="
                                        ml-2
                                        text-neutral-200
                                    "


                                >

                                    {order.seller_name}


                                </span>



                            </p>




                        </div>







                        <StatusTag


                            status={order.status}


                        />





                    </div>









                    <div


                        className="
                            mt-8
                            grid
                            gap-6
                            lg:grid-cols-[1fr_320px]
                        "


                    >








                        <div


                            className="
                                overflow-hidden
                                rounded-3xl
                                border
                                border-white/10
                                bg-[#070707]
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



                                <div


                                    className="
                                        flex
                                        items-center
                                        justify-between
                                    "


                                >


                                    <div>


                                        <h2


                                            className="
                                                text-lg
                                                font-semibold
                                            "


                                        >

                                            Диалог заказа


                                        </h2>




                                        <p


                                            className="
                                                mt-1
                                                text-sm
                                                text-neutral-500
                                            "


                                        >

                                            Общение с продавцом


                                        </p>



                                    </div>






                                    <div


                                        className="
                                            rounded-full
                                            border
                                            border-white/10
                                            px-3
                                            py-1
                                            text-xs
                                            text-neutral-400
                                        "


                                    >

                                        ID {order.id}


                                    </div>



                                </div>





                            </div>









                            <div


                                className="
                                    p-5
                                "


                            >



                                <OrderChat


                                    orderId={order.id}


                                />



                            </div>






                        </div>









                        <aside


                            className="
                                space-y-4
                            "


                        >





                            <InfoBlock


                                title="Стоимость"


                            >



                                <div


                                    className="
                                        flex
                                        items-end
                                        gap-2
                                    "


                                >



                                    <span


                                        className="
                                            text-4xl
                                            font-bold
                                        "


                                    >

                                        {order.price}


                                    </span>




                                    <span


                                        className="
                                            mb-1
                                            text-neutral-500
                                        "


                                    >

                                        ₽


                                    </span>




                                </div>



                            </InfoBlock>









                            <InfoBlock


                                title="Покупатель"


                            >



                                <p


                                    className="
                                        text-lg
                                        font-medium
                                    "


                                >

                                    {order.buyer_name}


                                </p>



                            </InfoBlock>








                            <InfoBlock


                                title="Создан"


                            >



                                <p


                                    className="
                                        text-sm
                                        text-neutral-200
                                    "


                                >


                                    {
                                        new Date(order.created_at)
                                        .toLocaleString(
                                            "ru-RU"
                                        )
                                    }


                                </p>



                            </InfoBlock>
                                                        <div


                                className="
                                    rounded-3xl
                                    border
                                    border-white/10
                                    bg-white/[0.03]
                                    p-5
                                "


                            >



                                <p


                                    className="
                                        text-sm
                                        font-medium
                                    "


                                >

                                    🔒 Защищённая сделка


                                </p>




                                <p


                                    className="
                                        mt-2
                                        text-xs
                                        leading-relaxed
                                        text-neutral-500
                                    "


                                >

                                    Все действия по заказу сохраняются.
                                    Не передавайте доступ к аккаунту
                                    и закрывайте сделку только после
                                    получения товара.


                                </p>



                            </div>







                        </aside>







                    </div>








                    <div


                        className="
                            mt-8
                            rounded-3xl
                            border
                            border-white/10
                            bg-[#0A0A0A]
                            p-6
                        "


                    >



                        <div


                            className="
                                flex
                                flex-col
                                gap-4
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "


                        >





                            <div>



                                <p


                                    className="
                                        text-xs
                                        uppercase
                                        tracking-widest
                                        text-neutral-500
                                    "


                                >

                                    Итог


                                </p>



                                <p


                                    className="
                                        mt-2
                                        text-2xl
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
                                            rounded-full
                                            border
                                            border-emerald-500/20
                                            bg-emerald-500/10
                                            px-5
                                            py-2
                                            text-sm
                                            text-emerald-400
                                        "


                                    >

                                        ✓ Сделка завершена


                                    </div>


                                )
                            }







                            {
                                order.status === "REVIEW" && (


                                    <div


                                        className="
                                            rounded-full
                                            border
                                            border-yellow-500/20
                                            bg-yellow-500/10
                                            px-5
                                            py-2
                                            text-sm
                                            text-yellow-400
                                        "


                                    >

                                        Ожидает проверки


                                    </div>


                                )
                            }







                            {
                                order.status === "WAIT_PAYMENT" && (


                                    <div


                                        className="
                                            rounded-full
                                            border
                                            border-white/10
                                            bg-white/[0.03]
                                            px-5
                                            py-2
                                            text-sm
                                            text-neutral-300
                                        "


                                    >

                                        Ожидается оплата


                                    </div>


                                )
                            }








                            {
                                order.status === "REJECTED" && (


                                    <div


                                        className="
                                            rounded-full
                                            border
                                            border-red-500/20
                                            bg-red-500/10
                                            px-5
                                            py-2
                                            text-sm
                                            text-red-400
                                        "


                                    >

                                        Заказ отменён


                                    </div>


                                )
                            }







                        </div>





                    </div>








                </section>








            </div>






        </main>






        </>

    );


}