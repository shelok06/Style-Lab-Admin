import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { addProducttoDB } from "@/actions/useractions"
import { getToken } from "next-auth/jwt"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

export async function POST(req) {
    try {
        const token = await getToken({ req })
        if (!token || !token.email) throw new Error("Unauthorized");
        const body = await req.json()
        console.log(body.body)
        const result = await cloudinary.uploader.upload(body.image, {
            resource_type: "image",
            public_id: body.product,
        })
        if (!result) throw new Error("Product not uploaded")

        let func = await addProducttoDB({ picture: result.secure_url, price: parseInt(body.price), product: body.product, brand: body.brand, quantity: body.quantity })

        if (!func.success) throw new Error(func.message)
        return NextResponse.json({ success: func.success, message: func.message })
    } catch (error) {
        return NextResponse.json({ success: false, message: error })
    }


}