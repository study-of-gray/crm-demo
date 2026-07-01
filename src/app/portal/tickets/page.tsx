"use client";

import PageContainer from "@/components/ui/PageContainer";
import { getCustomerTickets } from "@/actions/tickets";
import { formatDate } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import { useState, useEffect } from "react";
import { Ticket, Plus, Search, Filter, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function TicketsPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            const data = await getCustomerTickets();
            setTickets(data);
        } catch (error) {
            console.error("加载工单失败:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "OPEN":
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                        <Clock className="h-3 w-3" />
                        待处理
                    </span>
                );
            case "IN_PROGRESS":
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                        <AlertCircle className="h-3 w-3" />
                        处理中
                    </span>
                );
            case "RESOLVED":
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                        <CheckCircle className="h-3 w-3" />
                        已解决
                    </span>
                );
            case "CLOSED":
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">
                        <XCircle className="h-3 w-3" />
                        已关闭
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">
                        {status}
                    </span>
                );
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

    const filteredTickets = tickets.filter(ticket => {
        if (filter === "all") return true;
        return ticket.status === filter;
    });

    if (loading) {
        return (
            <PageContainer title="我的工单" description="加载中...">
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            title="我的工单"
            description="提交和查看您的工单"
            actions={
                <Link
                    href="/portal/tickets/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    提交工单
                </Link>
            }
        >
            {/* 筛选器 */}
            <div className="mb-6 rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">筛选:</span>
                    </div>

                    {[
                        { value: "all", label: "全部" },
                        { value: "OPEN", label: "待处理" },
                        { value: "IN_PROGRESS", label: "处理中" },
                        { value: "RESOLVED", label: "已解决" },
                        { value: "CLOSED", label: "已关闭" },
                    ].map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setFilter(option.value)}
                            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${filter === option.value
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}

                    <div className="ml-auto relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索工单..."
                            className="rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {filteredTickets.length === 0 ? (
                <EmptyState
                    icon={Ticket}
                    title="暂无工单"
                    description="您还没有提交任何工单，遇到问题？立即提交一个工单吧。"
                    action={{ label: "提交工单", href: "/portal/tickets/new" }}
                />
            ) : (
                <div className="space-y-4">
                    {filteredTickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="rounded-xl bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-lg font-medium text-gray-900">{ticket.title}</h3>
                                        {getStatusBadge(ticket.status)}
                                        {getPriorityBadge(ticket.priority)}
                                    </div>

                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {ticket.description}
                                    </p>

                                    <div className="flex items-center gap-6 text-sm text-gray-500">
                                        <span>工单号: #{ticket.id.slice(-6).toUpperCase()}</span>
                                        <span>处理人: {ticket.assignedTo?.name || "未分配"}</span>
                                        <span>创建时间: {formatDate(ticket.createdAt)}</span>
                                        <span>最后更新: {formatDate(ticket.updatedAt)}</span>
                                    </div>
                                </div>

                                <div className="ml-6 flex flex-col gap-2">
                                    <Link
                                        href={`/portal/tickets/${ticket.id}`}
                                        className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors text-center"
                                    >
                                        查看详情
                                    </Link>
                                    {ticket.status !== "CLOSED" && (
                                        <Link
                                            href={`/portal/tickets/${ticket.id}#reply`}
                                            className="rounded-lg bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors text-center"
                                        >
                                            回复工单
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 工单统计 */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Ticket className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">总工单数</p>
                            <p className="text-2xl font-semibold text-gray-900">{tickets.length}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-yellow-600" />
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
                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-600" />
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
                        <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">处理中</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {tickets.filter(t => t.status === "IN_PROGRESS").length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 帮助信息 */}
            <div className="mt-8 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Ticket className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-blue-900">工单提交指南</h3>
                        <ul className="mt-2 text-sm text-blue-700 space-y-1">
                            <li>• 请详细描述您遇到的问题，包括操作步骤、错误信息等</li>
                            <li>• 紧急问题请选择"紧急"优先级，我们会优先处理</li>
                            <li>• 工单提交后，我们的技术支持团队会在工作时间内尽快回复</li>
                            <li>• 您可以在工单详情页查看处理进度并添加回复</li>
                        </ul>
                        <div className="mt-4">
                            <p className="text-sm text-blue-700">
                                <strong>工作时间：</strong>周一至周五 9:00-18:00<br />
                                <strong>紧急联系：</strong>emergency@example.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}