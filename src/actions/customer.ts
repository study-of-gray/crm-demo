"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/* ================= 新增 ================= */

export async function createCustomer(formData: FormData) {
    await prisma.customer.create({
        data: {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            companyId: formData.get("companyId") as string,
        },
    });

    revalidatePath("/customers");
}

/* ================= 编辑 ================= */

export async function updateCustomer(id: string, formData: FormData) {
    await prisma.customer.update({
        where: { id },
        data: {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            companyId: formData.get("companyId") as string,
        },
    });

    revalidatePath(`/customers/${id}`);
    revalidatePath("/customers");
}

/* ================= 删除 ✅ ================= */

export async function deleteCustomer(id: string) {
    await prisma.customer.delete({
        where: { id },
    });

    revalidatePath("/customers");
}