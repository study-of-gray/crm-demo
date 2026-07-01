"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getEmployees() {
    const session = await auth();

    if (!session || session.user.type !== "employee") {
        return [];
    }

    // 只有管理员和经理可以查看所有员工
    if (session.user.role !== "ADMIN" && session.user.role !== "MANAGER") {
        return [];
    }

    const employees = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return employees;
}