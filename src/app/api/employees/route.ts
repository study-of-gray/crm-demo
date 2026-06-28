import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();

    if (!session || session.user.type !== "employee") {
        return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    // 只有管理员和经理可以获取所有员工
    if (session.user.role !== "ADMIN" && session.user.role !== "MANAGER") {
        return NextResponse.json({ error: "权限不足" }, { status: 403 });
    }

    const employees = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            role: true,
            email: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    return NextResponse.json(employees);
}