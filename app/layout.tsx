import type { Metadata } from "next";

import "./globals.css";

import AnimatedBackground from "@/components/AnimatedBackground";



export const metadata: Metadata = {

    title: "MAZEPOV CONNEXTION",

    description:
        "Магазин модов MAZEPOV CONNEXTION",

};





export default function RootLayout({

    children,

}: Readonly<{

    children: React.ReactNode;

}>) {


    return (

        <html

            lang="ru"

            translate="no"

        >


            <head>

                <meta

                    name="google"

                    content="notranslate"

                />

            </head>



            <body

                className="
                    relative
                    min-h-screen
                    overflow-x-hidden
                    bg-[#05070D]
                    text-white
                    antialiased
                "

            >



                <AnimatedBackground />



                <div

                    className="
                        relative
                        z-10
                        min-h-screen
                    "

                >

                    {children}

                </div>



            </body>



        </html>

    );

}

