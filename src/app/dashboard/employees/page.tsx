import DashboardLayout from "@/components/ui/layouts/DashboardLayout";
import PageContainer from "@/components/ui/PageContainer";
import { getEmployees } from "@/actions/employees";
import { formatDate } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import { Users, Plus, Search, Shield, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default async function EmployeesPage() {
    const employees = await getEmployees();

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "ADMIN":
                return <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">管理员</span>;
            case "MANAGER":
                return <span className="inline-flex rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800">经理</span>;
            case "STAFF":
                return <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">员工</span>;
            default:
                return <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">{role}</span>;
        }
    };

    return (
        <DashboardLayout>
            <PageContainer
                title="员工管理"
                description="管理系统员工账户和权限"
                actions={
                    <Link
                        href="/dashboard/employees/new"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        新增员工
                    </Link>
                }
            >
                {/* 搜索栏 */}
                <div className="mb-6 rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索员工姓名、邮箱或角色..."
                            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {employees.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="暂无员工"
                        description="您还没有添加任何员工，点击上方按钮新增员工。"
                        action={{ label: "新增员工", href: "/dashboard/employees/new" }}
                    />
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {employees.map((employee) => (
                            <div
                                key={employee.id}
                                className="rounded-xl bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span className="text-blue-600 font-medium text-lg">
                                                {employee.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">{employee.name}</h3>
                                            <div className="mt-1">{getRoleBadge(employee.role)}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span>{employee.email}</span>
                                    </div>
                                    {employee.phone && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <span>{employee.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Shield className="h-4 w-4 text-gray-400" />
                                        <span>创建于 {formatDate(employee.createdAt)}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        href={`/dashboard/employees/${employee.id}`}
                                        className="flex-1 rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors text-center"
                                    >
                                        查看详情
                                    </Link>
                                    <Link
                                        href={`/dashboard/employees/${employee.id}/edit`}
                                        className="flex-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors text-center"
                                    >
                                        编辑
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </PageContainer>
        </DashboardLayout>
    );
}