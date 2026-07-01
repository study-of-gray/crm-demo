"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getCustomers() {
    const session = await auth();

    if (!session || session.user.type !== "employee") {
        return [];
    }

    // 根据角色过滤数据
    const isAdminOrManager = session.user.role === "ADMIN" || session.user.role === "MANAGER";

    const customers = await prisma.customer.findMany({
        where: isAdminOrManager ? {} : { assignedStaff: { some: { userId: session.user.id } } },
        include: {
            assignedStaff: {
                include: {
                    user: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return customers;
}