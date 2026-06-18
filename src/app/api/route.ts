// app/api/customers/[id]/route.ts
import { getCustomer } from "@/services/customer.service";
import { NextResponse } from "next/server";

// * 获取当前登录用户所属的客户列表 *
export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const data = await getCustomer(id);
        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 401 });
    }
}

// POST / PUT / DELETE 写法（标准模板）

// export async function PUT(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   const session = await auth();
//   if (!session) {
//     return NextResponse.json({ error: "未登录" }, { status: 401 });
//   }

//   const { id } = await context.params;
//   const data = await req.json();

//   const updated = await prisma.customer.update({
//     where: { id },
//     data,
//   });

//   return NextResponse.json(updated);
// }