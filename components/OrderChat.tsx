"use client";


import {
    useEffect,
    useState
} from "react";



type Message = {

    id:number;

    message:string;

    username:string;

    created_at:string;

};



export default function OrderChat({

    orderId

}:{

    orderId:number;

}){


    const [
        messages,
        setMessages
    ] = useState<Message[]>([]);


    const [
        text,
        setText
    ] = useState("");



    async function load(){


        const res =
            await fetch(
                `/api/orders/${orderId}/messages`
            );


        const data =
            await res.json();


        setMessages(data);


    }



    useEffect(()=>{

        load();

    },[]);




    async function send(){


        if(
            !text.trim()
        )
            return;



        const user =
            JSON.parse(
                localStorage.getItem("user") || "{}"
            );



        await fetch(
            `/api/orders/${orderId}/messages`,
            {

                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({

                    userId:user.id,

                    message:text

                })

            }
        );


        setText("");

        load();


    }



    return (

<section

className="
mt-6
overflow-hidden
rounded-2xl
border
border-white/10
bg-[#11161D]
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
font-semibold
text-white
"
>

💬 Чат заказа

</h2>


<p
className="
mt-1
text-xs
text-slate-600
"
>

Обсуждение заказа с продавцом

</p>


</div>





<div

className="
h-[320px]
space-y-3
overflow-y-auto
p-5

scrollbar-thin
scrollbar-thumb-white/10
"

>


{
messages.length === 0 &&

<div
className="
rounded-xl
bg-black/20
p-4
text-sm
text-slate-500
"
>

Сообщений пока нет

</div>

}



{
messages.map((m)=>(


<div

key={m.id}

className="
max-w-[80%]
rounded-2xl
rounded-tl-none
bg-black/30
p-3
"

>


<div
className="
text-xs
font-semibold
text-blue-400
"
>

{m.username}

</div>


<div
className="
mt-1
text-sm
text-slate-300
"
>

{m.message}

</div>


</div>


))

}



</div>





<div

className="
border-t
border-white/10
p-4
"

>


<div
className="
flex
gap-3
"
>


<input

value={text}

onChange={
e=>setText(e.target.value)
}

placeholder="Сообщение..."

className="
h-11
flex-1
rounded-xl
border
border-white/10
bg-black/30
px-4
text-sm
text-white
outline-none
"

/>


<button

onClick={send}

className="
rounded-xl
bg-blue-600
px-5
font-semibold
hover:bg-blue-500
"

>

Отправить

</button>


</div>


</div>



</section>

    );

}