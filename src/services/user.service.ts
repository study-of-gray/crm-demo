import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getCustomer(id: string) {
    const session = await auth();
    if (!session) throw new Error("未登录");

    return prisma.customer.findUnique({
        where: { id },
        // include: { user: true },
    });
}