"use client";

import Link from "next/link";

import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState,
} from "react";

import Header from "@/components/Header";



type User = {
    id: number;
    username: string;
    avatar?: string | null;
    role?: string;
};



type CatalogItem = {
    name: string;
    children?: CatalogItem[];
};



const expandableCategories: CatalogItem[] = [

    {
        name: "Скины",

        children: [
            { name: "Государственные" },
            { name: "Мафии" },
            { name: "Банды" },
            { name: "Гражданские" },
        ],
    },

    {
        name: "Оружие",

        children: [
            { name: "Ганпак" },
            { name: "Дигл" },
            { name: "ЮСП" },
            { name: "Револьвер" },
            { name: "АПС" },
            { name: "СВД ПСО" },
            { name: "СВД" },
            { name: "M4A4" },
            { name: "Абакан" },
            { name: "АС ВАЛ" },
            { name: "Гроза" },
            { name: "Дробовик" },
        ],
    },

    {
        name: "Интерьеры",

        children: [
            { name: "24/7" },
            { name: "ДПС / ППС / ФСБ" },
            { name: "Оружейка" },
            { name: "Ашан" },
            { name: "Аптека" },
            { name: "ПК клуб" },
            { name: "Особа" },
            { name: "Банк" },
        ],
    },

    {
        name: "Заменные территории",

        children: [
            { name: "24/7" },
            { name: "ЦР" },
            { name: "ФСИН" },
            { name: "Арзамас" },
            { name: "Батырево" },
            { name: "Южный" },
            { name: "Бизвар локации" },
            { name: "Вокзалы" },
        ],
    },

    {
        name: "Эффекты",

        children: [
            { name: "Кровь" },
            { name: "Эффект при попадании" },

            {
                name: "Эффект при убийстве и ноке",

                children: [
                    {
                        name: "ld_bum",
                    },
                ],
            },
        ],
    },

    {
        name: "Звуки",

        children: [
            {
                name: "Попадание",

                children: [
                    {
                        name: "Пистолеты",

                        children: [
                            { name: "M4A4" },
                            { name: "Абакан" },
                            { name: "Гроза" },
                            { name: "СВД" },
                        ],
                    },
                ],
            },
        ],
    },

];



const simpleCategories = [

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

    const [openCategories, setOpenCategories] =
        useState<string[]>([
            "Скины",
        ]);

    const [categoryPath, setCategoryPath] =
        useState<string[]>([
            "Скины",
        ]);

    const [name, setName] =
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

    const [previewImages, setPreviewImages] =
        useState<string[]>([]);

    const [pinned, setPinned] =
        useState(false);

    const [error, setError] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    const [uploadProgress, setUploadProgress] =
        useState("");



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



    const role =
        user?.role?.toUpperCase() ||
        "USER";



    const hasAccess =
        allowedRoles.includes(
            role
        );



    const categorySavePath =
        categoryPath.join("/");



    const categoryText =
        categoryPath.join(" / ");



    function toggleCategory(
        name: string
    ) {

        setOpenCategories(
            current =>
                current.includes(name)
                    ? current.filter(
                        item =>
                            item !== name
                    )
                    : [
                        ...current,
                        name,
                    ]
        );

    }



    function selectCategory(
        name: string,
        parents: string[],
        hasChildren: boolean
    ) {

        if (hasChildren) {

            toggleCategory(name);

            return;

        }



        setCategoryPath([
            ...parents,
            name,
        ]);

    }



    function selectSimpleCategory(
        category: string
    ) {

        setCategoryPath([
            category,
        ]);

    }



    function changeImages(
        e: ChangeEvent<HTMLInputElement>
    ) {

        const files =
            Array.from(
                e.target.files || []
            );



        const onlyImages =
            files.filter(
                file =>
                    file.type.startsWith(
                        "image/"
                    )
            );



        setImages(
            onlyImages
        );



        setPreviewImages(
            onlyImages.map(
                file =>
                    URL.createObjectURL(
                        file
                    )
            )
        );

    }



    async function getUploadUrl(
        file: File,
        folder: string
    ) {

        const response =
            await fetch(
                "/api/products/upload-url",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({

                        fileName:
                            file.name,

                        contentType:
                            file.type ||
                            "application/octet-stream",

                        folder,

                    }),

                }
            );



        const text =
            await response.text();



        let data: {
            success?: boolean;
            message?: string;
            uploadUrl?: string;
            fileUrl?: string;
        };



        try {

            data =
                JSON.parse(text);

        } catch {

            throw new Error(
                text ||
                "Сервер вернул некорректный ответ"
            );

        }



        if (
            !response.ok ||
            !data.success ||
            !data.uploadUrl ||
            !data.fileUrl
        ) {

            throw new Error(
                data.message ||
                "Не удалось получить ссылку S3"
            );

        }



        return data;

    }



    async function uploadFileToS3(
        file: File,
        folder: string,
        label: string
    ) {

        setUploadProgress(
            `Загрузка: ${label}`
        );



        const data =
            await getUploadUrl(
                file,
                folder
            );



        const response =
            await fetch(
                data.uploadUrl!,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            file.type ||
                            "application/octet-stream",

                    },

                    body: file,

                }
            );



        if (!response.ok) {

            const text =
                await response.text()
                    .catch(() => "");

            console.error(
                "S3 UPLOAD ERROR:",
                response.status,
                text
            );



            throw new Error(
                `Не удалось загрузить ${label} в S3 (${response.status})`
            );

        }



        return data.fileUrl!;

    }



    async function handleSubmit(
        e: FormEvent<HTMLFormElement>
    ) {

        e.preventDefault();



        setError("");

        setUploadProgress("");



        if (!user) {

            setError(
                "Пользователь не найден"
            );

            return;

        }



        if (!name.trim()) {

            setError(
                "Введите название товара"
            );

            return;

        }



        if (
            categoryPath.length < 2 &&
            expandableCategories.some(
                item =>
                    item.name ===
                    categoryPath[0]
            )
        ) {

            setError(
                "Выберите конечную категорию"
            );

            return;

        }



        if (!dffFile) {

            setError(
                "Добавьте DFF файл"
            );

            return;

        }



        if (!txdFile) {

            setError(
                "Добавьте TXD файл"
            );

            return;

        }



        const numberPrice =
            price.trim()
                ? Number(
                    price.replace(
                        ",",
                        "."
                    )
                )
                : 0;



        if (
            Number.isNaN(
                numberPrice
            )
        ) {

            setError(
                "Некорректная цена"
            );

            return;

        }



        setSaving(true);



        try {

            const folder =
                `products/${user.id}/${Date.now()}`;



            const dffUrl =
                await uploadFileToS3(
                    dffFile,
                    folder,
                    "DFF"
                );



            const txdUrl =
                await uploadFileToS3(
                    txdFile,
                    folder,
                    "TXD"
                );



            const imageUrls: string[] = [];



            for (
                let i = 0;
                i < images.length;
                i++
            ) {

                const image =
                    images[i];



                const url =
                    await uploadFileToS3(
                        image,
                        `${folder}/images`,
                        `изображение ${i + 1}`
                    );



                imageUrls.push(
                    url
                );

            }



            setUploadProgress(
                "Создание товара..."
            );



            const response =
                await fetch(
                    "/api/products/create",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                        },

                        body:
                            JSON.stringify({

                                name:
                                    name.trim(),

                                category:
                                    categorySavePath,

                                price:
                                    numberPrice,

                                description,

                                pinned,

                                author_id:
                                    user.id,

                                dff_file:
                                    dffUrl,

                                txd_file:
                                    txdUrl,

                                images:
                                    imageUrls,

                            }),

                    }
                );



            const text =
                await response.text();



            let data: {
                success?: boolean;
                message?: string;
            };



            try {

                data =
                    JSON.parse(text);

            } catch {

                throw new Error(
                    text ||
                    "Сервер вернул некорректный ответ"
                );

            }



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



        } catch (error) {

            console.error(
                "CREATE PRODUCT:",
                error
            );



            if (
                error instanceof Error
            ) {

                setError(
                    error.message
                );

            } else {

                setError(
                    "Ошибка сервера"
                );

            }

        } finally {

            setSaving(false);

            setUploadProgress("");

        }

    }



    if (!loaded) {

        return null;

    }



    if (
        !user ||
        !hasAccess
    ) {

        return (

            <>

                <Header />

                <main className="
                    min-h-screen
                    flex
                    items-center
                    justify-center
                    bg-[#080B10]
                    text-white
                ">

                    <div className="
                        text-center
                    ">

                        <h1 className="
                            text-2xl
                            font-bold
                        ">

                            Доступ запрещён

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
                px-4
                pb-20
                pt-[120px]
                text-white
            ">

                <div className="
                    mx-auto
                    max-w-7xl
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
                                tracking-widest
                                text-blue-500
                            ">

                                MAZEPOV CONNEXTION

                            </p>



                            <h1 className="
                                mt-2
                                text-3xl
                                font-bold
                            ">

                                Создание товара

                            </h1>



                            <p className="
                                mt-2
                                text-sm
                                text-slate-500
                            ">

                                Загрузка мода в каталог

                            </p>

                        </div>



                        <Link
                            href="/catalog"
                            className="
                                rounded-xl
                                border
                                border-white/10
                                px-4
                                py-2
                                text-sm
                                transition
                                hover:bg-white/5
                            "
                        >

                            Назад

                        </Link>

                    </div>



                    <div className="
                        grid
                        gap-5
                        lg:grid-cols-[280px_1fr]
                    ">

                        <aside className="
                            h-fit
                            rounded-2xl
                            border
                            border-white/[0.07]
                            bg-[#0D1117]
                            p-3
                        ">

                            <div className="
                                mb-3
                                px-3
                                text-[10px]
                                uppercase
                                tracking-widest
                                text-slate-600
                            ">

                                Категория товара

                            </div>



                            {expandableCategories.map(
                                item => (

                                    <CategoryTree
                                        key={
                                            item.name
                                        }

                                        item={
                                            item
                                        }

                                        parents={
                                            []
                                        }

                                        path={
                                            categoryPath
                                        }

                                        open={
                                            openCategories
                                        }

                                        select={
                                            selectCategory
                                        }

                                    />

                                )
                            )}



                            <div className="
                                my-4
                                h-px
                                bg-white/5
                            " />



                            {simpleCategories.map(
                                item => (

                                    <button
                                        key={
                                            item
                                        }

                                        type="button"

                                        onClick={() =>
                                            selectSimpleCategory(
                                                item
                                            )
                                        }

                                        className={`
                                            mb-1
                                            w-full
                                            rounded-xl
                                            px-3
                                            py-2.5
                                            text-left
                                            text-sm
                                            transition

                                            ${
                                                categoryPath.length === 1 &&
                                                categoryPath[0] === item

                                                    ? "bg-blue-600 text-white"

                                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                                            }
                                        `}
                                    >

                                        {item}

                                    </button>

                                )
                            )}

                        </aside>



                        <form
                            onSubmit={
                                handleSubmit
                            }

                            className="
                                space-y-5
                            "
                        >

                            <section className="
                                rounded-2xl
                                border
                                border-white/[0.07]
                                bg-[#0D1117]
                                p-6
                            ">

                                <div className="
                                    rounded-xl
                                    border
                                    border-blue-500/20
                                    bg-blue-500/10
                                    p-4
                                ">

                                    <div className="
                                        text-[10px]
                                        uppercase
                                        tracking-widest
                                        text-blue-400
                                    ">

                                        Категория

                                    </div>



                                    <div className="
                                        mt-1
                                        font-semibold
                                    ">

                                        {categoryText}

                                    </div>

                                </div>



                                <input
                                    value={
                                        name
                                    }

                                    onChange={
                                        e =>
                                            setName(
                                                e.target.value
                                            )
                                    }

                                    placeholder="
                                        Название товара
                                    "

                                    className="
                                        mt-5
                                        h-12
                                        w-full
                                        rounded-xl
                                        bg-[#11161D]
                                        px-4
                                        outline-none
                                        transition
                                        focus:ring-2
                                        focus:ring-blue-500/30
                                    "
                                />



                                <input
                                    value={
                                        price
                                    }

                                    onChange={
                                        e =>
                                            setPrice(
                                                e.target.value.replace(
                                                    /[^0-9.,]/g,
                                                    ""
                                                )
                                            )
                                    }

                                    placeholder="
                                        Цена ₽
                                    "

                                    className="
                                        mt-4
                                        h-12
                                        w-full
                                        rounded-xl
                                        bg-[#11161D]
                                        px-4
                                        outline-none
                                        transition
                                        focus:ring-2
                                        focus:ring-blue-500/30
                                    "
                                />



                                <textarea
                                    value={
                                        description
                                    }

                                    onChange={
                                        e =>
                                            setDescription(
                                                e.target.value
                                            )
                                    }

                                    placeholder="
                                        Описание товара
                                    "

                                    rows={
                                        5
                                    }

                                    className="
                                        mt-4
                                        w-full
                                        resize-none
                                        rounded-xl
                                        bg-[#11161D]
                                        p-4
                                        outline-none
                                        transition
                                        focus:ring-2
                                        focus:ring-blue-500/30
                                    "
                                />

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

                                            Закрепить товар

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
                                                    ? "bg-blue-600"
                                                    : "bg-white/10"
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
                                                    ? "translate-x-6"
                                                    : "translate-x-1"
                                            }
                                        `} />

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



                                <p className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                ">

                                    Файлы загружаются напрямую в S3

                                </p>



                                <div className="
                                    mt-5
                                    grid
                                    gap-4
                                    sm:grid-cols-2
                                ">

                                    <UploadBox
                                        title="DFF файл"
                                        accept=".dff"
                                        file={
                                            dffFile
                                        }
                                        setFile={
                                            setDffFile
                                        }
                                    />

                                    <UploadBox
                                        title="TXD файл"
                                        accept=".txd"
                                        file={
                                            txdFile
                                        }
                                        setFile={
                                            setTxdFile
                                        }
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
                                    border
                                    border-dashed
                                    border-white/10
                                    bg-[#11161D]
                                    p-10
                                    text-center
                                    text-sm
                                    text-slate-400
                                    transition
                                    hover:border-blue-500/40
                                    hover:text-white
                                ">

                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        accept="image/*"
                                        onChange={
                                            changeImages
                                        }
                                    />

                                    Нажмите, чтобы выбрать изображения

                                    <div className="
                                        mt-2
                                        text-xs
                                        text-slate-600
                                    ">

                                        PNG, JPG, WEBP

                                    </div>

                                </label>



                                {previewImages.length > 0 && (

                                    <div className="
                                        mt-5
                                        grid
                                        grid-cols-2
                                        gap-3
                                        md:grid-cols-3
                                    ">

                                        {previewImages.map(
                                            image => (

                                                <img
                                                    key={
                                                        image
                                                    }
                                                    src={
                                                        image
                                                    }
                                                    alt="preview"
                                                    className="
                                                        aspect-video
                                                        rounded-xl
                                                        object-cover
                                                    "
                                                />

                                            )
                                        )}

                                    </div>

                                )}

                            </section>



                            {uploadProgress && (

                                <div className="
                                    rounded-xl
                                    border
                                    border-blue-500/20
                                    bg-blue-500/10
                                    p-4
                                    text-sm
                                    text-blue-300
                                ">

                                    {uploadProgress}

                                </div>

                            )}



                            {error && (

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

                            )}



                            <button
                                type="submit"

                                disabled={
                                    saving
                                }

                                className="
                                    h-12
                                    w-full
                                    rounded-xl
                                    bg-blue-600
                                    font-semibold
                                    transition
                                    hover:bg-blue-500
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >

                                {saving
                                    ? "Загрузка..."
                                    : "Создать товар"
                                }

                            </button>

                        </form>

                    </div>

                </div>

            </main>

        </>

    );

}



type CategoryTreeProps = {

    item: CatalogItem;

    parents: string[];

    path: string[];

    open: string[];

    select: (
        name: string,
        parents: string[],
        hasChildren: boolean
    ) => void;

};



function CategoryTree({

    item,

    parents,

    path,

    open,

    select,

}: CategoryTreeProps) {

    const hasChildren =
        Boolean(
            item.children?.length
        );



    const isOpen =
        open.includes(
            item.name
        );



    const selected =
        !hasChildren &&
        path[path.length - 1] ===
        item.name;



    return (

        <div>

            <button
                type="button"

                onClick={() =>
                    select(
                        item.name,
                        parents,
                        hasChildren
                    )
                }

                className={`
                    mb-1
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    transition

                    ${
                        selected
                            ? "bg-blue-600 text-white"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }
                `}
            >

                <span className="
                    flex
                    items-center
                    gap-2
                ">

                    {hasChildren && (

                        <span className="
                            text-xs
                            text-slate-600
                        ">

                            {isOpen
                                ? "▼"
                                : "▶"
                            }

                        </span>

                    )}

                    {item.name}

                </span>



                {hasChildren && (

                    <span className="
                        text-[10px]
                        uppercase
                        tracking-wider
                        text-slate-600
                    ">

                        раздел

                    </span>

                )}

            </button>



            {hasChildren && isOpen && (

                <div className="
                    ml-3
                    border-l
                    border-white/5
                    pl-2
                ">

                    {item.children!.map(
                        child => (

                            <CategoryTree
                                key={
                                    child.name
                                }

                                item={
                                    child
                                }

                                parents={[
                                    ...parents,
                                    item.name,
                                ]}

                                path={
                                    path
                                }

                                open={
                                    open
                                }

                                select={
                                    select
                                }

                            />

                        )
                    )}

                </div>

            )}

        </div>

    );

}



type UploadBoxProps = {

    title: string;

    accept: string;

    file: File | null;

    setFile: (
        file: File | null
    ) => void;

};



function UploadBox({

    title,

    accept,

    file,

    setFile,

}: UploadBoxProps) {

    return (

        <label className="
            cursor-pointer
            rounded-xl
            border
            border-dashed
            border-white/10
            bg-[#11161D]
            p-8
            text-center
            transition
            hover:border-blue-500/40
            hover:bg-[#131922]
        ">

            <input
                type="file"
                hidden
                accept={accept}

                onChange={
                    e =>
                        setFile(
                            e.target.files?.[0]
                            || null
                        )
                }
            />



            <div className="
                text-blue-400
                font-semibold
            ">

                {title}

            </div>



            <p className="
                mt-3
                truncate
                text-sm
                text-slate-400
            ">

                {file
                    ? file.name
                    : "Выбрать файл"
                }

            </p>

        </label>

    );

}