import { NextResponse } from "next/server";
import { login } from "@/services/auth.service";
import { auth, signIn } from "@/auth";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    const user = await login(email, password);
    if (!user) {
        return NextResponse.json(
            { error: "账号或密码错误" },
            { status: 401 }
        );
    }

    // ✅ 在服务端登录（不会触发客户端重定向）
    await signIn("credentials", {
        email,
        password,
        redirect: false,
    });

    return NextResponse.json({ ok: true });
}