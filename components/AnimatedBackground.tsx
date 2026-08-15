export default function AnimatedBackground(){

    return (

        <div
            className="
                fixed
                inset-0
                z-0
                overflow-hidden
                bg-[#05070D]
            "
        >


            <div
                className="
                    absolute
                    left-[-150px]
                    top-[-150px]
                    h-[500px]
                    w-[500px]
                    rounded-full
                    bg-blue-600
                    opacity-30
                    blur-[120px]
                    animate-[float_10s_ease-in-out_infinite]
                "
            />


            <div
                className="
                    absolute
                    right-[-150px]
                    top-[20%]
                    h-[450px]
                    w-[450px]
                    rounded-full
                    bg-white
                    opacity-20
                    blur-[120px]
                    animate-[float_12s_ease-in-out_infinite]
                "
            />



            <div
                className="
                    absolute
                    bottom-[-200px]
                    left-[35%]
                    h-[600px]
                    w-[600px]
                    rounded-full
                    bg-blue-900
                    opacity-50
                    blur-[150px]
                    animate-[float_15s_ease-in-out_infinite]
                "
            />



        </div>

    );

}

