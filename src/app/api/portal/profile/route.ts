import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    const session = await auth();

    if (!session || session.user.type !== "customer") {
        return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const { name, phone, description } = await req.json();

    await prisma.customer.update({
        where: { email: session.user.email },
        data: { name, phone, description },
    });

    return NextResponse.json({ success: true });
}