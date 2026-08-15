"use client";

export default function AnimatedBackground() {
    return (
        <div
            className="
                pointer-events-none
                fixed
                inset-0
                -z-0
                overflow-hidden
                bg-[#05070D]
            "
        >

            {/* Белое свечение */}
            <div
                className="
                    absolute
                    left-[-10%]
                    top-[-20%]
                    h-[600px]
                    w-[600px]
                    rounded-full
                    bg-white/[0.12]
                    blur-[140px]
                    animate-background-one
                "
            />


            {/* Ярко-синий шар */}
            <div
                className="
                    absolute
                    right-[-15%]
                    top-[20%]
                    h-[650px]
                    w-[650px]
                    rounded-full
                    bg-blue-500/[0.18]
                    blur-[160px]
                    animate-background-two
                "
            />


            {/* Тёмно-синий */}
            <div
                className="
                    absolute
                    bottom-[-20%]
                    left-[20%]
                    h-[550px]
                    w-[550px]
                    rounded-full
                    bg-blue-900/[0.35]
                    blur-[170px]
                    animate-background-three
                "
            />


            {/* лёгкая сетка */}
            <div
                className="
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]
                "
            />

        </div>
    );
}