import { prisma } from "@/lib/prisma";
import type { Customer } from "@prisma/client";

export async function getCustomers(userId: string): Promise<Customer[]> {
    return prisma.customer.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}

export async function getCustomerById(id: string, userId: string): Promise<Customer | null> {
    return prisma.customer.findFirst({
        where: {
            id,
            userId,
        },
    });
}

// 创建客户
export async function createCustomer(
    data: Omit<Customer, "id" | "createdAt" | "userId">,
    userId: string
): Promise<Customer> {
    return prisma.customer.create({
        data: {
            ...data,
            userId, // ✅ 绑定归属
        },
    });
}

// 更新客户（并校验归属）
export async function updateCustomer(
    id: string,
    data: Partial<Customer>,
    userId: string
): Promise<Customer> {
    // 先校验是否存在且属于当前用户
    const existing = await prisma.customer.findFirst({
        where: { id, userId },
    });

    if (!existing) {
        throw new Error("无权操作该客户");
    }

    return prisma.customer.update({
        where: { id },
        data,
    });
}