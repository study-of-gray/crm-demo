import { notFound } from "next/navigation";
import { getEmployeeById } from "@/services/user.service";
import PageContainer from "@/components/ui/PageContainer";
import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EmployeeDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await auth();

    if (!session || session.user.type !== "employee") {
        notFound();
    }

    const employee = await getEmployeeById(id);

    if (!employee) {
        notFound();
    }

    return (
        <PageContainer
            title="员工详情"
            description={`${employee.name} 的信息`}
            actions={
                <Link href={`/dashboard/employees/${employee.id}/edit`}>
                    <Button>编辑</Button>
                </Link>
            }
        >
            <div className="rounded-lg border bg-white p-6 space-y-4">
                <div>
                    <p className="text-sm text-gray-500">姓名</p>
                    <p className="text-lg font-medium">{employee.name}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">邮箱</p>
                    <p className="text-lg">{employee.email}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">电话</p>
                    <p className="text-lg">{employee.phone || "—"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">角色</p>
                    <p className="text-lg">
                        {employee.role === "ADMIN"
                            ? "管理员"
                            : employee.role === "MANAGER"
                                ? "经理"
                                : "员工"}
                    </p>
                </div>
            </div>
        </PageContainer>
    );
}