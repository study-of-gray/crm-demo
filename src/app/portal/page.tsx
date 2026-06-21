// app/portal/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function PortalPage() {
    const session = await auth();

    if (!session || session.user.type !== "customer") {
        redirect("/login");
    }

    return <div>客户门户</div>;
}