import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
    employeeLogin,
    customerLogin,
} from "@/services/auth.service"; // ✅ 两个都导入

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
                type: {}, // ✅ 关键：接收身份类型
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password || !credentials?.type) {
                    throw new Error("Missing credentials");
                    // return null;
                }

                let user = null;

                // ✅ 根据类型调用不同登录逻辑
                if (credentials.type === "employee") {
                    user = await employeeLogin(
                        credentials.email,
                        credentials.password
                    );
                } else if (credentials.type === "customer") {
                    user = await customerLogin(
                        credentials.email,
                        credentials.password
                    );
                }
                if (!user) {
                    throw new Error("Invalid credentials");
                }

                return user ?? null;
            },
        }),
    ],

    pages: {
        signIn: "/login",
        error: "/login",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.type = user.type; // ✅ 存储身份类型
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.type = token.type as string;
            }
            return session;
        },
    },
};

export const { handlers, auth, signIn, signOut } =
    NextAuth(authOptions);