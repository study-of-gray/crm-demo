"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function changeCustomerPassword(
    email: string,
    currentPassword: string,
    newPassword: string
): Promise<{ success: boolean; message?: string }> {
    try {
        const customer = await prisma.customer.findUnique({
            where: { email },
        });

        if (!customer) {
            return { success: false, message: "客户不存在" };
        }

        const isValid = await bcrypt.compare(currentPassword, customer.password);
        if (!isValid) {
            return { success: false, message: "当前密码错误" };
        }

        if (newPassword.length < 6) {
            return { success: false, message: "新密码至少 6 位" };
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        await prisma.customer.update({
            where: { email },
            data: { password: hashed },
        });

        return { success: true, message: "密码修改成功" };
    } catch (err) {
        console.error(err);
        return { success: false, message: "系统错误" };
    }
}
// 获取客户资料
export async function getCustomerProfile(email: string) {
    try {
        return await prisma.customer.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                description: true,
                createdAt: true,
            },
        });
    } catch (error) {
        console.error("获取客户资料失败:", error);
        return null;
    }
}
// 更新客户资料
export async function updateCustomerProfile(
    email: string,
    data: {
        name: string;
        phone?: string;
        description?: string;
    }
): Promise<{ success: boolean; message?: string }> {
    try {
        // 检查客户是否存在
        const customer = await prisma.customer.findUnique({
            where: { email },
        });

        if (!customer) {
            return { success: false, message: "客户不存在" };
        }

        // 更新资料
        await prisma.customer.update({
            where: { email },
            data: {
                name: data.name,
                phone: data.phone || null,
                description: data.description || null,
            },
        });

        return { success: true, message: "资料更新成功" };
    } catch (error) {
        console.error("更新客户资料失败:", error);
        return { success: false, message: "更新资料失败" };
    }
}