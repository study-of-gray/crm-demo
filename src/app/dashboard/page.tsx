import DashboardLayout from "@/components/ui/layouts/DashboardLayout";
import PageContainer from "@/components/ui/PageContainer";
import StatCard from "@/components/ui/StatCard";
import { getDashboardStats } from "@/actions/dashboard";
import {
    Users,
    MessageSquare,
    FileText,
    Ticket,
    TrendingUp,
    Activity
} from "lucide-react";

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return (
        <DashboardLayout>
            <PageContainer
                title="仪表盘"
                description="欢迎回来，这里是您的CRM工作台概览"
            >
                {/* 统计卡片 */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="总客户数"
                        value={stats.totalCustomers}
                        icon={Users}
                        color="blue"
                        trend={{ value: 12, isPositive: true }}
                    />
                    <StatCard
                        title="未读消息"
                        value={stats.unreadMessages}
                        icon={MessageSquare}
                        color="yellow"
                        trend={{ value: 5, isPositive: false }}
                    />
                    <StatCard
                        title="文档总数"
                        value={stats.totalDocuments}
                        icon={FileText}
                        color="green"
                        trend={{ value: 8, isPositive: true }}
                    />
                    <StatCard
                        title="待处理工单"
                        value={stats.openTickets}
                        icon={Ticket}
                        color="red"
                        trend={{ value: 3, isPositive: false }}
                    />
                </div>

                {/* 最近活动 */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* 最近工单 */}
                    <div className="rounded-xl bg-white shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">最近工单</h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {stats.recentTickets.map((ticket) => (
                                <div key={ticket.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{ticket.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                客户: {ticket.customer.name} • {new Date(ticket.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${ticket.status === "OPEN" ? "bg-blue-100 text-blue-800" :
                                            ticket.status === "IN_PROGRESS" ? "bg-yellow-100 text-yellow-800" :
                                                "bg-green-100 text-green-800"
                                            }`}>
                                            {ticket.status === "OPEN" ? "待处理" :
                                                ticket.status === "IN_PROGRESS" ? "处理中" : "已解决"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 最近消息 */}
                    <div className="rounded-xl bg-white shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">最近消息</h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {stats.recentMessages.map((message) => (
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
                            ))}
                        </div>
                    </div>
                </div>
            </PageContainer>
        </DashboardLayout>
    );
}