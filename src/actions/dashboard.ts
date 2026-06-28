"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getDashboardStats() {
    const session = await auth();

    if (!session || session.user.type !== "employee") {
        return {
            totalCustomers: 0,
            unreadMessages: 0,
            totalDocuments: 0,
            openTickets: 0,
            recentTickets: [],
            recentMessages: [],
        };
    }

    // 根据角色过滤数据
    const isAdminOrManager = session.user.role === "ADMIN" || session.user.role === "MANAGER";

    // 基础查询条件
    const customerWhere = isAdminOrManager ? {} : { assignedStaff: { some: { userId: session.user.id } } };
    const ticketWhere = isAdminOrManager ? {} : { assignedToId: session.user.id };
    const messageWhere = isAdminOrManager ? {} : { receiver: { assignedStaff: { some: { userId: session.user.id } } } };

    // 并行获取数据
    const [
        totalCustomers,
        unreadMessages,
        totalDocuments,
        openTickets,
        recentTickets,
        recentMessages,
    ] = await Promise.all([
        // 总客户数
        prisma.customer.count({ where: customerWhere }),

        // 未读消息数
        prisma.message.count({
            where: {
                ...messageWhere,
                isRead: false,
            },
        }),

        // 文档总数
        prisma.document.count({
            where: isAdminOrManager ? {} : { customer: { assignedStaff: { some: { userId: session.user.id } } } },
        }),

        // 待处理工单数
        prisma.ticket.count({
            where: {
                ...ticketWhere,
                status: "OPEN",
            },
        }),

        // 最近5个工单
        prisma.ticket.findMany({
            where: ticketWhere,
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
                id: true,
                title: true,
                status: true,
                createdAt: true,
                customer: {
                    select: {
                        name: true,
                    },
                },
            },
        }),

        // 最近5条消息
        prisma.message.findMany({
            where: messageWhere,
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
                id: true,
                subject: true,
                isRead: true,
                createdAt: true,
                sender: {
                    select: {
                        name: true,
                    },
                },
            },
        }),
    ]);

    return {
        totalCustomers,
        unreadMessages,
        totalDocuments,
        openTickets,
        recentTickets,
        recentMessages,
    };
}