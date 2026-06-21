import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const salt = await bcrypt.genSalt(10);

    // 1. 创建公司（不用 upsert）
    let company1 = await prisma.company.findFirst({
        where: { name: "北京分公司" },
    });

    if (!company1) {
        company1 = await prisma.company.create({
            data: { name: "北京分公司" },
        });
    }

    let company2 = await prisma.company.findFirst({
        where: { name: "上海分公司" },
    });

    if (!company2) {
        company2 = await prisma.company.create({
            data: { name: "上海分公司" },
        });
    }

    // 2. 创建员工
    let admin = await prisma.user.findFirst({
        where: { email: "admin@system.com" },
    });

    if (!admin) {
        admin = await prisma.user.create({
            data: {
                name: "系统管理员",
                email: "admin@system.com",
                password: await bcrypt.hash("123456", salt),
                role: "ADMIN",
            },
        });
    }

    let manager = await prisma.user.findFirst({
        where: { email: "manager@bj.com" },
    });

    if (!manager) {
        manager = await prisma.user.create({
            data: {
                name: "北京经理",
                email: "manager@bj.com",
                password: await bcrypt.hash("123456", salt),
                role: "MANAGER",
            },
        });
    }

    let staff = await prisma.user.findFirst({
        where: { email: "zhangsan@bj.com" },
    });

    if (!staff) {
        staff = await prisma.user.create({
            data: {
                name: "销售员张三",
                email: "zhangsan@bj.com",
                password: await bcrypt.hash("123456", salt),
                role: "STAFF",
            },
        });
    }

    // 3. 创建客户
    let customer1 = await prisma.customer.findFirst({
        where: { email: "alibaba@demo.com" },
    });

    if (!customer1) {
        customer1 = await prisma.customer.create({
            data: {
                name: "阿里巴巴",
                email: "alibaba@demo.com",
                phone: "13800000001",
                password: await bcrypt.hash("123456", salt),
            },
        });
    }

    let customer2 = await prisma.customer.findFirst({
        where: { email: "tencent@demo.com" },
    });

    if (!customer2) {
        customer2 = await prisma.customer.create({
            data: {
                name: "腾讯科技",
                email: "tencent@demo.com",
                phone: "13800000002",
                password: await bcrypt.hash("123456", salt),
            },
        });
    }

    // 4. 关联公司与员工（用 upsert，因为复合唯一）
    await prisma.companyUser.upsert({
        where: {
            companyId_userId: {
                companyId: company1.id,
                userId: admin.id,
            },
        },
        update: {},
        create: {
            companyId: company1.id,
            userId: admin.id,
        },
    });

    // 5. 关联公司与客户
    await prisma.companyCustomer.upsert({
        where: {
            companyId_customerId: {
                companyId: company1.id,
                customerId: customer1.id,
            },
        },
        update: {},
        create: {
            companyId: company1.id,
            customerId: customer1.id,
        },
    });

    await prisma.companyCustomer.upsert({
        where: {
            companyId_customerId: {
                companyId: company1.id,
                customerId: customer2.id,
            },
        },
        update: {},
        create: {
            companyId: company1.id,
            customerId: customer2.id,
        },
    });

    await prisma.companyCustomer.upsert({
        where: {
            companyId_customerId: {
                companyId: company2.id,
                customerId: customer1.id,
            },
        },
        update: {},
        create: {
            companyId: company2.id,
            customerId: customer1.id,
        },
    });

    // 6. 分配客户给员工
    await prisma.customerAssignment.upsert({
        where: {
            userId_customerId: {
                userId: staff.id,
                customerId: customer1.id,
            },
        },
        update: {},
        create: {
            userId: staff.id,
            customerId: customer1.id,
        },
    });

    await prisma.customerAssignment.upsert({
        where: {
            userId_customerId: {
                userId: staff.id,
                customerId: customer2.id,
            },
        },
        update: {},
        create: {
            userId: staff.id,
            customerId: customer2.id,
        },
    });

    console.log("✅ Seed 数据创建成功");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });