"use client";

import {
    useState,
} from "react";


type Props = {

    productId: number;

    productName: string;

    sellerName: string;

    price: number;

};



export default function BuyModal({

    productId,

    productName,

    sellerName,

    price,

}: Props) {


    const [
        open,
        setOpen,
    ] =
        useState(false);


    const [
        loading,
        setLoading,
    ] =
        useState(false);



    async function createOrder() {


        const saved =
            localStorage.getItem(
                "user"
            );


        if (!saved) {

            alert(
                "Войдите в аккаунт"
            );

            return;

        }


        const user =
            JSON.parse(
                saved
            );


        setLoading(true);



        try {


            const response =
                await fetch(
                    "/api/orders/create",
                    {

                        method:
                            "POST",

                        headers:
                        {
                            "Content-Type":
                                "application/json",
                        },


                        body:
                            JSON.stringify({

                                product_id:
                                    productId,


                                buyer_id:
                                    user.id,

                            }),

                    }
                );



            const data =
                await response.json();



            if (!data.success) {

                throw new Error(
                    data.message
                );

            }



            window.location.href =
                `/orders/${data.orderId}`;



        } catch(error) {


            alert(
                error instanceof Error
                    ? error.message
                    : "Ошибка создания заказа"
            );


        } finally {


            setLoading(false);


        }


    }




    return (

        <>


            <button

                onClick={() =>
                    setOpen(true)
                }

                className="
                    mt-5
                    w-full
                    rounded-xl
                    bg-blue-600
                    py-3
                    font-semibold
                    transition
                    hover:bg-blue-500
                "

            >

                Купить

            </button>





            {
                open && (

                    <div

                        className="
                            fixed
                            inset-0
                            z-50
                            flex
                            items-center
                            justify-center
                            bg-black/70
                            px-4
                        "

                    >


                        <div

                            className="
                                w-full
                                max-w-lg
                                rounded-3xl
                                border
                                border-white/10
                                bg-[#0D1117]
                                p-6
                                text-white
                            "

                        >


                            <div

                                className="
                                    flex
                                    items-center
                                    justify-between
                                "

                            >


                                <h2

                                    className="
                                        text-xl
                                        font-bold
                                    "

                                >

                                    Оформление заказа

                                </h2>



                                <button

                                    onClick={() =>
                                        setOpen(false)
                                    }

                                    className="
                                        text-slate-500
                                        hover:text-white
                                    "

                                >

                                    ✕


                                </button>


                            </div>





                            <div

                                className="
                                    mt-6
                                    rounded-2xl
                                    bg-black/20
                                    p-4
                                "

                            >


                                <div

                                    className="
                                        font-semibold
                                    "

                                >

                                    {productName}

                                </div>


                                <div

                                    className="
                                        mt-2
                                        text-sm
                                        text-slate-400
                                    "

                                >

                                    Продавец:
                                    {" "}
                                    {sellerName}

                                </div>



                                <div

                                    className="
                                        mt-3
                                        text-2xl
                                        font-bold
                                    "

                                >

                                    {price},00 ₽


                                </div>



                            </div>






                            <div

                                className="
                                    mt-5
                                    rounded-2xl
                                    border
                                    border-white/5
                                    bg-[#11161D]
                                    p-4
                                    text-sm
                                "

                            >


                                <div
                                    className="
                                        text-slate-400
                                    "
                                >

                                    Переведите оплату на реквизиты сайта:

                                </div>



                                <div
                                    className="
                                        mt-3
                                        space-y-1
                                        font-medium
                                    "
                                >

                                    <div>
                                        СберБанк:
                                        <br />
                                        2202 2088 8291 8056
                                    </div>


                                    <div className="mt-3">

                                        Т-Банк:
                                        <br />
                                        5536 9177 2933 9314

                                    </div>



                                </div>



                            </div>






                            <div

                                className="
                                    mt-4
                                    rounded-xl
                                    border
                                    border-yellow-500/20
                                    bg-yellow-500/10
                                    p-3
                                    text-xs
                                    text-yellow-300
                                "

                            >

                                ⚠️ После оплаты нажмите
                                «Я оплатил».
                                Заказ уйдёт на проверку
                                администрации.


                            </div>





                            <div

                                className="
                                    mt-5
                                    flex
                                    justify-between
                                    text-lg
                                "

                            >

                                <span>

                                    Итого:

                                </span>


                                <b>

                                    {price},00 ₽

                                </b>


                            </div>






                            <button

                                onClick={
                                    createOrder
                                }


                                disabled={
                                    loading
                                }


                                className="
                                    mt-6
                                    w-full
                                    rounded-xl
                                    bg-blue-600
                                    py-3
                                    font-semibold
                                    transition
                                    hover:bg-blue-500
                                    disabled:opacity-50
                                "

                            >

                                {
                                    loading

                                    ? "Создание заказа..."

                                    : "Я оплатил"

                                }


                            </button>



                        </div>


                    </div>

                )

            }



        </>

    );

}