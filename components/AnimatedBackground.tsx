export default function AnimatedBackground(){

    return (

        <div
            className="
                fixed
                inset-0
                -z-10
                overflow-hidden
                bg-[#05070D]
            "
        >


            <div
                className="
                    absolute
                    -left-40
                    -top-40
                    h-[600px]
                    w-[600px]
                    rounded-full
                    bg-blue-600/30
                    blur-[140px]
                    animate-pulse
                "
            />



            <div
                className="
                    absolute
                    right-[-200px]
                    top-[20%]
                    h-[500px]
                    w-[500px]
                    rounded-full
                    bg-white/20
                    blur-[160px]
                    animate-pulse
                "
            />



            <div
                className="
                    absolute
                    bottom-[-200px]
                    left-[30%]
                    h-[700px]
                    w-[700px]
                    rounded-full
                    bg-indigo-900/40
                    blur-[180px]
                    animate-pulse
                "
            />



            <div
                className="
                    absolute
                    inset-0
                    bg-gradient-to-b
                    from-transparent
                    via-[#05070D]/40
                    to-[#05070D]
                "
            />


        </div>

    );

}