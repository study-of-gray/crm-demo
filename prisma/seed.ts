/// <reference types="node" />

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // 清空旧数据
    await prisma.customer.deleteMany();
    await prisma.user.deleteMany();
    await prisma.company.deleteMany();

    // 公司
    const company = await prisma.company.create({
        data: { name: "示例科技公司" },
    });

    // 管理员
    const admin = await prisma.user.create({
        data: {
            name: "管理员",
            email: "admin@example.com",
            phone: "13800000000",
            password: "123456",
            role: "ADMIN",
            companyId: company.id,
        },
    });
    // 员工
    const staff = await prisma.user.create({
        data: {
            name: "员工 A",
            email: "staff@example.com",
            phone: "13800000001",
            password: "123456",
            role: "STAFF",
            companyId: company.id,
        },
    });
    // 客户（来自 User）
    const user1 = await prisma.user.create({
        data: {
            name: "用户 A",
            email: "customer@example.com",
            phone: "13800000222",
            password: "123456",
            role: "USER",
        },
    });
    const user2 = await prisma.user.create({
        data: {
            name: "用户 B",
            email: "customer3@example.com",
            phone: "13800000333",
            password: "123456",
            role: "USER",
        },
    });
    const user3 = await prisma.user.create({
        data: {
            name: "用户 C",
            email: "customer4@example.com",
            phone: "13800000444",
            password: "123456",
            role: "USER",
        },
    });

    // 客户身份
    await prisma.customer.createMany({
        data: [
            {
                userId: user1.id,
                companyId: company.id, // ✅ 可选
            },
            {
                userId: user2.id,
                companyId: company.id, // ✅ 可选
            },
            {
                userId: user3.id,
            }
        ]
    });

    console.log("✅ User 与 Customer 对应关系已生成");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });