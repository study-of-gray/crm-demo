import { prisma } from "@/lib/prisma";

// ✅ 获取所有公司
export async function getCompanies() {
    return prisma.company.findMany({
        orderBy: {
            name: "asc",
        },
    });
}