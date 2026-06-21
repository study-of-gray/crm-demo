import { employeeLogin, customerLogin } from "@/services/auth.service";
import { signIn } from "@/auth";
import { NextResponse } from "next/server";

export async function login(req: Request) {
    const { email, password, type } = await req.json();

    let user = null;

    // ✅ 根据类型调用不同登录逻辑
    if (type === "employee") {
        user = await employeeLogin(email, password);
    } else if (type === "customer") {
        user = await customerLogin(email, password);
    }

    if (!user) {
        return NextResponse.json(
            { error: "账号或密码错误" },
            { status: 401 }
        );
    }

    // ✅ 设置 Session（NextAuth）
    await signIn("credentials", {
        email,
        password,
        redirect: false,
    });

    return NextResponse.json({
        ok: true,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            type, // ✅ 返回身份类型
        },
    });
}