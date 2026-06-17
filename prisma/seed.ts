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
        data: {
            name: "示例科技有限公司",
        },
    });

    // 用户
    const user1 = await prisma.user.create({
        data: {
            name: "张三",
            email: "zhangsan@example.com",
            role: "ADMIN",
        },
    });
    const user2 = await prisma.user.create({
        data: {
            name: "李四",
            email: "lisi@example.com",
            role: "USER",
        },
    });
    const user3 = await prisma.user.create({
        data: {
            name: "王五",
            email: "wangwu@example.com",
            role: "USER",
        },
    });

    // 客户（关联 User）
    await prisma.customer.create({
        data: {
            name: "客户 B",
            email: "b@example.com",
            phone: "13800000002",
            company: {
                connect: { id: company.id },
            },
            user: {
                connect: { id: user1.id }, // ✅ 关联张三
            },
        },
    });

    await prisma.customer.create({
        data: {
            name: "客户 C",
            email: "c@example.com",
            phone: "13800000003",
            company: {
                connect: { id: company.id },
            },
            user: {
                connect: { id: user2.id }, // ✅ 关联李四
            },
        },
    });

    await prisma.customer.create({
        data: {
            name: "客户 D",
            email: "d@example.com",
            phone: "13800000004",
            user: {
                connect: { id: user3.id }, // ✅ 关联王五
            },
        },
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