"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// ✅ 客户提交工单
export async function submitTicket(
    title: string,
    description: string,
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
): Promise<{ success: boolean; message?: string; ticketId?: string }> {
    try {
        const session = await auth();
        if (!session || session.user.type !== "customer") {
            return { success: false, message: "未登录" };
        }

        // 获取客户信息
        const customer = await prisma.customer.findUnique({
            where: { email: session.user.email },
        });

        if (!customer) {
            return { success: false, message: "客户不存在" };
        }

        // 创建工单
        const ticket = await prisma.ticket.create({
            data: {
                title,
                description,
                priority,
                customerId: customer.id,
            },
        });

        return {
            success: true,
            message: "工单提交成功",
            ticketId: ticket.id
        };
    } catch (error) {
        console.error("提交工单失败:", error);
        return { success: false, message: "提交工单失败" };
    }
}

// ✅ 获取客户的工单列表（修复版）
export async function getCustomerTickets() {
    try {
        const session = await auth();
        if (!session || session.user.type !== "customer") {
            return [];
        }

        const tickets = await prisma.ticket.findMany({
            where: {
                customer: {
                    email: session.user.email,
                },
            },
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                    },
                },
                replies: {
                    select: {
                        id: true,
                        content: true,
                        isInternal: true,
                        createdAt: true,
                        authorUser: {
                            select: {
                                id: true,
                                name: true,
                                role: true,
                            },
                        },
                        authorCustomer: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return tickets;
    } catch (error) {
        console.error("获取工单列表失败:", error);
        return [];
    }
}

// ✅ 获取单个工单详情（客户）（修复版）
export async function getCustomerTicketById(ticketId: string) {
    try {
        const session = await auth();
        if (!session || session.user.type !== "customer") {
            return null;
        }

        const ticket = await prisma.ticket.findFirst({
            where: {
                id: ticketId,
                customer: {
                    email: session.user.email,
                },
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                    },
                },
                replies: {
                    where: {
                        isInternal: false, // 客户只能看到非内部回复
                    },
                    select: {
                        id: true,
                        content: true,
                        isInternal: true,
                        createdAt: true,
                        authorUser: {
                            select: {
                                id: true,
                                name: true,
                                role: true,
                            },
                        },
                        authorCustomer: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });

        return ticket;
    } catch (error) {
        console.error("获取工单详情失败:", error);
        return null;
    }
}

// ✅ 客户回复工单（修复版）
export async function replyToTicket(
    ticketId: string,
    content: string
): Promise<{ success: boolean; message?: string }> {
    try {
        const session = await auth();
        if (!session || session.user.type !== "customer") {
            return { success: false, message: "未登录" };
        }

        // 验证工单是否属于该客户
        const ticket = await prisma.ticket.findFirst({
            where: {
                id: ticketId,
                customer: {
                    email: session.user.email,
                },
            },
        });

        if (!ticket) {
            return { success: false, message: "工单不存在或无权限" };
        }

        // 获取客户信息
        const customer = await prisma.customer.findUnique({
            where: { email: session.user.email },
        });

        if (!customer) {
            return { success: false, message: "客户不存在" };
        }

        // 创建回复（使用 authorCustomerId）
        await prisma.ticketReply.create({
            data: {
                content,
                isInternal: false,
                authorCustomerId: customer.id,
                ticketId,
            },
        });

        // 更新工单状态为IN_PROGRESS（如果原来是OPEN）
        if (ticket.status === "OPEN") {
            await prisma.ticket.update({
                where: { id: ticketId },
                data: { status: "IN_PROGRESS" },
            });
        }

        return { success: true, message: "回复成功" };
    } catch (error) {
        console.error("回复工单失败:", error);
        return { success: false, message: "回复失败" };
    }
}

// ✅ 获取所有工单（员工使用）
export async function getAllTickets(
    statusFilter?: TicketStatus,
    priorityFilter?: TicketPriority,
    assignedToId?: string
) {
    try {
        const session = await auth();
        if (!session || session.user.type !== "employee") {
            return [];
        }

        const whereClause: any = {};

        if (statusFilter) {
            whereClause.status = statusFilter;
        }

        if (priorityFilter) {
            whereClause.priority = priorityFilter;
        }

        if (assignedToId) {
            whereClause.assignedToId = assignedToId;
        }

        // 员工只能看到分配给自己的工单，除非是管理员/经理
        if (session.user.role === "STAFF") {
            whereClause.assignedToId = session.user.id;
        }

        const tickets = await prisma.ticket.findMany({
            where: whereClause,
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                    },
                },
                _count: {
                    select: {
                        replies: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return tickets;
    } catch (error) {
        console.error("获取工单列表失败:", error);
        return [];
    }
}

// ✅ 员工回复工单（可设为内部回复）
export async function replyToTicketAsEmployee(
    ticketId: string,
    content: string,
    isInternal: boolean = false
): Promise<{ success: boolean; message?: string }> {
    try {
        const session = await auth();
        if (!session || session.user.type !== "employee") {
            return { success: false, message: "未登录" };
        }

        // 验证工单是否存在
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
        });

        if (!ticket) {
            return { success: false, message: "工单不存在" };
        }

        // 员工只能回复分配给自己的工单，除非是管理员/经理
        if (session.user.role === "STAFF" && ticket.assignedToId !== session.user.id) {
            return { success: false, message: "无权回复此工单" };
        }

        // 创建回复（使用 authorUserId）
        await prisma.ticketReply.create({
            data: {
                content,
                isInternal,
                authorUserId: session.user.id,
                ticketId,
            },
        });

        // 更新工单状态
        await prisma.ticket.update({
            where: { id: ticketId },
            data: {
                status: isInternal ? ticket.status : "IN_PROGRESS",
                assignedToId: ticket.assignedToId || session.user.id,
            },
        });

        return { success: true, message: "回复成功" };
    } catch (error) {
        console.error("回复工单失败:", error);
        return { success: false, message: "回复失败" };
    }
}

// ✅ 分配工单给员工
export async function assignTicket(
    ticketId: string,
    assignedToId: string
): Promise<{ success: boolean; message?: string }> {
    try {
        const session = await auth();
        if (!session || session.user.type !== "employee") {
            return { success: false, message: "未登录" };
        }

        // 只有管理员和经理可以分配工单
        if (session.user.role !== "ADMIN" && session.user.role !== "MANAGER") {
            return { success: false, message: "无权分配工单" };
        }

        // 验证员工是否存在
        const employee = await prisma.user.findUnique({
            where: { id: assignedToId },
        });

        if (!employee) {
            return { success: false, message: "员工不存在" };
        }

        // 更新工单
        await prisma.ticket.update({
            where: { id: ticketId },
            data: {
                assignedToId,
                status: "IN_PROGRESS",
            },
        });

        return { success: true, message: "工单分配成功" };
    } catch (error) {
        console.error("分配工单失败:", error);
        return { success: false, message: "分配失败" };
    }
}

// ✅ 更新工单状态
export async function updateTicketStatus(
    ticketId: string,
    status: TicketStatus
): Promise<{ success: boolean; message?: string }> {
    try {
        const session = await auth();
        if (!session || session.user.type !== "employee") {
            return { success: false, message: "未登录" };
        }

        // 验证工单是否存在
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
        });

        if (!ticket) {
            return { success: false, message: "工单不存在" };
        }

        // 员工只能更新分配给自己的工单，除非是管理员/经理
        if (session.user.role === "STAFF" && ticket.assignedToId !== session.user.id) {
            return { success: false, message: "无权更新此工单" };
        }

        // 更新状态
        await prisma.ticket.update({
            where: { id: ticketId },
            data: { status },
        });

        return { success: true, message: "状态更新成功" };
    } catch (error) {
        console.error("更新工单状态失败:", error);
        return { success: false, message: "更新失败" };
    }
}