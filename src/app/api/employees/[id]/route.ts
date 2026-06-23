import { deleteEmployee } from "@/services/user.service";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();

    if (!session || session.user.type !== "employee") {
        return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    // 只有 ADMIN 可以删除
    if (session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "无权限删除员工" }, { status: 403 });
    }

    const { id } = await params;
    const { currentUserId } = await req.json();

    try {
        await deleteEmployee(id, currentUserId);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "删除失败" },
            { status: 400 }
        );
    }
}