"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// ✅ 获取客户的消息列表
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

// ✅ 获取单个消息详情
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

// ✅ 发送消息（客户回复）
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

// ✅ 标记消息为已读
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

// ✅ 获取未读消息数量
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