"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

// ✅ 员工登录
export async function employeeLogin(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        type: "employee", // ✅ 标识身份
    };
}

// ✅ 客户登录
export async function customerLogin(email: string, password: string) {
    const customer = await prisma.customer.findUnique({
        where: { email },
    });

    if (!customer) return null;

    const valid = await bcrypt.compare(password, customer.password);
    if (!valid) return null;

    return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        role: "CUSTOMER",
        type: "customer", // ✅ 标识身份
    };
}