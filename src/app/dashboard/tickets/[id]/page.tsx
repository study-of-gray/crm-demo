import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getTicketById, replyToTicketAsEmployee, assignTicket, updateTicketStatus } from "@/app/actions/tickets";
import { formatDate } from "@/lib/utils";

export default async function TicketDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await auth();

    if (!session || session.user.type !== "employee") {
        redirect("/login");
    }

    const resolvedParams = await params;
    const ticket = await getTicketById(resolvedParams.id);
    if (!ticket) {
        redirect("/dashboard/tickets");
    }

    // 检查权限：普通员工只能看分配给自己的工单
    if (session.user.role === "STAFF" && ticket.assignedToId !== session.user.id) {
        redirect("/dashboard/tickets");
    }

    // 获取所有员工（用于分配下拉框）
    const employees = await fetch(`/api/employees`).then(res => res.json()).catch(() => []);

    return (
        <main className="min-h-screen bg-gray-50">
            {/* 顶部导航 */}
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard/tickets"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ← 返回工单列表
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    工单详情 #{ticket.id.slice(-6).toUpperCase()}
                                </h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    创建于 {formatDate(ticket.createdAt)}
                                </p>
                            </div>
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
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* 左侧：工单内容和回复 */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* 工单信息 */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{ticket.title}</h2>
                                    <div className="mt-2 flex items-center gap-4">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${ticket.status === "OPEN" ? "bg-blue-100 text-blue-800" :
                                            ticket.status === "IN_PROGRESS" ? "bg-yellow-100 text-yellow-800" :
                                                ticket.status === "RESOLVED" ? "bg-green-100 text-green-800" :
                                                    "bg-gray-100 text-gray-800"
                                            }`}>
                                            {ticket.status === "OPEN" ? "待处理" :
                                                ticket.status === "IN_PROGRESS" ? "处理中" :
                                                    ticket.status === "RESOLVED" ? "已解决" : "已关闭"}
                                        </span>
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${ticket.priority === "LOW" ? "bg-gray-100 text-gray-800" :
                                            ticket.priority === "MEDIUM" ? "bg-blue-100 text-blue-800" :
                                                ticket.priority === "HIGH" ? "bg-orange-100 text-orange-800" :
                                                    "bg-red-100 text-red-800"
                                            }`}>
                                            {ticket.priority === "LOW" ? "低" :
                                                ticket.priority === "MEDIUM" ? "中" :
                                                    ticket.priority === "HIGH" ? "高" : "紧急"}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">处理人</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {ticket.assignedTo?.name || "未分配"}
                                    </p>
                                </div>
                            </div>

                            <div className="prose prose-sm max-w-none">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {ticket.description}
                                </p>
                            </div>
                        </div>

                        {/* 回复列表 */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="mb-6 text-lg font-medium text-gray-900">
                                回复记录 ({ticket.replies.length})
                            </h2>

                            {ticket.replies.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">暂无回复</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {ticket.replies.map((reply: any) => (
                                        <div key={reply.id} className={`flex gap-4 ${reply.isInternal ? 'bg-yellow-50 p-4 rounded-lg border border-yellow-200' : ''}`}>
                                            <div className="flex-shrink-0">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${reply.isInternal ? 'bg-yellow-100' : 'bg-blue-100'
                                                    }`}>
                                                    <span className={`font-medium ${reply.isInternal ? 'text-yellow-600' : 'text-blue-600'
                                                        }`}>
                                                        {reply.authorUser?.name?.charAt(0) || reply.authorCustomer?.name?.charAt(0)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {reply.authorUser?.name || reply.authorCustomer?.name}
                                                            <span className="ml-2 text-xs text-gray-500">
                                                                {reply.authorUser ?
                                                                    (reply.authorUser.role === "ADMIN" ? "管理员" :
                                                                        reply.authorUser.role === "MANAGER" ? "经理" : "员工") :
                                                                    "客户"}
                                                            </span>
                                                            {reply.isInternal && (
                                                                <span className="ml-2 inline-flex rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                                                                    内部回复
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatDate(reply.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                                                    {reply.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 回复表单 */}
                        {ticket.status !== "CLOSED" && (
                            <div className="rounded-lg border border-gray-200 bg-white p-6">
                                <h2 className="mb-4 text-lg font-medium text-gray-900">
                                    添加回复
                                </h2>

                                <form
                                    action={async (formData: FormData) => {
                                        "use server";
                                        const content = formData.get("content") as string;
                                        const isInternal = formData.get("isInternal") === "on";

                                        if (!content.trim()) {
                                            throw new Error("回复内容不能为空");
                                        }

                                        await replyToTicketAsEmployee(ticket.id, content, isInternal);
                                        redirect(`/dashboard/tickets/${ticket.id}`);
                                    }}
                                >
                                    <textarea
                                        name="content"
                                        rows={4}
                                        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="请输入您的回复..."
                                        required
                                    />

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="isInternal"
                                                id="isInternal"
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor="isInternal" className="ml-2 text-sm text-gray-700">
                                                内部回复（客户不可见）
                                            </label>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                type="submit"
                                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                                            >
                                                提交回复
                                            </button>

                                            {ticket.status !== "RESOLVED" && (
                                                <form
                                                    action={async () => {
                                                        "use server";
                                                        await updateTicketStatus(ticket.id, "RESOLVED");
                                                        redirect(`/dashboard/tickets/${ticket.id}`);
                                                    }}
                                                    className="inline"
                                                >
                                                    <button
                                                        type="submit"
                                                        className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500"
                                                    >
                                                        标记为已解决
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* 右侧：工单操作和信息 */}
                    <div className="space-y-8">
                        {/* 工单操作 */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 text-lg font-medium text-gray-900">
                                工单操作
                            </h2>

                            {/* 分配工单（仅管理员/经理可见） */}
                            {(session.user.role === "ADMIN" || session.user.role === "MANAGER") && (
                                <form
                                    action={async (formData: FormData) => {
                                        "use server";
                                        const assignedToId = formData.get("assignedToId") as string;
                                        if (assignedToId) {
                                            await assignTicket(ticket.id, assignedToId);
                                            redirect(`/dashboard/tickets/${ticket.id}`);
                                        }
                                    }}
                                    className="mb-4"
                                >
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        分配给
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            name="assignedToId"
                                            defaultValue={ticket.assignedToId || ""}
                                            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="">选择员工</option>
                                            {employees.map((emp: any) => (
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.name} ({emp.role === "ADMIN" ? "管理员" : emp.role === "MANAGER" ? "经理" : "员工"})
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="submit"
                                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                                        >
                                            分配
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* 状态更新 */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">更新状态</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {ticket.status !== "IN_PROGRESS" && (
                                        <form
                                            action={async () => {
                                                "use server";
                                                await updateTicketStatus(ticket.id, "IN_PROGRESS");
                                                redirect(`/dashboard/tickets/${ticket.id}`);
                                            }}
                                        >
                                            <button
                                                type="submit"
                                                className="w-full rounded-md bg-yellow-100 px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-200"
                                            >
                                                处理中
                                            </button>
                                        </form>
                                    )}

                                    {ticket.status !== "RESOLVED" && (
                                        <form
                                            action={async () => {
                                                "use server";
                                                await updateTicketStatus(ticket.id, "RESOLVED");
                                                redirect(`/dashboard/tickets/${ticket.id}`);
                                            }}
                                        >
                                            <button
                                                type="submit"
                                                className="w-full rounded-md bg-green-100 px-3 py-2 text-sm font-medium text-green-800 hover:bg-green-200"
                                            >
                                                已解决
                                            </button>
                                        </form>
                                    )}

                                    {ticket.status !== "CLOSED" && (
                                        <form
                                            action={async () => {
                                                "use server";
                                                await updateTicketStatus(ticket.id, "CLOSED");
                                                redirect(`/dashboard/tickets/${ticket.id}`);
                                            }}
                                            className="col-span-2"
                                        >
                                            <button
                                                type="submit"
                                                className="w-full rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200"
                                            >
                                                关闭工单
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 工单信息 */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 text-lg font-medium text-gray-900">
                                工单信息
                            </h2>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">工单号</dt>
                                    <dd className="mt-1 text-sm text-gray-900">#{ticket.id.slice(-6).toUpperCase()}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">状态</dt>
                                    <dd className="mt-1">
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${ticket.status === "OPEN" ? "bg-blue-100 text-blue-800" :
                                            ticket.status === "IN_PROGRESS" ? "bg-yellow-100 text-yellow-800" :
                                                ticket.status === "RESOLVED" ? "bg-green-100 text-green-800" :
                                                    "bg-gray-100 text-gray-800"
                                            }`}>
                                            {ticket.status === "OPEN" ? "待处理" :
                                                ticket.status === "IN_PROGRESS" ? "处理中" :
                                                    ticket.status === "RESOLVED" ? "已解决" : "已关闭"}
                                        </span>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">优先级</dt>
                                    <dd className="mt-1">
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${ticket.priority === "LOW" ? "bg-gray-100 text-gray-800" :
                                            ticket.priority === "MEDIUM" ? "bg-blue-100 text-blue-800" :
                                                ticket.priority === "HIGH" ? "bg-orange-100 text-orange-800" :
                                                    "bg-red-100 text-red-800"
                                            }`}>
                                            {ticket.priority === "LOW" ? "低" :
                                                ticket.priority === "MEDIUM" ? "中" :
                                                    ticket.priority === "HIGH" ? "高" : "紧急"}
                                        </span>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">提交人</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{ticket.customer.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">客户邮箱</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{ticket.customer.email}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">处理人</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {ticket.assignedTo?.name || "未分配"}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">创建时间</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {formatDate(ticket.createdAt)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">最后更新</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {formatDate(ticket.updatedAt)}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* 快速操作 */}
                        <div className="rounded-lg bg-blue-50 p-6">
                            <h2 className="mb-2 text-lg font-medium text-gray-900">
                                快速操作
                            </h2>
                            <div className="space-y-2">
                                <Link
                                    href={`mailto:${ticket.customer.email}`}
                                    className="flex items-center justify-between rounded-md bg-white p-3 hover:bg-gray-50"
                                >
                                    <span className="text-sm font-medium text-gray-900">发送邮件</span>
                                    <span className="text-gray-400">→</span>
                                </Link>
                                <Link
                                    href={`/dashboard/customers/${ticket.customer.id}`}
                                    className="flex items-center justify-between rounded-md bg-white p-3 hover:bg-gray-50"
                                >
                                    <span className="text-sm font-medium text-gray-900">查看客户资料</span>
                                    <span className="text-gray-400">→</span>
                                </Link>
                                <Link
                                    href={`/dashboard/messages/new?customerId=${ticket.customer.id}`}
                                    className="flex items-center justify-between rounded-md bg-white p-3 hover:bg-gray-50"
                                >
                                    <span className="text-sm font-medium text-gray-900">发送消息</span>
                                    <span className="text-gray-400">→</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}