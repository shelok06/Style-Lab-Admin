import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export const authOptions = NextAuth({
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                username: { label: "username", type: "text", placeholder: "Your name here" },
                email: { label: "email", type: "text", placeholder: "Your Email here" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials, req) {
                const ip = req.headers['x-forwarded-for'] ?? req.ip ?? 'anonymous'
                const key = `login_attempts:${ip}`;

                const attempts = await redis.get(key) || 0;

                if (attempts >= 5) {
                    throw new Error("Too many login attempts. Try again later.");
                }

                console.log(attempts)
                if (credentials.username === process.env.USER_NAME && credentials.password === process.env.PASSWORD && credentials.email === process.env.EMAIL) {
                    const user = { name: credentials.username, email: credentials.email }
                    await redis.del(key);
                    return user
                }

                await redis.incr(key)
                await redis.expire(key, 60 * 5);
                throw new Error("Invalid Credentials")

            },
            async jwt({ token, account, profile }) {
                console.log(token)
                return token
            },
        })
    ]
})

export { authOptions as GET, authOptions as POST }