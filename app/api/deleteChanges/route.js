import { NextResponse } from "next/server";
import { deleteProducts } from "@/actions/useractions";
import { getToken } from "next-auth/jwt";

export async function DELETE(req) {
    try {
        const token = await getToken({ req })
        if (!token || !token.email) throw new Error("Unauthorized");
        let body = await req.json()
        let data = await deleteProducts(body.deleteIDs)
        if (!data.success) throw new Error(data.message)
        return NextResponse.json({ success: data.success, message: data.message })
    } catch (error) {
        return NextResponse.json({ success: false, message: error })
    }
}