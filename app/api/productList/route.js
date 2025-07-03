import { NextResponse } from "next/server";
import { fetchProducts } from "@/actions/useractions";

export async function GET(){
    let data = await fetchProducts()
    return NextResponse.json({"data": data})
}