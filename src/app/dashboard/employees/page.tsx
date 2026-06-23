import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getEmployeesForManagement } from "@/services/user.service";
import DeleteEmployeeButton from "@/components/DeleteEmployeeButton"; // ✅ 导入
import { formatDate } from "@/lib/utils";

export default async function EmployeesPage() {
    const session = await auth();

    if (!session || session.user.type !== "employee") {
        redirect("/login");
    }

    // 只有 ADMIN 和 MANAGER 可以访问
    if (session.user.role !== "ADMIN" && session.user.role !== "MANAGER") {
        redirect("/dashboard");
    }

    const employees = await getEmployeesForManagement(
        session.user.id,
        session.user.role
    );

    return (
        <main className="min-h-screen bg-gray-50">
            {/* 顶部导航 */}
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ← 返回仪表盘
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">员工管理</h1>
                        </div>
                        <Link
                            href="/dashboard/employees/new"
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                        >
                            新增员工
                        </Link>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* 员工列表 */}
                <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    姓名
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    邮箱
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    角色
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    所属公司
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    创建时间
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    操作
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {employees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-gray-50">
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                        {employee.name}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                        {employee.email}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                        <span
                                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${employee.role === "ADMIN"
                                                    ? "bg-red-100 text-red-800"
                                                    : employee.role === "MANAGER"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-green-100 text-green-800"
                                                }`}
                                        >
                                            {employee.role === "ADMIN"
                                                ? "管理员"
                                                : employee.role === "MANAGER"
                                                    ? "经理"
                                                    : "员工"}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                        {employee.companyUsers?.[0]?.company?.name || "未分配"}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                        {formatDate(employee.createdAt)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                        <Link
                                            href={`/dashboard/employees/${employee.id}/edit`}
                                            className="mr-4 text-blue-600 hover:text-blue-900"
                                        >
                                            编辑
                                        </Link>
                                        {session.user.role === "ADMIN" &&
                                            employee.id !== session.user.id && (
                                                <DeleteEmployeeButton
                                                    employeeId={employee.id}
                                                    currentUserId={session.user.id}
                                                />
                                            )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {employees.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">暂无员工数据</p>
                            <Link
                                href="/dashboard/employees/new"
                                className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                            >
                                新增第一个员工
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}