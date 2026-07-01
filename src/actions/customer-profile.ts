"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function getCustomerProfile() {
    const session = await auth();

    if (!session || session.user.type !== "customer") {
        redirect("/login");
    }

    const customer = await prisma.customer.findUnique({
        where: { email: session.user.email },
        include: {
            companyCustomers: {
                include: {
                    company: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });

    return customer;
}

export async function updateCustomerProfile(
    email: string,
    data: {
        name?: string;
        phone?: string;
        description?: string;
    }
) {
    try {
        const session = await auth();

        if (!session || session.user.type !== "customer") {
            return { success: false, message: "未登录" };
        }

        if (email !== session.user.email) {
            return { success: false, message: "无权修改此账户" };
        }

        await prisma.customer.update({
            where: { email },
            data: {
                name: data.name,
                phone: data.phone,
                description: data.description,
            },
        });

        return { success: true, message: "资料更新成功" };
    } catch (error) {
        console.error("更新客户资料失败:", error);
        return { success: false, message: "更新失败" };
    }
}

export async function changeCustomerPassword(
    currentPassword: string,
    newPassword: string
) {
    try {
        const session = await auth();

        if (!session || session.user.type !== "customer") {
            return { success: false, message: "未登录" };
        }

        const customer = await prisma.customer.findUnique({
            where: { email: session.user.email },
        });

        if (!customer) {
            return { success: false, message: "客户不存在" };
        }

        const isValid = await bcrypt.compare(currentPassword, customer.password);
        if (!isValid) {
            return { success: false, message: "当前密码不正确" };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.customer.update({
            where: { email: session.user.email },
            data: { password: hashedPassword },
        });

        return { success: true, message: "密码修改成功" };
    } catch (error) {
        console.error("修改密码失败:", error);
        return { success: false, message: "修改密码失败" };
    }
}