"use client";

import Link from "next/link";

import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState,
} from "react";

import JSZip from "jszip";

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
                    { name: "ld_bum" },
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

    const [
        user,
        setUser,
    ] = useState<User | null>(null);


    const [
        loaded,
        setLoaded,
    ] = useState(false);


    const [
        openCategories,
        setOpenCategories,
    ] = useState<string[]>([
        "Скины",
    ]);


    const [
        categoryPath,
        setCategoryPath,
    ] = useState<string[]>([]);


    const [
        name,
        setName,
    ] = useState("");


    const [
        price,
        setPrice,
    ] = useState("");


    const [
        description,
        setDescription,
    ] = useState("");


    const [
        dffFile,
        setDffFile,
    ] = useState<File | null>(null);


    const [
        txdFile,
        setTxdFile,
    ] = useState<File | null>(null);


    const [
        images,
        setImages,
    ] = useState<File[]>([]);


    const [
        previewImages,
        setPreviewImages,
    ] = useState<string[]>([]);


    const [
        pinned,
        setPinned,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState("");


    const [
        saving,
        setSaving,
    ] = useState(false);


    const [
        uploadProgress,
        setUploadProgress,
    ] = useState(0);


    useEffect(() => {

        const loadUser = () => {

            try {

                const saved =
                    localStorage.getItem(
                        "user"
                    );


                if (saved) {

                    setUser(
                        JSON.parse(
                            saved
                        )
                    );

                } else {

                    setUser(null);

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
        categoryPath.length > 0
            ? categoryPath.join(" / ")
            : "Категория не выбрана";


    const canCreate =
        Boolean(
            categoryPath.length > 0 &&
            name.trim() &&
            dffFile &&
            txdFile
        );


    const selectedCategoryIsLeaf =
        categoryPath.length > 0;


    function toggleCategory(
        categoryName: string
    ) {

        setOpenCategories(
            current =>

                current.includes(
                    categoryName
                )

                    ? current.filter(
                        item =>
                            item !== categoryName
                    )

                    : [
                        ...current,
                        categoryName,
                    ]
        );

    }


    function selectCategory(
        categoryName: string,
        parents: string[],
        hasChildren: boolean
    ) {

        if (hasChildren) {

            toggleCategory(
                categoryName
            );

            return;

        }


        setCategoryPath([
            ...parents,
            categoryName,
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


        const limited =
            onlyImages.slice(
                0,
                10
            );


        setImages(
            limited
        );


        const urls =
            limited.map(
                file =>
                    URL.createObjectURL(
                        file
                    )
            );


        setPreviewImages(
            urls
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

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                    },

                    body:
                        JSON.stringify({

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
            uploadUrl?: string;
            url?: string;
            key?: string;
            message?: string;
        } = {};


        try {

            data =
                text
                    ? JSON.parse(text)
                    : {};

        } catch {

            throw new Error(
                `Ошибка сервера (${response.status})`
            );

        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Не удалось получить URL загрузки"
            );

        }


        if (
            !data.uploadUrl ||
            !data.url
        ) {

            throw new Error(
                "S3 не вернул URL загрузки"
            );

        }


        return {

            uploadUrl:
                data.uploadUrl,

            url:
                data.url,

            key:
                data.key || "",

        };

    }


    async function uploadFileToS3(
        file: File,
        folder: string
    ) {

        const {
            uploadUrl,
            url,
        } =
            await getUploadUrl(
                file,
                folder
            );


        const response =
            await fetch(
                uploadUrl,
                {

                    method:
                        "PUT",

                    headers: {

                        "Content-Type":
                            file.type ||
                            "application/octet-stream",

                    },

                    body:
                        file,

                }
            );


        if (!response.ok) {

            throw new Error(
                `Ошибка загрузки файла ${file.name}: ${response.status}`
            );

        }


        return url;

    }


    /*
     * Создаём ZIP только один раз
     * при создании товара.
     *
     * В ZIP попадут оригинальные
     * имена DFF и TXD файлов.
     */

    async function createZipFile(
        dff: File,
        txd: File,
        productName: string
    ) {

        const zip =
            new JSZip();


        zip.file(
            dff.name,
            await dff.arrayBuffer()
        );


        zip.file(
            txd.name,
            await txd.arrayBuffer()
        );


        const zipBlob =
            await zip.generateAsync({

                type:
                    "blob",

                compression:
                    "DEFLATE",

                compressionOptions: {

                    level:
                        6,

                },

            });


        return new File(

            [
                zipBlob,
            ],

            `${productName}.zip`,

            {

                type:
                    "application/zip",

            }

        );

    }


    async function handleSubmit(
        e: FormEvent<HTMLFormElement>
    ) {

        e.preventDefault();


        if (saving) {

            return;

        }


        setError("");
        setUploadProgress(0);


        if (!user) {

            setError(
                "Пользователь не найден"
            );

            return;

        }


        if (!categoryPath.length) {

            setError(
                "Выберите конечную категорию"
            );

            return;

        }


        if (!name.trim()) {

            setError(
                "Введите название товара"
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
            ) ||
            numberPrice < 0
        ) {

            setError(
                "Некорректная цена"
            );

            return;

        }


        setSaving(true);


        try {

            /*
             * В S3 будут загружены:
             *
             * 1. DFF
             * 2. TXD
             * 3. ZIP
             * 4. изображения
             */

            const totalFiles =
                3 +
                images.length;


            let completedFiles =
                0;


            const updateProgress = () => {

                completedFiles += 1;


                setUploadProgress(
                    Math.round(
                        (
                            completedFiles /
                            totalFiles
                        ) * 100
                    )
                );

            };


            const folder =
                `products/${user.id}/${Date.now()}`;


            /*
             * DFF
             */

            const dffUrl =
                await uploadFileToS3(
                    dffFile,
                    folder
                );


            updateProgress();


            /*
             * TXD
             */

            const txdUrl =
                await uploadFileToS3(
                    txdFile,
                    folder
                );


            updateProgress();


            /*
             * Создаём ZIP
             *
             * Важно:
             * ZIP создаётся здесь только
             * один раз.
             */

            setUploadProgress(
                Math.round(
                    (
                        completedFiles /
                        totalFiles
                    ) * 100
                )
            );


            const zipFile =
                await createZipFile(
                    dffFile,
                    txdFile,
                    name.trim()
                );


            /*
             * Загружаем готовый ZIP в S3.
             */

            const zipUrl =
                await uploadFileToS3(
                    zipFile,
                    `${folder}/archive`
                );


            updateProgress();


            /*
             * Изображения
             */

            const imageUrls:
                string[] = [];


            for (
                const image of images
            ) {

                const imageUrl =
                    await uploadFileToS3(
                        image,
                        `${folder}/images`
                    );


                imageUrls.push(
                    imageUrl
                );


                updateProgress();

            }


            /*
             * Теперь отправляем в API
             * только ссылки S3.
             */

            const response =
                await fetch(
                    "/api/products/create",
                    {

                        method:
                            "POST",

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

                                description:
                                    description.trim(),

                                pinned:
                                    pinned,

                                author_id:
                                    user.id,

                                dff_file:
                                    dffUrl,

                                txd_file:
                                    txdUrl,

                                zip_file:
                                    zipUrl,

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
            } = {};


            try {

                data =
                    text
                        ? JSON.parse(text)
                        : {};

            } catch {

                throw new Error(
                    `Сервер вернул некорректный ответ (${response.status})`
                );

            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Ошибка создания товара"
                );

            }


            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Товар не был создан"
                );

            }


            setUploadProgress(
                100
            );


            alert(
                "Товар успешно создан"
            );


            window.location.href =
                "/catalog";


        } catch (error) {

            console.error(
                "CREATE PRODUCT FRONTEND ERROR:",
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

                <main
                    className="
                        flex
                        min-h-screen
                        items-center
                        justify-center
                        bg-[#080B10]
                        text-white
                    "
                >

                    <div
                        className="
                            text-center
                        "
                    >

                        <h1
                            className="
                                text-2xl
                                font-bold
                            "
                        >
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
                                transition
                                hover:bg-blue-500
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
                        mx-auto
                        max-w-7xl
                    "
                >

                    <div
                        className="
                            mb-8
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-xs
                                    uppercase
                                    tracking-widest
                                    text-blue-500
                                "
                            >
                                MAZEPOV CONNEXTION
                            </p>


                            <h1
                                className="
                                    mt-2
                                    text-3xl
                                    font-bold
                                "
                            >
                                Создание товара
                            </h1>


                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Загрузите мод в каталог
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


                    <div
                        className="
                            grid
                            gap-5
                            lg:grid-cols-[280px_1fr]
                        "
                    >

                        <aside
                            className="
                                h-fit
                                rounded-2xl
                                border
                                border-white/[0.07]
                                bg-[#0D1117]
                                p-3
                            "
                        >

                            <div
                                className="
                                    mb-3
                                    px-3
                                    text-[10px]
                                    font-medium
                                    uppercase
                                    tracking-widest
                                    text-slate-600
                                "
                            >
                                Категория
                            </div>


                            {
                                expandableCategories.map(
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

                                            toggle={
                                                toggleCategory
                                            }

                                        />

                                    )
                                )
                            }


                            <div
                                className="
                                    my-4
                                    h-px
                                    bg-white/5
                                "
                            />


                            {
                                simpleCategories.map(
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
                                )
                            }

                        </aside>


                        <form
                            onSubmit={
                                handleSubmit
                            }

                            className="
                                space-y-5
                            "
                        >

                            <section
                                className="
                                    rounded-2xl
                                    border
                                    border-white/[0.07]
                                    bg-[#0D1117]
                                    p-6
                                "
                            >

                                <div
                                    className={`

                                        rounded-xl
                                        border
                                        p-4
                                        transition

                                        ${
                                            selectedCategoryIsLeaf

                                                ? "border-blue-500/20 bg-blue-500/10"

                                                : "border-yellow-500/20 bg-yellow-500/10"
                                        }

                                    `}
                                >

                                    <div
                                        className="
                                            text-[10px]
                                            uppercase
                                            tracking-widest
                                            text-slate-500
                                        "
                                    >
                                        Выбранная категория
                                    </div>


                                    <div
                                        className={`

                                            mt-1
                                            font-semibold

                                            ${
                                                selectedCategoryIsLeaf
                                                    ? "text-white"
                                                    : "text-yellow-400"
                                            }

                                        `}
                                    >
                                        {categoryText}
                                    </div>


                                    {
                                        !selectedCategoryIsLeaf && (

                                            <div
                                                className="
                                                    mt-2
                                                    text-xs
                                                    text-yellow-400/70
                                                "
                                            >
                                                Выберите конечный раздел
                                            </div>

                                        )
                                    }

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

                                    placeholder="Название товара"

                                    className="
                                        mt-5
                                        h-12
                                        w-full
                                        rounded-xl
                                        border
                                        border-white/5
                                        bg-[#11161D]
                                        px-4
                                        outline-none
                                        transition
                                        placeholder:text-slate-600
                                        focus:border-blue-500/30
                                        focus:ring-2
                                        focus:ring-blue-500/10
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

                                    placeholder="Цена ₽"

                                    inputMode="decimal"

                                    className="
                                        mt-4
                                        h-12
                                        w-full
                                        rounded-xl
                                        border
                                        border-white/5
                                        bg-[#11161D]
                                        px-4
                                        outline-none
                                        transition
                                        placeholder:text-slate-600
                                        focus:border-blue-500/30
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

                                    placeholder="Описание товара"

                                    rows={5}

                                    className="
                                        mt-4
                                        w-full
                                        resize-none
                                        rounded-xl
                                        border
                                        border-white/5
                                        bg-[#11161D]
                                        p-4
                                        outline-none
                                        transition
                                        placeholder:text-slate-600
                                        focus:border-blue-500/30
                                    "
                                />

                            </section>


                            <section
                                className="
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-[#0D1117]
                                    p-6
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
                                                font-semibold
                                            "
                                        >
                                            Закрепить товар
                                        </h2>


                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                text-slate-500
                                            "
                                        >
                                            Товар будет выше остальных
                                        </p>

                                    </div>


                                    <button
                                        type="button"

                                        onClick={() =>
                                            setPinned(
                                                current =>
                                                    !current
                                            )
                                        }

                                        className={`

                                            relative
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

                                        <div
                                            className={`

                                                absolute
                                                top-1
                                                h-5
                                                w-5
                                                rounded-full
                                                bg-white
                                                shadow
                                                transition

                                                ${
                                                    pinned
                                                        ? "left-6"
                                                        : "left-1"
                                                }

                                            `}
                                        />

                                    </button>

                                </div>

                            </section>


                            <section
                                className="
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-[#0D1117]
                                    p-6
                                "
                            >

                                <div>

                                    <h2
                                        className="
                                            font-semibold
                                        "
                                    >
                                        Файлы мода
                                    </h2>


                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-slate-500
                                        "
                                    >
                                        DFF и TXD загружаются в S3. ZIP создаётся автоматически.
                                    </p>

                                </div>


                                <div
                                    className="
                                        mt-5
                                        grid
                                        gap-4
                                        sm:grid-cols-2
                                    "
                                >

                                    <UploadBox

                                        title="DFF"

                                        description=".dff"

                                        accept=".dff"

                                        file={
                                            dffFile
                                        }

                                        setFile={
                                            setDffFile
                                        }

                                    />


                                    <UploadBox

                                        title="TXD"

                                        description=".txd"

                                        accept=".txd"

                                        file={
                                            txdFile
                                        }

                                        setFile={
                                            setTxdFile
                                        }

                                    />

                                </div>


                                <div
                                    className="
                                        mt-4
                                        rounded-xl
                                        border
                                        border-blue-500/10
                                        bg-blue-500/5
                                        p-4
                                        text-xs
                                        text-slate-500
                                    "
                                >

                                    После загрузки DFF и TXD сайт автоматически
                                    создаст один ZIP-архив и сохранит его в S3.
                                    При последующих скачиваниях архив заново
                                    создаваться не будет.

                                </div>

                            </section>


                            <section
                                className="
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-[#0D1117]
                                    p-6
                                "
                            >

                                <div>

                                    <h2
                                        className="
                                            font-semibold
                                        "
                                    >
                                        Изображения
                                    </h2>


                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-slate-500
                                        "
                                    >
                                        До 10 изображений
                                    </p>

                                </div>


                                <label
                                    className="
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
                                        hover:border-blue-500/30
                                        hover:text-white
                                    "
                                >

                                    <input
                                        type="file"

                                        hidden

                                        multiple

                                        accept="image/png,image/jpeg,image/webp"

                                        onChange={
                                            changeImages
                                        }
                                    />


                                    <div
                                        className="
                                            text-sm
                                            font-medium
                                            text-slate-300
                                        "
                                    >
                                        Выбрать изображения
                                    </div>


                                    <div
                                        className="
                                            mt-1
                                            text-xs
                                            text-slate-600
                                        "
                                    >
                                        PNG, JPG или WEBP
                                    </div>

                                </label>


                                {
                                    previewImages.length > 0 && (

                                        <div
                                            className="
                                                mt-5
                                                grid
                                                grid-cols-2
                                                gap-3
                                                md:grid-cols-3
                                            "
                                        >

                                            {
                                                previewImages.map(
                                                    image => (

                                                        <img
                                                            key={
                                                                image
                                                            }

                                                            src={
                                                                image
                                                            }

                                                            alt="Предпросмотр"

                                                            className="
                                                                aspect-video
                                                                w-full
                                                                rounded-xl
                                                                border
                                                                border-white/5
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

                                    <div
                                        className="
                                            rounded-xl
                                            border
                                            border-red-500/20
                                            bg-red-500/10
                                            p-4
                                            text-sm
                                            text-red-400
                                        "
                                    >
                                        {error}
                                    </div>

                                )
                            }


                            {
                                saving && (

                                    <div
                                        className="
                                            rounded-xl
                                            border
                                            border-blue-500/20
                                            bg-blue-500/10
                                            p-4
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                text-sm
                                            "
                                        >

                                            <span
                                                className="
                                                    text-slate-300
                                                "
                                            >
                                                Загрузка файлов в S3...
                                            </span>


                                            <span
                                                className="
                                                    font-semibold
                                                    text-blue-400
                                                "
                                            >
                                                {uploadProgress}%
                                            </span>

                                        </div>


                                        <div
                                            className="
                                                mt-3
                                                h-2
                                                overflow-hidden
                                                rounded-full
                                                bg-white/5
                                            "
                                        >

                                            <div
                                                className="
                                                    h-full
                                                    rounded-full
                                                    bg-blue-600
                                                    transition-all
                                                "

                                                style={{
                                                    width:
                                                        `${uploadProgress}%`,
                                                }}
                                            />

                                        </div>

                                    </div>

                                )
                            }


                            <button
                                type="submit"

                                disabled={
                                    saving ||
                                    !canCreate
                                }

                                className="
                                    h-13
                                    w-full
                                    rounded-xl
                                    bg-blue-600
                                    px-5
                                    font-semibold
                                    transition
                                    hover:bg-blue-500
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >

                                {
                                    saving

                                        ? `Загрузка... ${uploadProgress}%`

                                        : "Создать товар"
                                }

                            </button>


                            {
                                !canCreate &&
                                !saving && (

                                    <p
                                        className="
                                            text-center
                                            text-xs
                                            text-slate-600
                                        "
                                    >
                                        Выберите конечную категорию,
                                        укажите название и добавьте
                                        DFF + TXD
                                    </p>

                                )
                            }

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

    toggle: (
        name: string
    ) => void;

};


function CategoryTree({

    item,

    parents,

    path,

    open,

    select,

    toggle,

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
        path[path.length - 1] ===
        item.name;


    return (

        <div>

            <button
                type="button"

                onClick={() => {

                    select(
                        item.name,
                        parents,
                        hasChildren
                    );

                }}

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
                        selected && !hasChildren

                            ? "bg-blue-600 text-white"

                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }

                `}
            >

                <span
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-2
                    "
                >

                    {
                        hasChildren && (

                            <span
                                className={`

                                    text-xs
                                    text-slate-600
                                    transition

                                    ${
                                        isOpen
                                            ? "rotate-90"
                                            : ""
                                    }

                                `}
                            >
                                ›
                            </span>

                        )
                    }


                    <span>
                        {item.name}
                    </span>

                </span>


                {
                    hasChildren && (

                        <span
                            className="
                                text-[10px]
                                text-slate-600
                            "
                        >
                            раздел
                        </span>

                    )
                }

            </button>


            {
                hasChildren &&
                isOpen && (

                    <div
                        className="
                            ml-3
                            border-l
                            border-white/5
                            pl-2
                        "
                    >

                        {
                            item.children!.map(
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

                                        toggle={
                                            toggle
                                        }

                                    />

                                )
                            )
                        }

                    </div>

                )
            }

        </div>

    );

}


type UploadBoxProps = {

    title: string;

    description: string;

    accept: string;

    file: File | null;

    setFile: (
        file: File | null
    ) => void;

};


function UploadBox({

    title,

    description,

    accept,

    file,

    setFile,

}: UploadBoxProps) {

    return (

        <label
            className="
                cursor-pointer
                rounded-xl
                border
                border-dashed
                border-white/10
                bg-[#11161D]
                p-7
                text-center
                transition
                hover:border-blue-500/40
                hover:bg-[#131922]
            "
        >

            <input
                type="file"

                hidden

                accept={
                    accept
                }

                onChange={
                    e =>
                        setFile(
                            e.target.files?.[0] ||
                            null
                        )
                }
            />


            <div
                className="
                    text-lg
                    font-semibold
                    text-blue-400
                "
            >
                {title}
            </div>


            <div
                className="
                    mt-1
                    text-xs
                    text-slate-600
                "
            >
                {description}
            </div>


            <p
                className="
                    mt-4
                    truncate
                    text-sm
                    text-slate-400
                "
            >
                {
                    file
                        ? file.name
                        : "Нажмите, чтобы выбрать"
                }
            </p>


            {
                file && (

                    <p
                        className="
                            mt-2
                            text-[11px]
                            text-green-400
                        "
                    >
                        Файл выбран
                    </p>

                )
            }

        </label>

    );

}