"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState
} from "react";

import Header from "@/components/Header";


type User = {
    id: number;
    username: string;
    avatar?: string | null;
    role?: string;
};


const categories = [
    "Скины",
    "Оружие",
    "Интерьеры",
    "Заменные территории",
    "Эффекты",
    "Звуки",
    "Дороги",
    "Карты",
    "Арзамас",
    "Казино",
    "Порт",
    "Инвентарь",
    "Скайбоксы",
    "Нефтевышки",
    "Прицелы",
    "Курсор мыши",
    "Фисты",
    "Таймциклы",
    "Пикапы",
    "АХК",
    "ASI плагины",
    "Деревья",
    "Графика",
    "Загрузочный экран",
    "Подсказки для гос. сотрудников",
];


const allowedRoles = [
    "SELLER",
    "ADMIN",
    "FOUNDER",
];



export default function CreateCatalogProductPage() {


    const [user, setUser] =
        useState<User | null>(null);


    const [loaded, setLoaded] =
        useState(false);



    const [name, setName] =
        useState("");


    const [category, setCategory] =
        useState("");


    const [price, setPrice] =
        useState("");


    const [description, setDescription] =
        useState("");



    const [dffFile, setDffFile] =
        useState<File | null>(null);


    const [txdFile, setTxdFile] =
        useState<File | null>(null);



    const [images, setImages] =
        useState<File[]>([]);


    const [imagePreview, setImagePreview] =
        useState<string[]>([]);



    const [pinned, setPinned] =
        useState(false);



    const [error, setError] =
        useState("");


    const [saving, setSaving] =
        useState(false);




    useEffect(() => {


        const loadUser = () => {


            try {


                const saved =
                    localStorage.getItem(
                        "user"
                    );


                if (saved) {

                    setUser(
                        JSON.parse(saved)
                    );

                }


            } catch {


                setUser(null);


            } finally {


                setLoaded(true);


            }


        };



        loadUser();



        window.addEventListener(
            "userUpdated",
            loadUser
        );



        return () => {


            window.removeEventListener(
                "userUpdated",
                loadUser
            );


        };


    }, []);




    useEffect(() => {


        return () => {


            imagePreview.forEach(
                url =>
                    URL.revokeObjectURL(url)
            );


        };


    }, [imagePreview]);





    const role =
        user?.role?.toUpperCase() ||
        "USER";



    const hasAccess =
        allowedRoles.includes(
            role
        );






    function changeImages(
        e: ChangeEvent<HTMLInputElement>
    ) {


        const files =
            Array.from(
                e.target.files || []
            );



        const imagesOnly =
            files.filter(
                file =>
                    file.type.startsWith(
                        "image/"
                    )
            );



        setImages(
            imagesOnly
        );



        setImagePreview(
            imagesOnly.map(
                file =>
                    URL.createObjectURL(
                        file
                    )
            )
        );


    }







    async function handleSubmit(
        e: FormEvent<HTMLFormElement>
    ) {


        e.preventDefault();


        setError("");




        if (!name.trim()) {


            setError(
                "Введите название товара"
            );


            return;


        }




        if (!category) {


            setError(
                "Выберите категорию"
            );


            return;


        }





        const finalPrice =
            price.trim()
                ?
                Number(
                    price.replace(",", ".")
                )
                :
                0;





        if (
            Number.isNaN(finalPrice) ||
            finalPrice < 0
        ) {


            setError(
                "Некорректная цена"
            );


            return;


        }





        if (!dffFile) {


            setError(
                "Выберите DFF файл"
            );


            return;


        }





        if (!txdFile) {


            setError(
                "Выберите TXD файл"
            );


            return;


        }





        setSaving(true);




        try {


            const formData =
                new FormData();



            formData.append(
                "name",
                name
            );



            formData.append(
                "category",
                category
            );



            formData.append(
                "price",
                String(finalPrice)
            );



            formData.append(
                "description",
                description
            );



            formData.append(
                "pinned",
                String(pinned)
            );



            formData.append(
                "dff",
                dffFile
            );



            formData.append(
                "txd",
                txdFile
            );



            images.forEach(
                image =>
                    formData.append(
                        "images",
                        image
                    )
            );




            const response =
                await fetch(
                    "/api/products/create",
                    {
                        method: "POST",
                        body: formData,
                    }
                );




            const data =
                await response.json();





            if (!response.ok) {


                throw new Error(
                    data.message ||
                    "Ошибка создания товара"
                );


            }





            alert(
                "Товар успешно создан"
            );



            window.location.href =
                "/catalog";




        } catch (err: unknown) {


            if (err instanceof Error) {


                setError(
                    err.message
                );


            } else {


                setError(
                    "Ошибка создания товара"
                );


            }



        } finally {


            setSaving(false);


        }


    }





    if (!loaded) {

        return null;

    }





    if (!user || !hasAccess) {


        return (

            <>
                <Header />

                <main className="
                    min-h-screen
                    bg-[#080B10]
                    flex
                    items-center
                    justify-center
                    text-white
                ">

                    <div className="
                        text-center
                    ">

                        <h1 className="
                            text-2xl
                            font-bold
                        ">
                            Доступ запрещен
                        </h1>


                        <Link
                            href="/catalog"
                            className="
                                mt-5
                                inline-flex
                                rounded-xl
                                bg-blue-600
                                px-5
                                py-3
                            "
                        >
                            Вернуться
                        </Link>


                    </div>

                </main>

            </>

        );


    }





    return (

        <>
            <Header />


            <main className="
                min-h-screen
                bg-[#080B10]
                px-5
                pb-20
                pt-[120px]
                text-white
            ">


                <div className="
                    mx-auto
                    max-w-5xl
                ">

                    <div className="
                        mb-8
                        flex
                        items-center
                        justify-between
                    ">


                        <div>

                            <p className="
                                text-xs
                                uppercase
                                text-blue-500
                            ">
                                MAZEPOV CONNEXTION
                            </p>


                            <h1 className="
                                mt-2
                                text-3xl
                                font-bold
                            ">
                                Добавить товар
                            </h1>

                        </div>


                        <Link
                            href="/catalog"
                            className="
                                rounded-xl
                                border
                                border-white/10
                                px-4
                                py-2
                            "
                        >
                            Назад
                        </Link>


                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <section className="
                            rounded-2xl
                            border
                            border-white/[0.07]
                            bg-[#0D1117]
                            p-6
                        ">

                            <h2 className="
                                text-lg
                                font-semibold
                            ">
                                Основная информация
                            </h2>


                            <div className="
                                mt-5
                                space-y-5
                            ">


                                <input
                                    value={name}
                                    onChange={
                                        e =>
                                            setName(
                                                e.target.value
                                            )
                                    }
                                    placeholder="Название товара"
                                    className="
                                        h-12
                                        w-full
                                        rounded-xl
                                        bg-[#11161D]
                                        px-4
                                        text-sm
                                        outline-none
                                    "
                                />



                                <div>

                                    <p className="
                                        mb-2
                                        text-xs
                                        text-slate-400
                                    ">
                                        Категория
                                    </p>


                                    <div className="
                                        grid
                                        grid-cols-2
                                        gap-2
                                        sm:grid-cols-3
                                    ">

                                        {categories.map(
                                            item => (

                                                <button
                                                    key={item}
                                                    type="button"
                                                    onClick={() =>
                                                        setCategory(item)
                                                    }
                                                    className={`
                                                        rounded-xl
                                                        border
                                                        px-3
                                                        py-2
                                                        text-xs
                                                        transition

                                                        ${
                                                            category === item
                                                            ?
                                                            "border-blue-500 bg-blue-600 text-white"
                                                            :
                                                            "border-white/10 bg-[#11161D] text-slate-400 hover:text-white"
                                                        }
                                                    `}
                                                >
                                                    {item}
                                                </button>

                                            )
                                        )}

                                    </div>

                                </div>




                                <div>

                                    <p className="
                                        mb-2
                                        text-xs
                                        text-slate-400
                                    ">
                                        Цена
                                    </p>


                                    <input
                                        value={price}
                                        onChange={
                                            e =>
                                                setPrice(
                                                    e.target.value.replace(
                                                        /[^0-9.,]/g,
                                                        ""
                                                    )
                                                )
                                        }
                                        placeholder="0"
                                        inputMode="numeric"
                                        className="
                                            h-12
                                            w-full
                                            rounded-xl
                                            bg-[#11161D]
                                            px-4
                                            outline-none
                                        "
                                    />

                                </div>




                                <textarea
                                    value={description}
                                    onChange={
                                        e =>
                                            setDescription(
                                                e.target.value
                                            )
                                    }
                                    placeholder="Описание товара"
                                    rows={5}
                                    className="
                                        w-full
                                        resize-none
                                        rounded-xl
                                        bg-[#11161D]
                                        p-4
                                        outline-none
                                    "
                                />

                            </div>

                        </section>





                        <section className="
                            rounded-2xl
                            border
                            border-white/10
                            bg-[#0D1117]
                            p-6
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <div>

                                    <h2 className="
                                        font-semibold
                                    ">
                                        Закрепленный товар
                                    </h2>

                                    <p className="
                                        mt-1
                                        text-xs
                                        text-slate-500
                                    ">
                                        Товар будет выше остальных
                                    </p>

                                </div>



                                <button
                                    type="button"
                                    onClick={() =>
                                        setPinned(
                                            !pinned
                                        )
                                    }
                                    className={`
                                        h-7
                                        w-12
                                        rounded-full
                                        transition

                                        ${
                                            pinned
                                            ?
                                            "bg-blue-600"
                                            :
                                            "bg-white/10"
                                        }
                                    `}
                                >

                                    <div className={`
                                        h-5
                                        w-5
                                        rounded-full
                                        bg-white
                                        transition

                                        ${
                                            pinned
                                            ?
                                            "translate-x-6"
                                            :
                                            "translate-x-1"
                                        }
                                    `}/>

                                </button>

                            </div>

                        </section>







                        <section className="
                            rounded-2xl
                            border
                            border-white/10
                            bg-[#0D1117]
                            p-6
                        ">


                            <h2 className="
                                font-semibold
                            ">
                                Файлы мода
                            </h2>



                            <div className="
                                mt-5
                                grid
                                gap-4
                                sm:grid-cols-2
                            ">


                                <label className="
                                    cursor-pointer
                                    rounded-xl
                                    border-dashed
                                    border
                                    border-white/10
                                    bg-[#11161D]
                                    p-8
                                    text-center
                                ">


                                    <input
                                        type="file"
                                        accept=".dff"
                                        hidden
                                        onChange={
                                            e =>
                                                setDffFile(
                                                    e.target.files?.[0] || null
                                                )
                                        }
                                    />


                                    <b className="
                                        text-blue-400
                                    ">
                                        DFF
                                    </b>


                                    <p className="
                                        mt-3
                                        text-sm
                                    ">
                                        {
                                            dffFile
                                            ?
                                            dffFile.name
                                            :
                                            "Выберите DFF файл"
                                        }
                                    </p>


                                </label>





                                <label className="
                                    cursor-pointer
                                    rounded-xl
                                    border-dashed
                                    border
                                    border-white/10
                                    bg-[#11161D]
                                    p-8
                                    text-center
                                ">


                                    <input
                                        type="file"
                                        accept=".txd"
                                        hidden
                                        onChange={
                                            e =>
                                                setTxdFile(
                                                    e.target.files?.[0] || null
                                                )
                                        }
                                    />


                                    <b className="
                                        text-purple-400
                                    ">
                                        TXD
                                    </b>


                                    <p className="
                                        mt-3
                                        text-sm
                                    ">
                                        {
                                            txdFile
                                            ?
                                            txdFile.name
                                            :
                                            "Выберите TXD файл"
                                        }
                                    </p>


                                </label>


                            </div>


                        </section>







                        <section className="
                            rounded-2xl
                            border
                            border-white/10
                            bg-[#0D1117]
                            p-6
                        ">


                            <h2 className="
                                font-semibold
                            ">
                                Изображения
                            </h2>



                            <label className="
                                mt-5
                                block
                                cursor-pointer
                                rounded-xl
                                border-dashed
                                border
                                border-white/10
                                bg-[#11161D]
                                p-10
                                text-center
                            ">


                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    hidden
                                    onChange={changeImages}
                                />


                                Добавить картинки


                            </label>





                            {
                                imagePreview.length > 0 && (

                                    <div className="
                                        mt-5
                                        grid
                                        grid-cols-3
                                        gap-3
                                    ">


                                        {
                                            imagePreview.map(
                                                img => (

                                                    <Image
                                                        key={img}
                                                        src={img}
                                                        width={300}
                                                        height={170}
                                                        alt="preview"
                                                        className="
                                                            aspect-video
                                                            rounded-xl
                                                            object-cover
                                                        "
                                                    />

                                                )
                                            )
                                        }


                                    </div>

                                )
                            }


                        </section>







                        {
                            error && (

                                <div className="
                                    rounded-xl
                                    border
                                    border-red-500/20
                                    bg-red-500/10
                                    p-4
                                    text-red-400
                                ">
                                    {error}
                                </div>

                            )
                        }






                        <button
                            disabled={saving}
                            className="
                                h-12
                                w-full
                                rounded-xl
                                bg-blue-600
                                font-semibold
                                transition
                                hover:bg-blue-500
                                disabled:opacity-50
                            "
                        >

                            {
                                saving
                                ?
                                "Создание..."
                                :
                                "Создать товар"
                            }


                        </button>



                    </form>


                </div>


            </main>


        </>

    );

}