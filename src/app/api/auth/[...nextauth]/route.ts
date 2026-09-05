import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth" // Adjust this path to wherever your auth options are stored

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
