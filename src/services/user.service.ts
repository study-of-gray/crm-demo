import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcrypt";

export async function getCustomer(id: string) {
    const session = await auth();
    if (!session) throw new Error("未登录");

    return prisma.customer.findUnique({
        where: { id },
        // include: { user: true },
    });
}
// ✅ 获取员工列表（根据角色过滤）
export async function getEmployees(userId: string, role: string) {
    if (role === "ADMIN") {
        // 管理员可以看到所有员工
        return prisma.user.findMany({
            where: {
                role: {
                    in: ["ADMIN", "MANAGER", "STAFF"],
                },
            },
            select: {
                id: true,
                name: true,
                role: true,
            },
            orderBy: {
                name: "asc",
            },
        });
    } else if (role === "MANAGER") {
        // 经理可以看到自己和下属员工
        return prisma.user.findMany({
            where: {
                role: {
                    in: ["MANAGER", "STAFF"],
                },
            },
            select: {
                id: true,
                name: true,
                role: true,
            },
            orderBy: {
                name: "asc",
            },
        });
    } else {
        // 员工只能看到自己
        return prisma.user.findMany({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                role: true,
            },
        });
    }
}
// ✅ 获取员工列表（用于管理）
// ✅ 获取员工列表（用于管理）
export async function getEmployeesForManagement(
    userId: string,
    role: string
) {
    if (role === "ADMIN") {
        // 管理员可以看到所有员工
        return prisma.user.findMany({
            include: {
                companyUsers: {
                    include: {
                        company: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    } else if (role === "MANAGER") {
        // 经理可以看到自己和下属员工
        return prisma.user.findMany({
            where: {
                OR: [
                    { id: userId },
                    { role: "STAFF" },
                ],
            },
            include: {
                companyUsers: {
                    include: {
                        company: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    } else {
        // 员工只能看到自己
        return prisma.user.findMany({
            where: { id: userId },
            include: {
                companyUsers: {
                    include: {
                        company: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
    }
}

// ✅ 根据 ID 获取员工
export async function getEmployeeById(employeeId: string) {
    return prisma.user.findUnique({
        where: { id: employeeId },
        include: {
            companyUsers: {
                include: {
                    company: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    });
}
// ✅ 创建新员工
// ✅ 创建新员工
export async function createEmployee(
    data: {
        name: string;
        email: string;
        phone?: string;
        password: string;
        role: "ADMIN" | "MANAGER" | "STAFF";
        companyId?: string;
    },
    currentUserId: string,
    currentUserRole: string
) {
    // 权限检查
    if (currentUserRole !== "ADMIN" && currentUserRole !== "MANAGER") {
        throw new Error("无权限创建员工");
    }

    // 经理不能创建管理员
    if (currentUserRole === "MANAGER" && data.role === "ADMIN") {
        throw new Error("经理不能创建管理员");
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new Error("邮箱已存在");
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 创建员工
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: hashedPassword,
            role: data.role,
        },
    });

    // 关联公司（通过关系表）
    if (data.companyId) {
        await prisma.companyUser.create({
            data: {
                companyId: data.companyId,
                userId: user.id,
            },
        });
    }

    return user;
}
// ✅ 更新员工
// ✅ 更新员工
export async function updateEmployee(
    employeeId: string,
    data: {
        name: string;
        email: string;
        phone?: string;
        password?: string;
        role: "ADMIN" | "MANAGER" | "STAFF";
        companyId?: string;
    },
    currentUserId: string,
    currentUserRole: string
) {
    // 权限检查
    if (currentUserRole !== "ADMIN" && currentUserRole !== "MANAGER") {
        throw new Error("无权限更新员工");
    }

    // 获取要更新的员工
    const employeeToUpdate = await prisma.user.findUnique({
        where: { id: employeeId },
    });

    if (!employeeToUpdate) {
        throw new Error("员工不存在");
    }

    // 经理不能编辑管理员
    if (currentUserRole === "MANAGER" && employeeToUpdate.role === "ADMIN") {
        throw new Error("经理不能编辑管理员");
    }

    // 经理不能将自己升级为管理员
    if (
        currentUserRole === "MANAGER" &&
        employeeId === currentUserId &&
        data.role === "ADMIN"
    ) {
        throw new Error("经理不能将自己升级为管理员");
    }

    // 检查邮箱是否被其他员工使用
    const existingUser = await prisma.user.findFirst({
        where: {
            email: data.email,
            NOT: { id: employeeId },
        },
    });

    if (existingUser) {
        throw new Error("邮箱已被其他员工使用");
    }

    // 准备更新数据
    const updateData: any = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
    };

    // 如果提供了新密码，则哈希
    if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
    }

    // 更新员工基本信息
    const updatedUser = await prisma.user.update({
        where: { id: employeeId },
        data: updateData,
    });

    // 更新公司关联
    if (data.companyId) {
        // 先删除现有的公司关联
        await prisma.companyUser.deleteMany({
            where: { userId: employeeId },
        });

        // 创建新的公司关联
        await prisma.companyUser.create({
            data: {
                companyId: data.companyId,
                userId: employeeId,
            },
        });
    }

    return updatedUser;
}
// ✅ 删除员工
export async function deleteEmployee(
    employeeId: string,
    currentUserId: string
) {
    // 不能删除自己
    if (employeeId === currentUserId) {
        throw new Error("不能删除自己");
    }

    // 检查员工是否存在
    const employee = await prisma.user.findUnique({
        where: { id: employeeId },
    });

    if (!employee) {
        throw new Error("员工不存在");
    }

    // 删除员工
    return prisma.user.delete({
        where: { id: employeeId },
    });
}