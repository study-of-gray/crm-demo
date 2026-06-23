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