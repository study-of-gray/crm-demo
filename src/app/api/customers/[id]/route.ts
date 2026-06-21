import { getCustomerById } from "@/services/customer.service";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const { id } = await params;
    const customer = await getCustomerById(id, session.user.id);

    if (!customer) {
        return NextResponse.json({ error: "客户不存在或无权限" }, { status: 404 });
    }

    return NextResponse.json(customer);
}