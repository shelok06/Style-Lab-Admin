import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { updateProduct } from "@/actions/useractions";
import { getToken } from "next-auth/jwt";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

export async function PUT(req) {
    try {
        const token = await getToken({ req })
        if (!token || !token.email) throw new Error("Unauthorized");

        let body = await req.json()
        let item = body.item
        if (item.picture) {
            const result = await cloudinary.uploader.upload(body.item.picture, {
                resource_type: "image",
                public_id: body.product,
            })
            if (!result) throw new Error("Server Error")

            let item2 = { ...item, picture: result.secure_url }
            let func = await updateProduct(item2, body.id)
            if (!func.success) throw new Error(func.message)

            return NextResponse.json({ success: func.success, message: func.message })
        } else {
            let func = await updateProduct(item, body.id)
            if (!func.success) throw new Error(func.message)
            return NextResponse.json({ success: func.success, message: func.message })
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: error })
    }
}