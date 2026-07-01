import PageContainer from "@/components/ui/PageContainer";
import { getMessages } from "@/actions/messages";
import { formatDate } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import { MessageSquare, Plus, Search } from "lucide-react";
import Link from "next/link";

export default async function MessagesPage() {
    const messages = await getMessages();

    return (
        <PageContainer
            title="消息中心"
            description="查看和管理客户消息"
            actions={
                <Link
                    href="/dashboard/messages/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    发送消息
                </Link>
            }
        >
            {/* 搜索栏 */}
            <div className="mb-6 rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="搜索消息主题或内容..."
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            {messages.length === 0 ? (
                <EmptyState
                    icon={MessageSquare}
                    title="暂无消息"
                    description="您还没有发送或收到任何消息。"
                    action={{ label: "发送消息", href: "/dashboard/messages/new" }}
                />
            ) : (
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className="rounded-xl bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span className="text-blue-600 font-medium">
                                                {message.sender?.name?.charAt(0) || "系"}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">{message.subject}</h3>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{message.content}</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-gray-500">
                                                    来自: {message.sender?.name || "系统"}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(message.createdAt)}
                                                </span>
                                                {!message.isRead && (
                                                    <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                                                        未读
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    href={`/dashboard/messages/${message.id}`}
                                    className="ml-4 rounded-lg bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    查看详情
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageContainer>
    );
}