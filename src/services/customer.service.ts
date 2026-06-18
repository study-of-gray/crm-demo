import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getCustomers(userId: string) {
    return prisma.customer.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}

export async function getCustomer(id: string, userId: string) {
    return prisma.customer.findFirst({
        where: {
            id,
            userId,
        },
    });
}