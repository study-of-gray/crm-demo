import { prisma } from "@/lib/prisma";
import type { Customer } from "@prisma/client";
import bcrypt from "bcrypt";

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

// 创建客户（管理员/经理可以为员工创建客户，员工只能为自己创建客户）
export async function createCustomer(
    data: {
        name: string;
        email: string;
        phone?: string;
        description?: string;
        companyId?: string;
        assignedToId?: string;
    },
    userId: string,
    role: string
) {
    try {
        // 检查邮箱是否已存在
        const existingCustomer = await prisma.customer.findUnique({
            where: { email: data.email },
        });

        if (existingCustomer) {
            throw new Error("邮箱已存在");
        }

        // 生成随机密码（客户可以登录）/但是这里使用默认密码123456，客户登录后可以修改密码
        const hashedPassword = await bcrypt.hash("123456", 10);
        // 确定负责人：如果没有指定，则分配给当前员工
        const assignedToId = data.assignedToId || userId;
        // 创建客户
        const customer = await prisma.customer.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                description: data.description,
                password: hashedPassword,
            },
        });

        // 关联公司
        if (data.companyId) {
            await prisma.companyCustomer.create({
                data: {
                    companyId: data.companyId,
                    customerId: customer.id,
                },
            });
        }

        // 分配负责人
        await prisma.customerAssignment.create({
            data: {
                customerId: customer.id,
                userId: assignedToId,
            },
        });

        // TODO: 发送邮件给客户，告知其登录密码
        // console.log(`客户 ${customer.name} 创建成功，初始密码：123456`);

        return customer;
    } catch (error: any) {
        console.error("创建客户失败:", error);
        throw error;
    }
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
        // 管理员/经理可以查看所有客户
        if (role === "ADMIN" || role === "MANAGER") {
            return await prisma.customer.findUnique({
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