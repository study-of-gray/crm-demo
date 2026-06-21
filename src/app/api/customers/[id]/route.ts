import { getCustomerById, deleteCustomer } from "@/services/customer.service";
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

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();

    if (!session || session.user.type !== "employee") {
        return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { id } = await params;

    try {
        await deleteCustomer(id, session.user.id, session.user.role);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "删除失败" },
            { status: 400 }
        );
    }
}