import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { changedelivery } from "@/actions/useractions";

export async function POST(req) {
    try {
        let token = await getToken({ req })
        if (!token || !token.email) throw new Error("Unauthorized");

        let body = await req.json()
        let func = await changedelivery(body.id)
        if (!func.success) throw new Error(func.message)
        return NextResponse.json({ success: func.success, message: func.message })
    } catch (error) {
        return NextResponse.json({ success: false, message: error })
    }
}