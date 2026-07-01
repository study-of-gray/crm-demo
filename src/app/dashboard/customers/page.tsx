import DashboardLayout from "@/components/ui/layouts/DashboardLayout";
import PageContainer from "@/components/ui/PageContainer";
import { getCustomers } from "@/services/customer.service";
import { formatDate } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import { Users, Plus, Search } from "lucide-react";
import Link from "next/link";

export default async function CustomersPage() {
    const customers = await getCustomers();

    return (
        <DashboardLayout>
            <PageContainer
                title="客户管理"
                description="查看和管理所有客户信息"
                actions={
                    <Link
                        href="/dashboard/customers/new"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        新增客户
                    </Link>
                }
            >
                {/* 搜索栏 */}
                <div className="mb-6 rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索客户名称、邮箱或电话..."
                            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {customers.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="暂无客户"
                        description="您还没有添加任何客户，点击上方按钮新增客户。"
                        action={{ label: "新增客户", href: "/dashboard/customers/new" }}
                    />
                ) : (
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            客户信息
                                        </th>
                                        <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            联系方式
                                        </th>
                                        <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            负责人
                                        </th>
                                        <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            创建时间
                                        </th>
                                        <th className="px-6 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                            操作
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {customers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <span className="text-blue-600 font-medium">
                                                            {customer.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                                        <div className="text-sm text-gray-500">{customer.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{customer.phone || "未填写"}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {customer.assignedStaff?.[0]?.user?.name || "未分配"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {formatDate(customer.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm">
                                                <Link
                                                    href={`/dashboard/customers/${customer.id}`}
                                                    className="text-blue-600 hover:text-blue-900 mr-4 font-medium"
                                                >
                                                    查看
                                                </Link>
                                                <Link
                                                    href={`/dashboard/customers/${customer.id}/edit`}
                                                    className="text-blue-600 hover:text-blue-900 font-medium"
                                                >
                                                    编辑
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </PageContainer>
        </DashboardLayout>
    );
}