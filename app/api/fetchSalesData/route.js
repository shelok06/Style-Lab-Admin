import { NextResponse } from "next/server";
import { dataCalcultion } from "@/actions/useractions";

export async function GET() {
    try {
        let func = await dataCalcultion()
        if (!func.success) throw new Error(func.message)
        return NextResponse.json({ success: func.success, message: func.message })
    } catch (error) {
        return NextResponse.json({ success: false, message: error })
    }
}