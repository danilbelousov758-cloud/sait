import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import Header from "@/components/Header";
import BuyModal from "@/components/BuyModal";

import { db } from "@/lib/mysql";



type Product = {

    id: number;

    name: string;

    category: string;

    price: number;

    description: string | null;

    images: string[];

    dff_file: string | null;

    txd_file: string | null;

    zip_file: string | null;

    status: string | null;

    created_at: string | null;

    author_id: number;

};



type Seller = {

    id: number;

    username: string;

    avatar: string | null;

};





async function getProduct(
    id: number
) {

    const [
        rows
    ] =
        await db.execute(

            `
            SELECT

                p.id,

                p.name,

                p.category,

                p.price,

                p.description,

                p.images,

                p.dff_file,

                p.txd_file,

                p.zip_file,

                p.status,

                p.created_at,

                p.author_id,

                u.id AS seller_id,

                u.username,

                u.avatar

            FROM products p

            JOIN users u

                ON u.id = p.author_id

            WHERE p.id = ?

            LIMIT 1
            `,

            [
                id
            ]

        );



    const result =
        rows as any[];



    if (
        !result[0]
    ) {

        return null;

    }



    const item =
        result[0];



    let images: string[] = [];



    try {

        if (
            Array.isArray(
                item.images
            )
        ) {

            images =
                item.images.filter(
                    (
                        image: unknown
                    ): image is string =>

                        typeof image ===
                        "string" &&

                        image.length > 0
                );

        } else if (
            typeof item.images ===
            "string"
        ) {

            const parsed =
                JSON.parse(
                    item.images
                );



            if (
                Array.isArray(
                    parsed
                )
            ) {

                images =
                    parsed.filter(
                        (
                            image: unknown
                        ): image is string =>

                            typeof image ===
                            "string" &&

                            image.length > 0
                    );

            }

        }

    } catch {

        images = [];

    }



    return {

        product: {

            id:
                Number(
                    item.id
                ),

            name:
                String(
                    item.name ||
                    ""
                ),

            category:
                String(
                    item.category ||
                    ""
                ),

            price:
                Number(
                    item.price ||
                    0
                ),

            description:
                item.description
                    ? String(
                        item.description
                    )
                    : null,

            images,

            dff_file:
                item.dff_file
                    ? String(
                        item.dff_file
                    )
                    : null,

            txd_file:
                item.txd_file
                    ? String(
                        item.txd_file
                    )
                    : null,

            zip_file:
                item.zip_file
                    ? String(
                        item.zip_file
                    )
                    : null,

            status:
                item.status
                    ? String(
                        item.status
                    )
                    : null,

            created_at:
                item.created_at
                    ? String(
                        item.created_at
                    )
                    : null,

            author_id:
                Number(
                    item.author_id
                ),

        } as Product,



        seller: {

            id:
                Number(
                    item.seller_id
                ),

            username:
                String(
                    item.username ||
                    ""
                ),

            avatar:
                item.avatar
                    ? String(
                        item.avatar
                    )
                    : null,

        } as Seller,

    };

}





export default async function ProductPage({

    params,

}: {

    params: Promise<{
        id: string;
    }>;

}) {

    const {
        id
    } =
        await params;



    const productId =
        Number(
            id
        );



    if (
        !Number.isInteger(
            productId
        )
    ) {

        notFound();

    }



    const data =
        await getProduct(
            productId
        );



    if (!data) {

        notFound();

    }



    const {
        product,
        seller
    } =
        data;



    const previewImage =
        product.images?.[0] ||
        null;



    const hasFiles =
        Boolean(
            product.dff_file ||
            product.txd_file ||
            product.zip_file
        );



    const isPaid =
        Number(
            product.price
        ) > 0;



    return (

        <>

            <Header />



            <main
                className="
                    min-h-screen
                    bg-[#080B10]
                    px-4
                    pb-20
                    pt-[120px]
                    text-white
                "
            >

                <div
                    className="
                        pointer-events-none
                        fixed
                        inset-0
                        overflow-hidden
                    "
                >

                    <div
                        className="
                            absolute
                            left-1/2
                            top-[-260px]
                            h-[520px]
                            w-[720px]
                            -translate-x-1/2
                            rounded-full
                            bg-blue-600/[0.055]
                            blur-[150px]
                        "
                    />



                    <div
                        className="
                            absolute
                            bottom-[-250px]
                            right-[-150px]
                            h-[450px]
                            w-[450px]
                            rounded-full
                            bg-blue-500/[0.025]
                            blur-[150px]
                        "
                    />

                </div>



                <div
                    className="
                        relative
                        mx-auto
                        max-w-7xl
                    "
                >

                    <Link
                        href="/catalog"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            text-slate-500
                            transition
                            hover:text-white
                        "
                    >

                        <span>
                            ←
                        </span>

                        Назад в каталог

                    </Link>



                    <div
                        className="
                            mt-6
                            grid
                            gap-6
                            lg:grid-cols-[minmax(0,1fr)_380px]
                        "
                    >

                        <section
                            className="
                                overflow-hidden
                                rounded-3xl
                                border
                                border-white/10
                                bg-[#0D1117]
                            "
                        >

                            <div
                                className="
                                    relative
                                    aspect-video
                                    w-full
                                    overflow-hidden
                                    bg-[#090C11]
                                "
                            >

                                {previewImage ? (

                                    <img
                                        src={
                                            previewImage
                                        }
                                        alt={
                                            product.name
                                        }
                                        className="
                                            h-full
                                            w-full
                                            object-contain
                                        "
                                    />

                                ) : (

                                    <div
                                        className="
                                            flex
                                            h-full
                                            w-full
                                            items-center
                                            justify-center
                                            text-sm
                                            text-slate-600
                                        "
                                    >

                                        Нет изображения

                                    </div>

                                )}



                                <div
                                    className="
                                        absolute
                                        left-5
                                        top-5
                                        rounded-xl
                                        border
                                        border-white/10
                                        bg-black/60
                                        px-3
                                        py-2
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-widest
                                        text-blue-400
                                        backdrop-blur-xl
                                    "
                                >

                                    MAZEPOV MODS

                                </div>



                                <div
                                    className="
                                        absolute
                                        right-5
                                        top-5
                                        rounded-xl
                                        border
                                        border-white/10
                                        bg-black/60
                                        px-3
                                        py-2
                                        text-xs
                                        font-semibold
                                        backdrop-blur-xl
                                    "
                                >

                                    {isPaid
                                        ? `${product.price} ₽`
                                        : "Бесплатно"}

                                </div>

                            </div>



                            <div
                                className="
                                    p-6
                                    sm:p-8
                                "
                            >

                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2
                                    "
                                >

                                    <span
                                        className="
                                            rounded-lg
                                            border
                                            border-blue-500/20
                                            bg-blue-500/10
                                            px-3
                                            py-1.5
                                            text-xs
                                            font-medium
                                            text-blue-400
                                        "
                                    >

                                        {product.category}

                                    </span>



                                    <span
                                        className="
                                            rounded-lg
                                            border
                                            border-white/10
                                            bg-white/[0.04]
                                            px-3
                                            py-1.5
                                            text-xs
                                            font-medium
                                            text-slate-400
                                        "
                                    >

                                        {product.status ||
                                            "Опубликован"}

                                    </span>

                                </div>



                                <h1
                                    className="
                                        mt-5
                                        text-3xl
                                        font-bold
                                        tracking-tight
                                        sm:text-4xl
                                    "
                                >

                                    {product.name}

                                </h1>



                                <p
                                    className="
                                        mt-3
                                        text-sm
                                        leading-6
                                        text-slate-500
                                    "
                                >

                                    Мод для MAZEPOV
                                    CONNEXTION

                                </p>



                                <div
                                    className="
                                        mt-8
                                        h-px
                                        bg-white/[0.07]
                                    "
                                />



                                <div
                                    className="
                                        mt-7
                                    "
                                >

                                    <div
                                        className="
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-widest
                                            text-slate-600
                                        "
                                    >

                                        Описание

                                    </div>



                                    <p
                                        className="
                                            mt-4
                                            whitespace-pre-line
                                            text-sm
                                            leading-7
                                            text-slate-300
                                        "
                                    >

                                        {product.description ||
                                            "Описание отсутствует."}

                                    </p>

                                </div>



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
                                lg:sticky
                                lg:top-[120px]
                            "
                        >

                            <div
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-slate-600
                                "
                            >

                                Продавец

                            </div>



                            <div
                                className="
                                    mt-4
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                {seller.avatar ? (

                                    <img
                                        src={
                                            seller.avatar
                                        }
                                        alt={
                                            seller.username
                                        }
                                        className="
                                            h-12
                                            w-12
                                            rounded-full
                                            border
                                            border-white/10
                                            object-cover
                                        "
                                    />

                                ) : (

                                    <div
                                        className="
                                            flex
                                            h-12
                                            w-12
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-blue-600/10
                                            text-sm
                                            font-bold
                                            text-blue-400
                                        "
                                    >

                                        {seller.username
                                            .charAt(0)
                                            .toUpperCase()}

                                    </div>

                                )}



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

                                        {seller.username}

                                    </div>



                                    <div
                                        className="
                                            mt-1
                                            text-xs
                                            text-slate-600
                                        "
                                    >

                                        Автор мода

                                    </div>

                                </div>

                            </div>



                            <div
                                className="
                                    mt-6
                                    h-px
                                    bg-white/[0.07]
                                "
                            />



                            <div
                                className="
                                    mt-6
                                "
                            >

                                <div
                                    className="
                                        text-xs
                                        text-slate-600
                                    "
                                >

                                    Цена товара

                                </div>



                                <div
                                    className="
                                        mt-2
                                        flex
                                        items-end
                                        justify-between
                                        gap-3
                                    "
                                >

                                    <div
                                        className="
                                            text-3xl
                                            font-bold
                                            tracking-tight
                                        "
                                    >

                                        {isPaid
                                            ? `${product.price} ₽`
                                            : "Бесплатно"}

                                    </div>



                                    <div
                                        className="
                                            rounded-lg
                                            bg-white/[0.04]
                                            px-2.5
                                            py-1.5
                                            text-[10px]
                                            font-medium
                                            uppercase
                                            tracking-wider
                                            text-slate-500
                                        "
                                    >

                                        {isPaid
                                            ? "Платный"
                                            : "Free"}

                                    </div>

                                </div>

                            </div>



                            {isPaid ? (

                                <div
                                    className="
                                        mt-6
                                    "
                                >

                                    <BuyModal
                                        productId={
                                            product.id
                                        }
                                        productName={
                                            product.name
                                        }
                                        sellerName={
                                            seller.username
                                        }
                                        price={
                                            product.price
                                        }
                                    />

                                </div>

                            ) : (

                                <Link
                                    href={
                                        `/api/products/download/${product.id}`
                                    }
                                    className="
                                        mt-6
                                        flex
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-emerald-600
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-emerald-500
                                    "
                                >

                                    <svg
                                        width="17"
                                        height="17"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >

                                        <path
                                            d="
                                                M21 15
                                                v4
                                                a2 2 0 0 1-2 2
                                                H5
                                                a2 2 0 0 1-2-2
                                                v-4
                                            "
                                        />

                                        <polyline
                                            points="
                                                7 10
                                                12 15
                                                17 10
                                            "
                                        />

                                        <line
                                            x1="12"
                                            y1="15"
                                            x2="12"
                                            y2="3"
                                        />

                                    </svg>

                                    Скачать мод

                                </Link>

                            )}



                            <div
                                className="
                                    mt-4
                                    rounded-xl
                                    border
                                    border-white/[0.06]
                                    bg-black/20
                                    px-4
                                    py-3
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-2.5
                                    "
                                >

                                    <svg
                                        className="
                                            mt-0.5
                                            shrink-0
                                            text-slate-600
                                        "
                                        width="15"
                                        height="15"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >

                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                        />

                                        <line
                                            x1="12"
                                            y1="16"
                                            x2="12"
                                            y2="12"
                                        />

                                        <line
                                            x1="12"
                                            y1="8"
                                            x2="12.01"
                                            y2="8"
                                        />

                                    </svg>



                                    <p
                                        className="
                                            text-[11px]
                                            leading-5
                                            text-slate-600
                                        "
                                    >

                                        {isPaid
                                            ? "После оплаты заказ будет отправлен на подтверждение администратору."
                                            : "Мод доступен для бесплатного скачивания."}

                                    </p>

                                </div>

                            </div>



                            <div
                                className="
                                    mt-6
                                    grid
                                    gap-2
                                    sm:grid-cols-2
                                    lg:grid-cols-1
                                "
                            >

                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-white/[0.06]
                                        bg-black/10
                                        px-4
                                        py-3
                                    "
                                >

                                    <div
                                        className="
                                            text-[10px]
                                            uppercase
                                            tracking-widest
                                            text-slate-700
                                        "
                                    >

                                        Файлы

                                    </div>



                                    <div
                                        className="
                                            mt-2
                                            text-xs
                                            text-slate-400
                                        "
                                    >

                                        {hasFiles
                                            ? "Файлы мода загружены"
                                            : "Файлы отсутствуют"}

                                    </div>

                                </div>



                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-white/[0.06]
                                        bg-black/10
                                        px-4
                                        py-3
                                    "
                                >

                                    <div
                                        className="
                                            text-[10px]
                                            uppercase
                                            tracking-widest
                                            text-slate-700
                                        "
                                    >

                                        Категория

                                    </div>



                                    <div
                                        className="
                                            mt-2
                                            truncate
                                            text-xs
                                            text-slate-400
                                        "
                                        title={
                                            product.category
                                        }
                                    >

                                        {product.category}

                                    </div>

                                </div>

                            </div>



                            {product.created_at && (

                                <div
                                    className="
                                        mt-5
                                        text-center
                                        text-[10px]
                                        text-slate-700
                                    "
                                >

                                    Добавлен:{" "}
                                    {formatDate(
                                        product.created_at
                                    )}

                                </div>

                            )}

                        </aside>

                    </div>



                    <div
                        className="
                            mt-6
                            rounded-3xl
                            border
                            border-white/10
                            bg-[#0D1117]
                            p-6
                            sm:p-8
                        "
                    >

                        <div
                            className="
                                flex
                                flex-col
                                gap-2
                                sm:flex-row
                                sm:items-end
                                sm:justify-between
                            "
                        >

                            <div>

                                <div
                                    className="
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-widest
                                        text-blue-500
                                    "
                                >

                                    Информация о моде

                                </div>



                                <h2
                                    className="
                                        mt-2
                                        text-xl
                                        font-bold
                                    "
                                >

                                    {product.name}

                                </h2>

                            </div>



                            <div
                                className="
                                    text-xs
                                    text-slate-600
                                "
                            >

                                ID товара: #{product.id}

                            </div>

                        </div>



                        <div
                            className="
                                mt-6
                                grid
                                gap-3
                                sm:grid-cols-2
                                lg:grid-cols-4
                            "
                        >

                            <InfoItem
                                label="Название"
                                value={
                                    product.name
                                }
                            />

                            <InfoItem
                                label="Категория"
                                value={
                                    product.category ||
                                    "Не указана"
                                }
                            />

                            <InfoItem
                                label="Продавец"
                                value={
                                    seller.username
                                }
                            />

                            <InfoItem
                                label="Стоимость"
                                value={
                                    isPaid
                                        ? `${product.price} ₽`
                                        : "Бесплатно"
                                }
                            />

                        </div>

                    </div>

                </div>

            </main>

        </>

    );

}





function InfoItem({

    label,

    value,

}: {

    label: string;

    value: string;

}) {

    return (

        <div
            className="
                rounded-2xl
                border
                border-white/[0.06]
                bg-black/15
                p-4
            "
        >

            <div
                className="
                    text-[10px]
                    uppercase
                    tracking-widest
                    text-slate-700
                "
            >

                {label}

            </div>



            <div
                className="
                    mt-2
                    truncate
                    text-sm
                    font-medium
                    text-slate-300
                "
                title={value}
            >

                {value}

            </div>

        </div>

    );

}





function formatDate(
    value: string
) {

    const date =
        new Date(
            value
        );



    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value;

    }



    return date.toLocaleDateString(
        "ru-RU",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }
    );

}

// ЧАСТЬ 3/4
//
// Здесь находятся дополнительные элементы страницы,
// которые используются для более подробной информации
// о моде и его файлах.



function FileStatus({

    title,

    description,

    available,

}: {

    title: string;

    description: string;

    available: boolean;

}) {

    return (

        <div
            className="
                group
                rounded-2xl
                border
                border-white/[0.07]
                bg-[#0A0E13]
                p-4
                transition
                hover:border-white/10
                hover:bg-[#0C1117]
            "
        >

            <div
                className="
                    flex
                    items-center
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
                            text-sm
                            font-semibold
                            text-white
                        "
                    >

                        {title}

                    </div>



                    <div
                        className="
                            mt-1
                            text-[11px]
                            leading-5
                            text-slate-600
                        "
                    >

                        {description}

                    </div>

                </div>



                <div
                    className={`
                        shrink-0
                        rounded-lg
                        px-2.5
                        py-1.5
                        text-[10px]
                        font-semibold
                        ${
                            available
                                ? `
                                    bg-emerald-500/10
                                    text-emerald-400
                                `
                                : `
                                    bg-white/[0.04]
                                    text-slate-600
                                `
                        }
                    `}
                >

                    {available
                        ? "Есть"
                        : "Нет"}

                </div>

            </div>

        </div>

    );

}





function ProductMeta({

    icon,

    label,

    value,

}: {

    icon: ReactNode;

    label: string;

    value: string;

}) {

    return (

        <div
            className="
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-white/[0.06]
                bg-black/10
                px-4
                py-3
            "
        >

            <div
                className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-white/[0.04]
                    text-slate-500
                "
            >

                {icon}

            </div>



            <div
                className="
                    min-w-0
                "
            >

                <div
                    className="
                        text-[10px]
                        uppercase
                        tracking-widest
                        text-slate-700
                    "
                >

                    {label}

                </div>



                <div
                    className="
                        mt-1
                        truncate
                        text-xs
                        font-medium
                        text-slate-300
                    "
                    title={value}
                >

                    {value}

                </div>

            </div>

        </div>

    );

}





function DownloadIcon() {

    return (

        <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >

            <path
                d="
                    M21 15
                    v4
                    a2 2 0 0 1-2 2
                    H5
                    a2 2 0 0 1-2-2
                    v-4
                "
            />

            <polyline
                points="
                    7 10
                    12 15
                    17 10
                "
            />

            <line
                x1="12"
                y1="15"
                x2="12"
                y2="3"
            />

        </svg>

    );

}





function ShoppingCartIcon() {

    return (

        <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >

            <circle
                cx="9"
                cy="20"
                r="1"
            />

            <circle
                cx="19"
                cy="20"
                r="1"
            />

            <path
                d="
                    M3 4
                    h2
                    l2.4 11.2
                    a2 2 0 0 0 2 1.6
                    h7.9
                    a2 2 0 0 0 1.9-1.4
                    L21 8
                    H6
                "
            />

        </svg>

    );

}





function FolderIcon() {

    return (

        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >

            <path
                d="
                    M3 7
                    h6
                    l2 2
                    h10
                    v10
                    a2 2 0 0 1-2 2
                    H5
                    a2 2 0 0 1-2-2
                    Z
                "
            />

            <path
                d="
                    M3 7
                    a2 2 0 0 1 2-2
                    h5
                    l2 2
                "
            />

        </svg>

    );

}





function UserIcon() {

    return (

        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >

            <circle
                cx="12"
                cy="8"
                r="4"
            />

            <path
                d="
                    M4 21
                    a8 8 0 0 1 16 0
                "
            />

        </svg>

    );

}





function CalendarIcon() {

    return (

        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >

            <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
            />

            <line
                x1="16"
                y1="2"
                x2="16"
                y2="6"
            />

            <line
                x1="8"
                y1="2"
                x2="8"
                y2="6"
            />

            <line
                x1="3"
                y1="10"
                x2="21"
                y2="10"
            />

        </svg>

    );

}





function ShieldIcon() {

    return (

        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >

            <path
                d="
                    M12 3
                    l8 4
                    v5
                    c0 5
                    -3.4 8
                    -8 9
                    -4.6-1
                    -8-4
                    -8-9
                    V7
                    Z
                "
            />

            <path
                d="
                    m9 12
                    2 2
                    4-4
                "
            />

        </svg>

    );

}





function ImageIcon() {

    return (

        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >

            <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
            />

            <circle
                cx="8.5"
                cy="8.5"
                r="1.5"
            />

            <path
                d="
                    m21 15
                    -5-5
                    L5 21
                "
            />

        </svg>

    );

}





function CheckIcon() {

    return (

        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >

            <polyline
                points="
                    20 6
                    9 17
                    4 12
                "
            />

        </svg>

    );

}





function InfoIcon() {

    return (

        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >

            <circle
                cx="12"
                cy="12"
                r="10"
            />

            <line
                x1="12"
                y1="16"
                x2="12"
                y2="12"
            />

            <line
                x1="12"
                y1="8"
                x2="12.01"
                y2="8"
            />

        </svg>

    );

}





function EmptyImage() {

    return (

        <div
            className="
                flex
                h-full
                w-full
                flex-col
                items-center
                justify-center
                bg-[#090C11]
                text-center
            "
        >

            <div
                className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white/[0.06]
                    bg-white/[0.025]
                    text-slate-700
                "
            >

                <ImageIcon />

            </div>



            <div
                className="
                    mt-4
                    text-xs
                    text-slate-700
                "
            >

                Изображение отсутствует

            </div>

        </div>

    );

}