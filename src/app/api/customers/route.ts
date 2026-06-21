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