// app/portal/layout.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PortalLayout from "@/components/ui/layouts/PortalLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "客户门户",
};

// ✅ 必须在请求作用域内
export const dynamic = "force-dynamic";

export default async function PortalRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session || session.user.type !== "customer") {
        redirect("/login");
    }

    return (
        <PortalLayout user={session.user}>
            {children}
        </PortalLayout>
    );
}