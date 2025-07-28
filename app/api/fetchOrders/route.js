import { NextResponse } from "next/server";
import { getOrders } from "@/actions/useractions";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
    try {
        const token = await getToken({ req })
        if (!token || !token.email) throw new Error("Unauthorized");

        const url = await req.url
        let query = new URLSearchParams(url.split('?')[1])
        let date = query.get('date')
        if (!date) throw new Error("API Error")

        let func = await getOrders(date)
        if(!func.success) throw new Error(func.message)
        return NextResponse.json({ success: func.success, data: func.message })
    }
    catch (error) {
        console.error("API error : ", error.message)
        return NextResponse.json({ success: false, error: "Server error" })
    }
}