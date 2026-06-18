// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { auth } from "@/auth";

// /**
//  * GET /api/customers/[id]
//  * 获取单个客户详情（仅限本人）
//  */
// export async function GET(
//     _req: Request,
//     { params }: { params: Promise<{ id: string }> }
// ) {
//     const session = await auth();
//     if (!session) {
//         return NextResponse.json({ error: "未登录" }, { status: 401 });
//     }

//     const { id } = await params;

//     const customer = await prisma.customer.findUnique({
//         where: { id },
//     });

//     if (!customer) {
//         return NextResponse.json({ error: "客户不存在" }, { status: 404 });
//     }

//     if (customer.userId !== session.user.id) {
//         return NextResponse.json({ error: "无权访问" }, { status: 403 });
//     }

//     return NextResponse.json(customer);
// }

// app/api/customers/route.ts
import { getCustomers } from "@/services/customer.service";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const data = await getCustomers(session.user.id);
    return NextResponse.json(data);
}