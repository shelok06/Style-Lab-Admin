import { NextResponse } from "next/server";
import { DeleteProducts } from "@/actions/useractions";

export async function POST(req){
    let body = await req.json()
    let data = await DeleteProducts(body.deleteIDs)
    
    return NextResponse.json({"success": true})
}