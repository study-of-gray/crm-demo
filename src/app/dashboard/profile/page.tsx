import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getEmployeeById } from "@/services/user.service";
import PageContainer from "@/components/ui/PageContainer";
import EmployeeProfileForm from "@/components/employees/EmployeeProfileForm";

export default async function EmployeeProfilePage() {
    const session = await auth();

    if (!session || session.user.type !== "employee") {
        redirect("/login");
    }

    // ✅ Next.js 15：await params 不需要，因为没用 [id]
    const employee = await getEmployeeById(session.user.id);

    if (!employee) {
        notFound();
    }

    return (
        <PageContainer
            title="个人资料"
            description="查看和编辑您的个人信息"
        >
            <EmployeeProfileForm employee={employee} readonly={false} />
        </PageContainer>
    );
}