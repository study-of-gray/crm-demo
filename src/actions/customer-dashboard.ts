"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getCustomerDashboardStats() {
    const session = await auth();

    if (!session || session.user.type !== "customer") {
        return {
            customerName: "",
            unreadMessages: 0,
            totalDocuments: 0,
            openTickets: 0,
            recentMessages: [],
            recentTickets: [],
        };
    }

    const customer = await prisma.customer.findUnique({
        where: { email: session.user.email },
        select: {
            id: true,
            name: true,
        },
    });

    if (!customer) {
        return {
            customerName: "",
            unreadMessages: 0,
            totalDocuments: 0,
            openTickets: 0,
            recentMessages: [],
            recentTickets: [],
        };
    }

    const [
        unreadMessages,
        totalDocuments,
        openTickets,
        recentMessages,
        recentTickets,
    ] = await Promise.all([
        // 未读消息数
        prisma.message.count({
            where: {
                receiverId: customer.id,
                isRead: false,
            },
        }),

        // 文档总数
        prisma.document.count({
            where: {
                customerId: customer.id,
            },
        }),

        // 待处理工单数
        prisma.ticket.count({
            where: {
                customerId: customer.id,
                status: "OPEN",
            },
        }),

        // 最近5条消息
        prisma.message.findMany({
            where: {
                receiverId: customer.id,
            },
            include: {
                sender: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: 5,
        }),

        // 最近5个工单
        prisma.ticket.findMany({
            where: {
                customerId: customer.id,
            },
            orderBy: { createdAt: "desc" },
            take: 5,
        }),
    ]);

    return {
        customerName: customer.name,
        unreadMessages,
        totalDocuments,
        openTickets,
        recentMessages,
        recentTickets,
    };
}