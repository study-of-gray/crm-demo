import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

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