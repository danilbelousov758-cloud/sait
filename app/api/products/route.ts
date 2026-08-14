import { NextResponse } from "next/server";

const products: any[] = [];

export async function POST(
    request: Request
) {
    try {
        const data = await request.json();

        const product = {
            id: Date.now(),

            name: data.name,

            category: data.category,

            price:
                Number(data.price) || 0,

            description:
                data.description || "",

            pinned:
                data.pinned || false,

            dff:
                data.dff || null,

            txd:
                data.txd || null,

            images:
                data.images || [],

            author:
                data.author,

            createdAt:
                new Date(),
        };


        products.push(product);


        return NextResponse.json(
            {
                success: true,
                product,
            },
            {
                status: 201,
            }
        );


    } catch (error) {

        return NextResponse.json(
            {
                success:false,
                error:"Ошибка создания товара"
            },
            {
                status:500
            }
        );

    }
}


export async function GET(){

    return NextResponse.json(
        products
    );

}