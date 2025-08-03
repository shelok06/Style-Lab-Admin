import { NextResponse } from "next/server";
import { pdfCreator } from "@/actions/useractions";
import fs from 'fs'

export async function POST(req) {
    let body = await req.json()
    const pdf = await pdfCreator(body.orders)
    if (pdf) {
        return new NextResponse(pdf, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "attachment; filename=generated.pdf",
            }
        })
    }
}