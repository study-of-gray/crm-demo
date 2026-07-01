"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// 获取客户的消息列表
export async function getCustomerMessages() {
    const session = await auth();
    if (!session || session.user.type !== "customer") return [];

    return prisma.message.findMany({
        where: {
            receiver: {
                email: session.user.email,
            },
        },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

// 获取单个消息详情
export async function getMessageById(messageId: string) {
    try {
        const session = await auth();
        if (!session || session.user.type !== "customer") {
            return null;
        }

        const message = await prisma.message.findFirst({
            where: {
                id: messageId,
                receiver: {
                    email: session.user.email,
                },
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });

        // 标记为已读
        if (message && !message.isRead) {
            await prisma.message.update({
                where: { id: messageId },
                data: { isRead: true },
            });
        }

        return message;
    } catch (error) {
        console.error("获取消息详情失败:", error);
        return null;
    }
}

// 发送消息（客户回复）
export async function sendMessage(
    receiverId: string,
    subject: string,
    content: string
): Promise<{ success: boolean; message?: string }> {
    try {
        const session = await auth();
        if (!session || session.user.type !== "customer") {
            return { success: false, message: "未登录" };
        }

        // 获取当前客户
        const customer = await prisma.customer.findUnique({
            where: { email: session.user.email },
        });

        if (!customer) {
            return { success: false, message: "客户不存在" };
        }

        // 验证接收者是否存在且是员工
        const receiver = await prisma.user.findUnique({
            where: { id: receiverId },
        });

        if (!receiver) {
            return { success: false, message: "接收者不存在" };
        }

        // 创建消息
        await prisma.message.create({
            data: {
                subject,
                content,
                senderId: customer.id, // 注意：这里需要调整，因为Customer没有senderId字段
                receiverId: receiver.id,
            },
        });

        return { success: true, message: "消息发送成功" };
    } catch (error) {
        console.error("发送消息失败:", error);
        return { success: false, message: "发送失败" };
    }
}

// 标记消息为已读
export async function markMessageAsRead(messageId: string) {
    const session = await auth();
    if (!session || session.user.type !== "customer") return;

    await prisma.message.updateMany({
        where: {
            id: messageId,
            receiver: {
                email: session.user.email,
            },
        },
        data: { isRead: true },
    });
}

// 获取未读消息数量
export async function getUnreadMessageCount(): Promise<number> {
    try {
        const session = await auth();
        if (!session || session.user.type !== "customer") {
            return 0;
        }

        const count = await prisma.message.count({
            where: {
                receiver: {
                    email: session.user.email,
                },
                isRead: false,
            },
        });

        return count;
    } catch (error) {
        console.error("获取未读消息数量失败:", error);
        return 0;
    }
}
// 发送消息给客户
export async function sendMessageToCustomer(
    senderId: string,
    receiverCustomerId: string,
    subject: string,
    content: string
): Promise<{ success: boolean; message?: string }> {
    try {
        // 验证发送者是否存在
        const sender = await prisma.user.findUnique({
            where: { id: senderId },
        });

        if (!sender) {
            return { success: false, message: "发送者不存在" };
        }

        // 验证接收者是否存在
        const receiver = await prisma.customer.findUnique({
            where: { id: receiverCustomerId },
        });

        if (!receiver) {
            return { success: false, message: "接收者不存在" };
        }

        // ✅ 使用关系字段创建消息
        await prisma.message.create({
            data: {
                subject,
                content,
                sender: {
                    connect: { id: senderId }, // ✅ 通过关系连接发送者
                },
                receiver: {
                    connect: { id: receiverCustomerId }, // ✅ 通过关系连接接收者
                },
            },
        });

        return { success: true, message: "消息发送成功" };
    } catch (error) {
        console.error("发送消息失败:", error);
        return { success: false, message: "发送消息失败" };
    }
}
// 获取员工发送的消息
export async function getSentMessages(senderId: string) {
    try {
        return prisma.message.findMany({
            where: {
                senderId, // ✅ 这里可以直接用 senderId，因为是标量字段
            },
            include: {
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    } catch (error) {
        console.error("获取发送消息失败:", error);
        return [];
    }
}
// ✅ 获取所有消息（员工使用）
export async function getMessages() {
    const session = await auth();

    if (!session || session.user.type !== "employee") {
        return [];
    }

    const isAdminOrManager = session.user.role === "ADMIN" || session.user.role === "MANAGER";

    const messages = await prisma.message.findMany({
        where: isAdminOrManager ? {} : { receiver: { assignedStaff: { some: { userId: session.user.id } } } },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                },
            },
            receiver: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return messages;
}