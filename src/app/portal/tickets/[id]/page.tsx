"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getCustomerTicketById, replyToTicket } from "@/actions/tickets";
import { formatDate } from "@/lib/utils";

export default function TicketDetailPage() {
    const router = useRouter();
    const params = useParams();
    const ticketId = params.id as string;

    const [ticket, setTicket] = useState<any>(null);
    const [replyContent, setReplyContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadTicket();
    }, [ticketId]);

    const loadTicket = async () => {
        try {
            const data = await getCustomerTicketById(ticketId);
            if (!data) {
                router.push("/portal/tickets");
                return;
            }
            setTicket(data);
        } catch (error) {
            console.error("加载工单失败:", error);
            router.push("/portal/tickets");
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) {
            setError("回复内容不能为空");
            return;
        }

        setSubmitting(true);
        setError("");
        setSuccess("");

        try {
            const result = await replyToTicket(ticketId, replyContent);
            if (result.success) {
                setSuccess("回复成功");
                setReplyContent("");
                // 重新加载工单
                await loadTicket();
            } else {
                setError(result.message || "回复失败");
            }
        } catch (err) {
            setError("回复失败，请稍后重试");
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "OPEN":
                return <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">待处理</span>;
            case "IN_PROGRESS":
                return <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">处理中</span>;
            case "RESOLVED":
                return <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">已解决</span>;
            case "CLOSED":
                return <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">已关闭</span>;
            default:
                return <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">{status}</span>;
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

    const getAuthorInfo = (reply: any) => {
        if (reply.authorUser) {
            return {
                name: reply.authorUser.name,
                role: reply.authorUser.role === "ADMIN" ? "管理员" :
                    reply.authorUser.role === "MANAGER" ? "经理" : "员工"
            };
        } else if (reply.authorCustomer) {
            return {
                name: reply.authorCustomer.name,
                role: "客户"
            };
        }
        return { name: "未知", role: "未知" };
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

    if (!ticket) {
        return null;
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
                                <h1 className="text-2xl font-bold text-gray-900">
                                    工单详情 #{ticket.id.slice(-6).toUpperCase()}
                                </h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    创建于 {formatDate(ticket.createdAt)}
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/portal"
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                        >
                            客户门户
                        </Link>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* 左侧：工单详情 */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* 工单信息 */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{ticket.title}</h2>
                                    <div className="mt-2 flex items-center gap-4">
                                        {getStatusBadge(ticket.status)}
                                        {getPriorityBadge(ticket.priority)}
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
                                回复记录
                            </h2>

                            {ticket.replies.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">暂无回复</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {ticket.replies.map((reply: any) => {
                                        const authorInfo = getAuthorInfo(reply);
                                        return (
                                            <div key={reply.id} className="flex gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <span className="text-blue-600 font-medium">
                                                            {authorInfo.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {authorInfo.name}
                                                                <span className="ml-2 text-xs text-gray-500">
                                                                    {authorInfo.role}
                                                                </span>
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
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* 回复表单 */}
                        {ticket.status !== "CLOSED" && (
                            <div className="rounded-lg border border-gray-200 bg-white p-6">
                                <h2 className="mb-4 text-lg font-medium text-gray-900">
                                    添加回复
                                </h2>

                                {error && (
                                    <div className="mb-4 rounded-md bg-red-50 p-4">
                                        <p className="text-sm text-red-800">{error}</p>
                                    </div>
                                )}

                                {success && (
                                    <div className="mb-4 rounded-md bg-green-50 p-4">
                                        <p className="text-sm text-green-800">{success}</p>
                                    </div>
                                )}

                                <form onSubmit={handleReply}>
                                    <textarea
                                        rows={4}
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="请输入您的回复..."
                                    />
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                                        >
                                            {submitting ? "提交中..." : "提交回复"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* 右侧：工单信息 */}
                    <div className="space-y-8">
                        {/* 工单状态 */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 text-lg font-medium text-gray-900">
                                工单信息
                            </h2>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">状态</dt>
                                    <dd className="mt-1">{getStatusBadge(ticket.status)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">优先级</dt>
                                    <dd className="mt-1">{getPriorityBadge(ticket.priority)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">提交人</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{ticket.customer.name}</dd>
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

                        {/* 帮助信息 */}
                        <div className="rounded-lg bg-blue-50 p-6">
                            <h2 className="mb-2 text-lg font-medium text-gray-900">
                                需要帮助？
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                我们的技术支持团队会在工作时间内尽快回复您的工单。
                            </p>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    <strong>工作时间：</strong><br />
                                    周一至周五 9:00-18:00
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>紧急联系：</strong><br />
                                    emergency@example.com
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}