import { auth } from "@/auth";
import DashboardLayout from "@/components/ui/layouts/DashboardLayout";
import PageContainer from "@/components/ui/PageContainer";
import { getAllTickets, updateTicketStatus } from "@/actions/tickets";
import { formatDate } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import { Ticket, Filter, Plus, Search } from "lucide-react";
import Link from "next/link";

export default async function TicketsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; priority?: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const statusFilter = resolvedSearchParams.status;
    const priorityFilter = resolvedSearchParams.priority;

    const session = await auth();
    if (!session || session.user.type !== "employee") {
        redirect("/login");
    }

    const tickets = await getAllTickets(
        statusFilter as any,
        priorityFilter as any,
        session.user.role === "STAFF" ? session.user.id : undefined
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "OPEN":
                return <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">待处理</span>;
            case "IN_PROGRESS":
                return <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">处理中</span>;
            case "RESOLVED":
                return <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">已解决</span>;
            case "CLOSED":
                return <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">已关闭</span>;
            default:
                return <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">{status}</span>;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case "LOW":
                return <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">低</span>;
            case "MEDIUM":
                return <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">中</span>;
            case "HIGH":
                return <span className="inline-flex rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800">高</span>;
            case "URGENT":
                return <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">紧急</span>;
            default:
                return <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">{priority}</span>;
        }
    };

    return (
        <DashboardLayout>
            <PageContainer
                title="工单管理"
                description="处理客户提交的工单"
                actions={
                    <Link
                        href="/dashboard/tickets/new"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        新建工单
                    </Link>
                }
            >
                {/* 筛选器 */}
                <div className="mb-6 rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                    <form className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">筛选:</span>
                        </div>

                        <div>
                            <select
                                name="status"
                                defaultValue={statusFilter || ""}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">全部状态</option>
                                <option value="OPEN">待处理</option>
                                <option value="IN_PROGRESS">处理中</option>
                                <option value="RESOLVED">已解决</option>
                                <option value="CLOSED">已关闭</option>
                            </select>
                        </div>

                        <div>
                            <select
                                name="priority"
                                defaultValue={priorityFilter || ""}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">全部优先级</option>
                                <option value="LOW">低</option>
                                <option value="MEDIUM">中</option>
                                <option value="HIGH">高</option>
                                <option value="URGENT">紧急</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                        >
                            应用筛选
                        </button>

                        <Link
                            href="/dashboard/tickets"
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                            重置
                        </Link>
                    </form>
                </div>

                {/* 统计卡片 */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 rounded-lg bg-blue-100 p-3">
                                <Ticket className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">总工单数</p>
                                <p className="text-2xl font-semibold text-gray-900">{tickets.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 rounded-lg bg-yellow-100 p-3">
                                <Ticket className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">待处理</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {tickets.filter(t => t.status === "OPEN").length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 rounded-lg bg-green-100 p-3">
                                <Ticket className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">已解决</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {tickets.filter(t => t.status === "RESOLVED").length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 rounded-lg bg-purple-100 p-3">
                                <Ticket className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">分配给我的</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {tickets.filter(t => t.assignedToId === session.user.id).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {tickets.length === 0 ? (
                    <EmptyState
                        icon={Ticket}
                        title="暂无工单"
                        description="当前筛选条件下没有找到工单。"
                        action={{ label: "新建工单", href: "/dashboard/tickets/new" }}
                    />
                ) : (
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            工单号
                                        </th>
                                        <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            标题
                                        </th>
                                        <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            客户
                                        </th>
                                        <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            状态
                                        </th>
                                        <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            优先级
                                        </th>
                                        <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            处理人
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
                                    {tickets.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                #{ticket.id.slice(-6).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                                                {ticket.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {ticket.customer?.name || "未知"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(ticket.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getPriorityBadge(ticket.priority)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {ticket.assignedTo?.name || "未分配"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(ticket.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <Link
                                                    href={`/dashboard/tickets/${ticket.id}`}
                                                    className="text-blue-600 hover:text-blue-900 mr-4 font-medium"
                                                >
                                                    处理
                                                </Link>
                                                {ticket.assignedToId === session.user.id && ticket.status !== "CLOSED" && (
                                                    <form
                                                        action={async () => {
                                                            "use server";
                                                            await updateTicketStatus(ticket.id, "CLOSED");
                                                        }}
                                                        className="inline"
                                                    >
                                                        <button
                                                            type="submit"
                                                            className="text-red-600 hover:text-red-900 font-medium"
                                                        >
                                                            关闭
                                                        </button>
                                                    </form>
                                                )}
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