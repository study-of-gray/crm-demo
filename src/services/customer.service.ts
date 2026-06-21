import { prisma } from "@/lib/prisma";
import type { Customer } from "@prisma/client";

export async function getCustomers(userId: string): Promise<Customer[]> {
    return prisma.customer.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}

export async function getCustomerById(id: string, userId: string): Promise<Customer | null> {
    return prisma.customer.findFirst({
        where: {
            id,
            userId,
        },
    });
}

// 创建客户
export async function createCustomer(
    data: Omit<Customer, "id" | "createdAt" | "userId">,
    userId: string
): Promise<Customer> {
    return prisma.customer.create({
        data: {
            ...data,
            userId, // ✅ 绑定归属
        },
    });
}

// -------------------------------------------------
// ✅ 根据角色获取客户
export async function getCustomersForEmployee(
    userId: string,
    role: string
) {
    if (role === "ADMIN" || role === "MANAGER") {
        // 管理员/经理：查看所有客户
        return prisma.customer.findMany({
            include: {
                assignedStaff: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    } else {
        // 员工：只查看自己负责的客户
        return prisma.customer.findMany({
            where: {
                assignedStaff: {
                    some: { userId },
                },
            },
            include: {
                assignedStaff: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}
// ✅ 根据 ID 获取客户详情（带权限检查）
export async function getCustomerByIdForEmployee(
    customerId: string,
    userId: string,
    role: string
) {
    try {
        console.log("获取客户详情", customerId, userId, role);
        // 管理员/经理可以查看所有客户
        if (role === "ADMIN" || role === "MANAGER") {
            let res12 = await prisma.customer.findUnique({
                where: { id: customerId },
                include: {
                    assignedStaff: {
                        include: {
                            user: true,
                        },
                    },
                    companyCustomers: {
                        include: {
                            company: true,
                        },
                    },
                },
            });
            console.log("res12------------", res12);

            return res12;
        }

        // 员工只能查看自己负责的客户
        const customer = await prisma.customer.findFirst({
            where: {
                id: customerId,
                assignedStaff: {
                    some: { userId },
                },
            },
            include: {
                assignedStaff: {
                    include: {
                        user: true,
                    },
                },
                companyCustomers: {
                    include: {
                        company: true,
                    },
                },
            },
        });

        return customer;
    } catch (error) {
        console.error("获取客户详情失败:", error);
        return null;
    }
}
// ✅ 删除客户（带权限检查）
export async function deleteCustomer(
    customerId: string,
    userId: string,
    role: string
) {
    try {
        // 只有管理员和经理可以删除
        if (role !== "ADMIN" && role !== "MANAGER") {
            throw new Error("无权限删除客户");
        }

        return prisma.customer.delete({
            where: { id: customerId },
        });
    } catch (error) {
        console.error("删除客户失败:", error);
        throw error;
    }
}

// ✅ 更新客户信息
export async function updateCustomer(
    customerId: string,
    data: {
        name: string;
        email: string;
        phone?: string;
        description?: string;
    },
    userId: string,
    role: string
) {
    // 检查权限
    if (role !== "ADMIN" && role !== "MANAGER") {
        const hasAccess = await prisma.customerAssignment.findFirst({
            where: {
                customerId,
                userId,
            },
        });

        if (!hasAccess) {
            throw new Error("无权限编辑此客户");
        }
    }

    return prisma.customer.update({
        where: { id: customerId },
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            description: data.description,
        },
    });
}