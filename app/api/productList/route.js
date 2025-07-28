import { NextResponse } from "next/server";
import { fetchProducts } from "@/actions/useractions";
import { getToken } from "next-auth/jwt"

export async function POST(req) {
    try {
        const token = await getToken({ req })
        if (!token || !token.email) throw new Error("Unauthorized");

        let data = await fetchProducts()
        return NextResponse.json({ success: data.success, "data": data.message })
    } catch (error) {
        return NextResponse.json({ success: false, message: error })
    }
}