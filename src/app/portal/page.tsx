import PortalLayout from "@/components/ui/layouts/PortalLayout";
import PageContainer from "@/components/ui/PageContainer";
import StatCard from "@/components/ui/StatCard";
import { getCustomerDashboardStats } from "@/actions/customer-dashboard";
import {
    User,
    MessageSquare,
    FileText,
    Ticket,
    Bell,
    TrendingUp
} from "lucide-react";
import Link from "next/link";

export default async function PortalPage() {
    const stats = await getCustomerDashboardStats();

    return (
        <PortalLayout>
            <PageContainer
                title="客户门户"
                description={`欢迎回来，${stats.customerName}！这里是您的专属工作台。`}
            >
                {/* 统计卡片 */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="未读消息"
                        value={stats.unreadMessages}
                        icon={MessageSquare}
                        color="blue"
                    />
                    <StatCard
                        title="我的文档"
                        value={stats.totalDocuments}
                        icon={FileText}
                        color="green"
                    />
                    <StatCard
                        title="待处理工单"
                        value={stats.openTickets}
                        icon={Ticket}
                        color="yellow"
                    />
                    <StatCard
                        title="账户状态"
                        value="正常"
                        icon={User}
                        color="purple"
                    />
                </div>

                {/* 快捷操作 */}
                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Link
                            href="/portal/profile"
                            className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">个人资料</h3>
                                <p className="text-xs text-gray-500 mt-1">查看和修改个人信息</p>
                            </div>
                        </Link>

                        <Link
                            href="/portal/messages"
                            className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                                <MessageSquare className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">消息中心</h3>
                                <p className="text-xs text-gray-500 mt-1">查看销售代表留言</p>
                            </div>
                        </Link>

                        <Link
                            href="/portal/documents"
                            className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">我的文档</h3>
                                <p className="text-xs text-gray-500 mt-1">下载合同和资料</p>
                            </div>
                        </Link>

                        <Link
                            href="/portal/tickets"
                            className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Ticket className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">我的工单</h3>
                                <p className="text-xs text-gray-500 mt-1">提交和查看工单</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* 最近活动 */}
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* 最近消息 */}
                    <div className="rounded-xl bg-white shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">最近消息</h2>
                                <Link
                                    href="/portal/messages"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                >
                                    查看全部
                                </Link>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {stats.recentMessages.length > 0 ? (
                                stats.recentMessages.map((message) => (
                                    <div key={message.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <span className="text-blue-600 font-medium text-sm">
                                                    {message.sender.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">{message.subject}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    来自: {message.sender.name} • {new Date(message.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {!message.isRead && (
                                                <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center">
                                    <p className="text-sm text-gray-500">暂无消息</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 最近工单 */}
                    <div className="rounded-xl bg-white shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">最近工单</h2>
                                <Link
                                    href="/portal/tickets"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                >
                                    查看全部
                                </Link>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {stats.recentTickets.length > 0 ? (
                                stats.recentTickets.map((ticket) => (
                                    <div key={ticket.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{ticket.title}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    状态: {ticket.status === "OPEN" ? "待处理" :
                                                        ticket.status === "IN_PROGRESS" ? "处理中" :
                                                            ticket.status === "RESOLVED" ? "已解决" : "已关闭"} •
                                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${ticket.status === "OPEN" ? "bg-blue-100 text-blue-800" :
                                                ticket.status === "IN_PROGRESS" ? "bg-yellow-100 text-yellow-800" :
                                                    ticket.status === "RESOLVED" ? "bg-green-100 text-green-800" :
                                                        "bg-gray-100 text-gray-800"
                                                }`}>
                                                {ticket.status === "OPEN" ? "待处理" :
                                                    ticket.status === "IN_PROGRESS" ? "处理中" :
                                                        ticket.status === "RESOLVED" ? "已解决" : "已关闭"}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center">
                                    <p className="text-sm text-gray-500">暂无工单</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 帮助与支持 */}
                <div className="mt-8 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">需要帮助？</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                如果您有任何问题，请联系您的专属销售代表或客服团队。
                            </p>
                        </div>
                        <Link
                            href="/portal/tickets/new"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                        >
                            <Ticket className="h-4 w-4" />
                            提交工单
                        </Link>
                    </div>
                </div>
            </PageContainer>
        </PortalLayout>
    );
}