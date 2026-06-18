"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/* ======================
   创建客户（完整流程）
   ====================== */

export async function createCustomer(formData: FormData) {
    // 1️⃣ 创建 User（客户账号）
    const user = await prisma.user.create({
        data: {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            role: "USER",
        },
    });

    // 2️⃣ 创建 Customer 身份
    await prisma.customer.create({
        data: {
            userId: user.id,
            companyId: formData.get("companyId") as string || null,
        },
    });

    revalidatePath("/customers");
    redirect("/customers");
}

/* ======================
   更新客户
   ====================== */

export async function updateCustomer(id: string, formData: FormData) {
    const customer = await prisma.customer.findUnique({
        where: { id },
        // include: { user: true },
    });

    if (!customer) {
        throw new Error("客户不存在");
    }

    // 更新 User
    await prisma.user.update({
        where: { id: customer.userId },
        data: {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
        },
    });

    // 更新 Customer
    await prisma.customer.update({
        where: { id },
        data: {
            companyId: formData.get("companyId") as string || null,
        },
    });

    revalidatePath(`/customers/${id}`);
    revalidatePath("/customers");
}

/* ======================
   删除客户
   ====================== */

export async function deleteCustomer(id: string) {
    const customer = await prisma.customer.findUnique({
        where: { id },
        // include: { user: true },
    });

    if (!customer) {
        throw new Error("客户不存在");
    }

    // 先删 Customer
    await prisma.customer.delete({
        where: { id },
    });

    // 再删 User
    await prisma.user.delete({
        where: { id: customer.userId },
    });

    revalidatePath("/customers");
    redirect("/customers");
}

/* ======================
   查询客户
   ====================== */

export async function getCustomers() {
    const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
    const customers = await prisma.customer.findMany({ orderBy: { createdAt: "desc" } });
    const companies = await prisma.company.findMany();

    const customersMap = customers.map(customer => {
        const customerUser = users.find(user => user.id === customer.userId);
        const company = companies.find(com => com.id === customer.companyId);

        return { ...customer, name: customerUser?.name, email: customerUser?.email, companyName: company?.name, phone: customerUser?.phone };
    });

    return customersMap;
}

export async function getCustomerById(id: string) {
    const customer = await prisma.customer.findUnique({
        where: { id }
    });
    const user = prisma.user.findUnique({
        where: { id: customer?.userId }
    })

    return user;
}