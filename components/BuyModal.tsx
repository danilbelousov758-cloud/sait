"use client";

import {
    useEffect,
    useState
} from "react";

import {
    useRouter
} from "next/navigation";


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


    const router = useRouter();



    const [
        open,
        setOpen
    ] = useState(false);



    const [
        promo,
        setPromo
    ] = useState("");



    const [
        loading,
        setLoading
    ] = useState(false);



    const [
        error,
        setError
    ] = useState("");



    const donationPrice =
        Math.round(
            price / 0.85
        );




    useEffect(() => {

        if (!open) return;


        const oldOverflow =
            document.body.style.overflow;


        document.body.style.overflow =
            "hidden";


        return () => {

            document.body.style.overflow =
                oldOverflow;

        };


    }, [open]);






    async function buy() {


        if (loading) return;



        setLoading(true);

        setError("");



        try {


            const savedUser =
                localStorage.getItem(
                    "user"
                );



            if (!savedUser) {


                setError(
                    "Войдите в аккаунт, чтобы оформить заказ."
                );


                return;

            }




            let user:
                {
                    id?: number | string
                }
                | null = null;




            try {


                user =
                    JSON.parse(
                        savedUser
                    );


            } catch {


                setError(
                    "Не удалось определить пользователя. Войдите заново."
                );


                return;

            }




            const buyerId =
                Number(
                    user?.id
                );



            if (
                !Number.isInteger(
                    buyerId
                )
                ||
                buyerId <= 0
            ) {


                setError(
                    "Не удалось определить пользователя. Войдите заново."
                );


                return;

            }





            const response =
                await fetch(
                    "/api/orders",
                    {

                        method:
                            "POST",

                        headers:
                            {

                                "Content-Type":
                                    "application/json",

                            },


                        body:
                            JSON.stringify(
                                {

                                    productId,

                                    buyerId,

                                    promo:
                                        promo.trim(),

                                }
                            ),

                    }
                );





            const data =
                await response
                    .json()
                    .catch(
                        () => null
                    );





            if (!response.ok) {


                throw new Error(
                    data?.message ||
                    "Не удалось создать заказ"
                );


            }





            if (!data?.orderId) {


                throw new Error(
                    "Сервер не вернул номер заказа"
                );


            }




            setOpen(false);

            setPromo("");



            router.push(
                `/orders/${data.orderId}`
            );


            router.refresh();




        } catch (err) {


            setError(

                err instanceof Error

                    ? err.message

                    : "Не удалось создать заказ"

            );



        } finally {


            setLoading(false);


        }


    }







    function closeModal() {


        if (loading)
            return;



        setOpen(false);


        setError("");


    }






    return (

        <>


            <button

                type="button"

                onClick={() => {

                    setError("");

                    setOpen(true);

                }}

                className="
                    mt-5
                    flex
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-600
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-blue-500
                "

            >

                Купить


            </button>





            {open && (

<div
    className="
        fixed
        inset-0
        z-50
        flex
        items-start
        justify-center
        overflow-y-auto
        bg-black/75
        px-3
        py-6
        backdrop-blur-sm
        sm:px-4
    "

                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {

                            closeModal();

                        }

                    }}

                >


                    <div

                        className="
                            flex
                            w-full
                            max-w-[430px]
                            flex-col
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/10
                            bg-[#0D1117]
                            shadow-2xl
                            max-h-[calc(100vh-48px)]
                        "

                    >

                                            {/* HEADER */}

                        <div
                            className="
                                flex
                                shrink-0
                                items-center
                                justify-between
                                gap-3
                                border-b
                                border-white/[0.06]
                                px-4
                                py-3
                            "
                        >

                            <div>

                                <h2
                                    className="
                                        text-base
                                        font-bold
                                        text-white
                                    "
                                >
                                    Оформление заказа
                                </h2>


                                <p
                                    className="
                                        mt-1
                                        text-[10px]
                                        text-slate-600
                                    "
                                >
                                    Проверьте данные перед оплатой
                                </p>

                            </div>



                            <button

                                type="button"

                                onClick={closeModal}

                                disabled={loading}

                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-white/[0.04]
                                    text-slate-500
                                    transition
                                    hover:bg-white/[0.08]
                                    hover:text-white
                                "

                            >

                                ✕

                            </button>

                        </div>





                        {/* SCROLL CONTENT */}


                        <div
                            className="
                                flex-1
                                overflow-y-scroll
                                px-4
                                py-4
                                [&::-webkit-scrollbar]:w-1.5
                                [&::-webkit-scrollbar-track]:bg-[#080B10]
                                [&::-webkit-scrollbar-thumb]:rounded-full
                                [&::-webkit-scrollbar-thumb]:bg-white/10
                            "
                        >




                            {/* PRODUCT */}


                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-white/[0.06]
                                    bg-black/20
                                    p-3
                                "
                            >

                                <div
                                    className="
                                        flex
                                        justify-between
                                        gap-3
                                    "
                                >

                                    <div
                                        className="
                                            min-w-0
                                        "
                                    >

                                        <div
                                            className="
                                                truncate
                                                text-sm
                                                font-semibold
                                                text-white
                                            "
                                        >

                                            {productName}

                                        </div>


                                        <div
                                            className="
                                                mt-1
                                                text-[11px]
                                                text-slate-600
                                            "
                                        >

                                            Продавец: {sellerName}

                                        </div>


                                    </div>



                                    <div
                                        className="
                                            shrink-0
                                            text-right
                                        "
                                    >

                                        <div
                                            className="
                                                text-lg
                                                font-bold
                                                text-white
                                            "
                                        >

                                            {price} ₽

                                        </div>


                                        <div
                                            className="
                                                text-[9px]
                                                uppercase
                                                text-slate-600
                                            "
                                        >

                                            товар

                                        </div>

                                    </div>


                                </div>


                            </div>






                            {/* PAYMENT */}


                            <div className="mt-4">


                                <div
                                    className="
                                        mb-2
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-widest
                                        text-slate-600
                                    "
                                >

                                    Оплата

                                </div>




                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-white/[0.06]
                                        bg-black/20
                                        p-3
                                        text-xs
                                        leading-5
                                        text-slate-400
                                    "
                                >


                                    <p>

                                        <b className="text-slate-300">
                                            СберБанк:
                                        </b>

                                        <br />

                                        2202 2088 8291 8056

                                    </p>




                                    <div
                                        className="
                                            my-2
                                            h-px
                                            bg-white/5
                                        "
                                    />



                                    <p>

                                        <b className="text-slate-300">
                                            Т-Банк:
                                        </b>

                                        <br />

                                        5536 9177 2933 9314

                                    </p>





                                    <div
                                        className="
                                            my-2
                                            h-px
                                            bg-white/5
                                        "
                                    />





                                    <p>

                                        <b className="text-slate-300">
                                            Donation Alerts:
                                        </b>


                                        <br />


                                        <span
                                            className="
                                                text-[10px]
                                                text-slate-600
                                            "
                                        >

                                            donationalerts.com/r/galbraith1629

                                        </span>


                                    </p>


                                </div>


                            </div>






                            {/* WARNING */}


                            <div
                                className="
                                    mt-3
                                    rounded-xl
                                    border
                                    border-amber-500/20
                                    bg-amber-500/5
                                    p-3
                                "
                            >

                                <p
                                    className="
                                        text-[11px]
                                        leading-5
                                        text-slate-400
                                    "
                                >

                                    ⚠️{" "}

                                    <b className="text-amber-300">
                                        Donation Alerts
                                    </b>

                                    {" "}имеет комиссию{" "}

                                    <b className="text-white">
                                        15%
                                    </b>.

                                    Если сумма доната меньше стоимости товара,

                                    потребуется{" "}

                                    <b className="text-amber-300">
                                        доплата разницы.
                                    </b>


                                </p>


                            </div>






                            {/* PROMO */}


                            <div className="mt-4">


                                <label
                                    className="
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-widest
                                        text-slate-600
                                    "
                                >

                                    Промокод

                                </label>



                                <input

                                    value={promo}

                                    onChange={(e)=>
                                        setPromo(
                                            e.target.value
                                        )
                                    }

                                    disabled={loading}

                                    placeholder="Введите промокод"

                                    className="
                                        mt-2
                                        h-10
                                        w-full
                                        rounded-lg
                                        border
                                        border-white/10
                                        bg-black/30
                                        px-3
                                        text-sm
                                        text-white
                                        outline-none
                                        focus:border-blue-500/50
                                    "

                                />


                            </div>





                            {/* TOTAL */}


                            <div
                                className="
                                    mt-4
                                    rounded-xl
                                    border
                                    border-white/[0.06]
                                    bg-black/20
                                    p-3
                                "
                            >

                                <div
                                    className="
                                        flex
                                        justify-between
                                    "
                                >

                                    <span
                                        className="
                                            text-xs
                                            text-slate-500
                                        "
                                    >

                                        Итого

                                    </span>


                                    <b>

                                        {price} ₽

                                    </b>


                                </div>



                                <div
                                    className="
                                        mt-2
                                        text-[11px]
                                        text-slate-600
                                    "
                                >

                                    Через Donation Alerts:
                                    {" "}
                                    {donationPrice} ₽

                                </div>


                            </div>





                            {error && (

                                <div
                                    className="
                                        mt-3
                                        rounded-lg
                                        border
                                        border-red-500/20
                                        bg-red-500/10
                                        p-3
                                        text-xs
                                        text-red-300
                                    "
                                >

                                    {error}

                                </div>

                            )}



                        </div>





                        {/* FOOTER */}


                        <div
                            className="
                                shrink-0
                                border-t
                                border-white/[0.06]
                                bg-[#0D1117]
                                p-4
                            "
                        >


                            <button

                                type="button"

                                onClick={buy}

                                disabled={loading}

                                className="
                                    w-full
                                    rounded-xl
                                    bg-emerald-600
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-emerald-500
                                    disabled:opacity-50
                                "

                            >

                                {loading
                                    ? "Создание заказа..."
                                    : "Я оплатил"
                                }


                            </button>



                            <p
                                className="
                                    mt-2
                                    text-center
                                    text-[9px]
                                    text-slate-700
                                "
                            >

                                После проверки оплаты заказ будет обработан.

                            </p>


                        </div>



                    </div>


                </div>

            )}


        </>

    );

}