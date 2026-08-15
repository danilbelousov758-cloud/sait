"use client";

import {
    useState
} from "react";


type Props = {

    productId:number;

    productName:string;

    sellerName:string;

    price:number;

};



export default function BuyModal({

    productId,
    productName,
    sellerName,
    price

}:Props){


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




    function buy(){


        setLoading(true);



        // позже подключим API заказа


        setTimeout(()=>{


            setLoading(false);


            alert(
                "Заказ создан"
            );


        },800);



    }




    const donationPrice =
        Math.round(
            price / 0.85
        );




    return (

        <>


        <button

            onClick={()=>setOpen(true)}

            className="
                mt-5
                flex
                w-full
                justify-center
                rounded-xl
                bg-blue-600
                py-3
                font-semibold
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
                    "

                >



                    <div
                        className="
                            flex
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

                            onClick={()=>
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





                    <div className="mt-6">


                        <h3
                            className="
                                text-lg
                                font-semibold
                            "
                        >

                            {productName}


                        </h3>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >

                            Продавец:
                            {" "}
                            {sellerName}

                        </p>


                    </div>





                    <div

                        className="
                            mt-5
                            rounded-xl
                            bg-black/30
                            p-4
                        "

                    >

                        <p
                            className="
                                text-sm
                                text-slate-400
                            "
                        >

                            Цена

                        </p>


                        <p
                            className="
                                text-2xl
                                font-bold
                            "
                        >

                            {price} ₽

                        </p>


                    </div>







                    <div className="mt-5">


                        <p
                            className="
                                text-sm
                                text-slate-400
                            "
                        >

                            Переведите оплату:


                        </p>



                        <div

                            className="
                                mt-3
                                rounded-xl
                                bg-black/30
                                p-4
                                text-sm
                                leading-7
                            "

                        >

                            <b>СберБанк:</b>
                            <br/>
                            2202 2088 8291 8056

                            <br/><br/>

                            <b>Т-Банк:</b>
                            <br/>
                            5536 9177 2933 9314


                            <br/><br/>

                            <b>Donation Alerts:</b>
                            <br/>

                            donationalerts.com/r/galbraith1629


                        </div>


                    </div>







                    <div className="mt-5">


                        <label
                            className="
                                text-sm
                                text-slate-400
                            "
                        >

                            🏷 Промокод


                        </label>



                        <input

                            value={promo}

                            onChange={(e)=>
                                setPromo(
                                    e.target.value
                                )
                            }


                            className="
                                mt-2
                                h-11
                                w-full
                                rounded-xl
                                border
                                border-white/10
                                bg-black/30
                                px-4
                                outline-none
                            "

                            placeholder="Введите промокод"

                        />


                    </div>







                    <div
                        className="
                            mt-5
                            border-t
                            border-white/10
                            pt-4
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
                                    text-slate-400
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
                                text-sm
                                text-slate-500
                            "
                        >

                            Через Donation Alerts:
                            {" "}
                            {donationPrice} ₽


                        </div>


                    </div>







                    <button

                        onClick={buy}

                        disabled={loading}

                        className="
                            mt-6
                            w-full
                            rounded-xl
                            bg-green-600
                            py-3
                            font-semibold
                            hover:bg-green-500
                            disabled:opacity-50
                        "

                    >

                        {
                            loading
                            ?
                            "Создание заказа..."
                            :
                            "Я оплатил"
                        }


                    </button>



                </div>


            </div>


            )
        }


        </>


    );

}