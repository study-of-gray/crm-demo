"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCustomerTickets } from "@/actions/tickets";
import { formatDate } from "@/lib/utils";

export default function TicketsPage() {
    const router = useRouter();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
                return <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold text-blue-800">待处理</span>;
            case "IN_PROGRESS":
                return <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold text-yellow-800">处理中</span>;
            case "RESOLVED":
                return <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold text-green-800">已解决</span>;
            case "CLOSED":
                return <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold text-gray-800">已关闭</span>;
            default:
                return <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold text-gray-800">{status}</span>;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case "LOW":
                return <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold text-gray-800">低</span>;
            case "MEDIUM":
                return <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold text-blue-800">中</span>;
            case "HIGH":
                return <span className="inline-flex rounded-full bg-orange-100 px-2 text-xs font-semibold text-orange-800">高</span>;
            case "URGENT":
                return <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold text-red-800">紧急</span>;
            default:
                return <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold text-gray-800">{priority}</span>;
        }
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">加载中...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            {/* 顶部导航 */}
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ← 返回
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">我的工单</h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    查看和管理您的工单
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Link
                                href="/portal/tickets/new"
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                            >
                                提交工单
                            </Link>
                            <Link
                                href="/portal"
                                className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-500"
                            >
                                客户门户
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {tickets.length === 0 ? (
                    <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
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
                            遇到问题？提交一个工单，我们的技术支持团队会尽快为您处理。
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/portal/tickets/new"
                                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                            >
                                提交第一个工单
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
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
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {ticket.title}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            {getStatusBadge(ticket.status)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            {getPriorityBadge(ticket.priority)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                            {ticket.assignedTo?.name || "未分配"}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                            {formatDate(ticket.createdAt)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                            <Link
                                                href={`/portal/tickets/${ticket.id}`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                查看详情
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}