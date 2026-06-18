// app/api/customers/[id]/route.ts
import { getCustomer } from "@/services/customer.service";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const { id } = await context.params;

    const data = await getCustomer(id, session.user.id);
    return NextResponse.json(data);
}