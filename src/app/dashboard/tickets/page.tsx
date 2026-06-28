import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAllTickets, updateTicketStatus, assignTicket } from "@/actions/tickets";
import { formatDate } from "@/lib/utils";

export default async function EmployeeTicketsPage({
    searchParams,
}: {
    searchParams: { status?: string; priority?: string };
}) {
    const session = await auth();

    if (!session || session.user.type !== "employee") {
        redirect("/login");
    }

    const resolvedSearchParams = await searchParams;
    const statusFilter = resolvedSearchParams.status;
    const priorityFilter = resolvedSearchParams.priority;;

    const tickets = await getAllTickets(
        statusFilter,
        priorityFilter,
        session.user.role === "STAFF" ? session.user.id : undefined
    );

    // 获取所有员工（用于分配下拉框）
    const employees = await fetch("/api/employees").then(res => res.json()).catch(() => []);

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
                                ← 返回员工后台
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">工单管理</h1>
                        </div>
                        <div className="flex gap-4">
                            <Link
                                href="/dashboard"
                                className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-500"
                            >
                                员工后台
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* 筛选器 */}
                <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
                    <form className="flex flex-wrap items-center gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                状态筛选
                            </label>
                            <select
                                name="status"
                                defaultValue={statusFilter || ""}
                                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">全部状态</option>
                                <option value="OPEN">待处理</option>
                                <option value="IN_PROGRESS">处理中</option>
                                <option value="RESOLVED">已解决</option>
                                <option value="CLOSED">已关闭</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                优先级筛选
                            </label>
                            <select
                                name="priority"
                                defaultValue={priorityFilter || ""}
                                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">全部优先级</option>
                                <option value="LOW">低</option>
                                <option value="MEDIUM">中</option>
                                <option value="HIGH">高</option>
                                <option value="URGENT">紧急</option>
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                            >
                                筛选
                            </button>
                            <Link
                                href="/dashboard/tickets"
                                className="ml-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                            >
                                重置
                            </Link>
                        </div>
                    </form>
                </div>

                {/* 统计卡片 */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 rounded-md bg-blue-100 p-3">
                                <span className="text-2xl">🎫</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500">总工单数</h3>
                                <p className="text-2xl font-semibold text-gray-900">{tickets.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 rounded-md bg-yellow-100 p-3">
                                <span className="text-2xl">⏳</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500">待处理</h3>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {tickets.filter(t => t.status === "OPEN").length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 rounded-md bg-green-100 p-3">
                                <span className="text-2xl">✅</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500">已解决</h3>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {tickets.filter(t => t.status === "RESOLVED").length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 rounded-md bg-purple-100 p-3">
                                <span className="text-2xl">👤</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500">分配给我的</h3>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {tickets.filter(t => t.assignedToId === session.user.id).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 工单列表 */}
                <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                    {tickets.length === 0 ? (
                        <div className="text-center py-12">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">暂无工单</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                当前筛选条件下没有找到工单
                            </p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        工单号
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        标题
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        客户
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        状态
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        优先级
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        处理人
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
                                {tickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            #{ticket.id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                                            {ticket.title}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                            {ticket.customer.name}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${ticket.status === "OPEN" ? "bg-blue-100 text-blue-800" :
                                                ticket.status === "IN_PROGRESS" ? "bg-yellow-100 text-yellow-800" :
                                                    ticket.status === "RESOLVED" ? "bg-green-100 text-green-800" :
                                                        "bg-gray-100 text-gray-800"
                                                }`}>
                                                {ticket.status === "OPEN" ? "待处理" :
                                                    ticket.status === "IN_PROGRESS" ? "处理中" :
                                                        ticket.status === "RESOLVED" ? "已解决" : "已关闭"}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${ticket.priority === "LOW" ? "bg-gray-100 text-gray-800" :
                                                ticket.priority === "MEDIUM" ? "bg-blue-100 text-blue-800" :
                                                    ticket.priority === "HIGH" ? "bg-orange-100 text-orange-800" :
                                                        "bg-red-100 text-red-800"
                                                }`}>
                                                {ticket.priority === "LOW" ? "低" :
                                                    ticket.priority === "MEDIUM" ? "中" :
                                                        ticket.priority === "HIGH" ? "高" : "紧急"}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                            {ticket.assignedTo?.name || "未分配"}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                            {formatDate(ticket.createdAt)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                            <Link
                                                href={`/dashboard/tickets/${ticket.id}`}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                处理
                                            </Link>
                                            {ticket.status !== "CLOSED" && (
                                                <form
                                                    action={async () => {
                                                        "use server";
                                                        await updateTicketStatus(ticket.id, "CLOSED");
                                                    }}
                                                    className="inline"
                                                >
                                                    <button
                                                        type="submit"
                                                        className="text-red-600 hover:text-red-900"
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
                    )}
                </div>
            </div>
        </main>
    );
}