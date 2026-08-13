import Link from "next/link";

const images = [
    {
        src: "/images/mod-1.png",
        alt: "Мод 1",
    },
    {
        src: "/images/mod-2.png",
        alt: "Мод 2",
    },
    {
        src: "/images/mod-3.png",
        alt: "Мод 3",
    },
    {
        src: "/images/mod-4.png",
        alt: "Мод 4",
    },
    {
        src: "/images/mod-5.png",
        alt: "Мод 5",
    },
];

export default function Hero() {
    return (
        <section className="px-5 pb-20 pt-32 sm:pt-36 md:px-8">
            <div className="mx-auto max-w-6xl">

                {/* Галерея */}
                <div className="grid h-[280px] grid-cols-4 gap-2.5 sm:h-[340px] sm:gap-3">

                    {/* Большое изображение */}
                    <div className="group relative col-span-2 row-span-2 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11161D]">
                        <img
                            src={images[0].src}
                            alt={images[0].alt}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>

                    {/* Четыре маленьких изображения */}
                    {images.slice(1).map((image) => (
                        <div
                            key={image.src}
                            className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11161D]"
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />

                            <div className="pointer-events-none absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-transparent" />
                        </div>
                    ))}
                </div>

                {/* Текстовый блок */}
                <div className="mt-3 rounded-2xl border border-white/[0.07] bg-[#11161D] px-6 py-7 sm:px-8 sm:py-8">
                    <div className="max-w-2xl">

                        <h1 className="text-3xl font-bold tracking-[-0.035em] text-white sm:text-4xl md:text-5xl">
                            Моды в одном месте.
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                            Находи, скачивай и покупай модификации
                            для своих любимых игр.
                        </p>

                        <Link
                            href="/catalog"
                            className="mt-6 inline-flex h-10 items-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition-all duration-200 hover:bg-blue-500"
                        >
                            Открыть каталог

                            <span className="ml-2 text-blue-200">
                                →
                            </span>
                        </Link>

                    </div>
                </div>
            </div>
        </section>
    );
}