import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
                if (credentials.username === process.env.USER_NAME && credentials.password === process.env.PASSWORD && credentials.email === process.env.EMAIL) {
                    const user = { name: credentials.username, email: credentials.email }
                    return user
                }
                else {
                    console.log("Unauthorized")
                    return null
                }
            },
            async jwt({ token, account, profile }) {
                console.log(token)
                return token
            },
        })
    ]
})

export { authOptions as GET, authOptions as POST }