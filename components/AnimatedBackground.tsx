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
                bg-[#03050A]
            "
        >

            {/* Яркий бело-синий центр */}
            <div
                className="
                    absolute
                    left-[-15%]
                    top-[-20%]
                    h-[750px]
                    w-[750px]
                    rounded-full
                    bg-blue-500/40
                    blur-[180px]
                    animate-bg-1
                "
            />


            {/* Справа яркий синий */}
            <div
                className="
                    absolute
                    right-[-10%]
                    top-[10%]
                    h-[700px]
                    w-[700px]
                    rounded-full
                    bg-cyan-400/30
                    blur-[170px]
                    animate-bg-2
                "
            />


            {/* Белое свечение */}
            <div
                className="
                    absolute
                    left-[35%]
                    top-[25%]
                    h-[500px]
                    w-[500px]
                    rounded-full
                    bg-white/20
                    blur-[160px]
                    animate-bg-3
                "
            />


            {/* Нижний глубокий синий */}
            <div
                className="
                    absolute
                    bottom-[-25%]
                    left-[15%]
                    h-[800px]
                    w-[800px]
                    rounded-full
                    bg-blue-700/50
                    blur-[200px]
                    animate-bg-4
                "
            />


            {/* Тёмный слой для контраста */}
            <div
                className="
                    absolute
                    inset-0
                    bg-black/30
                "
            />

        </div>
    );
}