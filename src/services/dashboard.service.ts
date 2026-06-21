"use server";

import { prisma } from "@/lib/prisma";

// ✅ 获取员工仪表盘统计数据
export async function getEmployeeStats(
    userId: string,
    role: string
) {
    let totalCustomers = 0;
    let myCustomers = 0;

    if (role === "ADMIN" || role === "MANAGER") {
        // 管理员/经理：统计公司所有客户
        totalCustomers = await prisma.customer.count();
        myCustomers = await prisma.customerAssignment.count({
            where: { userId },
        });
    } else {
        // 员工：只统计自己负责的客户
        myCustomers = await prisma.customerAssignment.count({
            where: { userId },
        });
        totalCustomers = myCustomers;
    }

    // 本月新增客户
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const newThisMonth = await prisma.customer.count({
        where: {
            createdAt: {
                gte: startOfMonth,
            },
            ...(role === "STAFF" && {
                assignedStaff: {
                    some: { userId },
                },
            }),
        },
    });

    // 待跟进客户（示例：7天内未联系）
    const pendingFollowUp = await prisma.customer.count({
        where: {
            ...(role === "STAFF" && {
                assignedStaff: {
                    some: { userId },
                },
            }),
            // 这里可以根据实际业务添加跟进时间条件
            createdAt: {
                lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
        },
    });

    return {
        totalCustomers,
        myCustomers,
        newThisMonth,
        pendingFollowUp,
    };
}

// ✅ 获取最近客户
export async function getRecentCustomers(userId: string) {
    return prisma.customer.findMany({
        where: {
            assignedStaff: {
                some: { userId },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
        },
    });
}