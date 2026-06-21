import { auth } from "@/auth";

export async function getCurrentUser() {
    const session = await auth();
    if (!session) return null;

    // 根据 role 判断
    if (session.user.role === "CUSTOMER") {
        return prisma.customer.findUnique({
            where: { email: session.user.email! },
        });
    } else {
        return prisma.user.findUnique({
            where: { email: session.user.email! },
        });
    }
}