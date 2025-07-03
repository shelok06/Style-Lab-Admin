import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { addProducttoDB } from "@/actions/useractions"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

export async function POST(req) {
    const body = await req.json()
    console.log(body)
    const result = await cloudinary.uploader.upload(body.image, {
        resource_type: "image",
        public_id: body.product,
    })
    console.log(result)

    let func = await addProducttoDB({picture: result.secure_url, price: body.price,  product: body.product, brand: body.brand, quantity: body.quantity})

    return NextResponse.json({ success: "true" })
}