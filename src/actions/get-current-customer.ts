"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentCustomerProfile() {
    const session = await auth();

    if (!session || session.user.type !== "customer") {
        return null;
    }

    return prisma.customer.findUnique({
        where: { email: session.user.email },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            description: true,
        },
    });
}