import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.fixedWindow(5, "60 s"),
});

export async function middleware(req) {
    if (req.nextUrl.pathname.startsWith('/api/fetchOrders')) {
        const ip = req.headers.get('x-forwarded-for') ?? req.ip ?? 'anonymous'
        const key = `${ip}:${req.nextUrl.pathname}`

        let result = await ratelimit.limit(key)
        console.log(result)
        if (!result.success) {
            return new NextResponse("Too many requests", { status: 429 })
        }

        return NextResponse.next()
    }

    if (req.nextUrl.pathname.startsWith('/api/deleteChanges')) {
        const ip = req.headers.get('x-forwarded-for') ?? req.ip ?? 'anonymous'
        const key = `${ip}:${req.nextUrl.pathname}`

        let result = await ratelimit.limit(key)
        console.log(result)
        if (!result.success) {
            return new NextResponse("Too many requests", { status: 429 })
        }

        return NextResponse.next()
    }

    if (req.nextUrl.pathname.startsWith('/api/deliveryStatus')) {
        const ip = req.headers.get('x-forwarded-for') ?? req.ip ?? 'anonymous'
        const key = `${ip}:${req.nextUrl.pathname}`

        let result = await ratelimit.limit(key)
        console.log(result)
        if (!result.success) {
            return new NextResponse("Too many requests", { status: 429 })
        }

        return NextResponse.next()
    }

    if (req.nextUrl.pathname.startsWith('/api/productUpload')) {
        const ip = req.headers.get('x-forwarded-for') ?? req.ip ?? 'anonymous'
        const key = `${ip}:${req.nextUrl.pathname}`

        let result = await ratelimit.limit(key)
        console.log(result)
        if (!result.success) {
            return new NextResponse("Too many requests", { status: 429 })
        }

        return NextResponse.next()
    }

    if (req.nextUrl.pathname.startsWith('/api/updateChanges')) {
        const ip = req.headers.get('x-forwarded-for') ?? req.ip ?? 'anonymous'
        const key = `${ip}:${req.nextUrl.pathname}`

        let result = await ratelimit.limit(key)
        console.log(result)
        if (!result.success) {
            return new NextResponse("Too many requests", { status: 429 })
        }

        return NextResponse.next()
    }


}