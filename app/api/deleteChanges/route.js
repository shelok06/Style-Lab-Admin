import { NextResponse } from "next/server";
import { deleteProducts } from "@/actions/useractions";

export async function DELETE(req){
    let body = await req.json()
    let data = await deleteProducts(body.deleteIDs)
    
    return NextResponse.json({"success": true})
}