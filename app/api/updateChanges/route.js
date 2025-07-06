import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { updateProduct } from "@/actions/useractions";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

export async function PUT(req) {
    let body = await req.json()
    let item = body.item
    if (item.picture) {
        const result = await cloudinary.uploader.upload(body.item.picture, {
            resource_type: "image",
            public_id: body.product,
        })
        let item2 = { ...item, picture: result.secure_url }
        let func = await updateProduct(item2, body.id)
        console.log(func)
    } else {
        let func = await updateProduct(item, body.id)
        console.log(func)
    }

    return NextResponse.json({ "success": true })
}