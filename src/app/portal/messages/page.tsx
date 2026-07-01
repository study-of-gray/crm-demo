"use client";

import PageContainer from "@/components/ui/PageContainer";
import { getCustomerMessages, markMessageAsRead } from "@/actions/messages";
import { formatDate } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import { useState, useEffect } from "react";
import { MessageSquare, Search, Filter, Mail, MailOpen, Eye } from "lucide-react";
import Link from "next/link";

export default function MessagesPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<any>(null);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const msgs = await getCustomerMessages();
            setMessages(msgs);
        } catch (error) {
            console.error("加载消息失败:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (messageId: string) => {
        try {
            await markMessageAsRead(messageId);
            setMessages(messages.map(msg =>
                msg.id === messageId ? { ...msg, isRead: true } : msg
            ));
        } catch (error) {
            console.error("标记已读失败:", error);
        }
    };

    const getSenderInfo = (message: any) => {
        if (message.sender) {
            return {
                name: message.sender.name,
                role: message.sender.role === "ADMIN" ? "管理员" :
                    message.sender.role === "MANAGER" ? "经理" : "销售代表"
            };
        }
        return { name: "系统", role: "系统通知" };
    };

    if (loading) {
        return (
            <PageContainer title="消息中心" description="加载中...">
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            title="消息中心"
            description="查看销售代表和系统的留言"
            actions={
                <div className="flex gap-3">
                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                        <Filter className="h-4 w-4" />
                        筛选
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                        <Search className="h-4 w-4" />
                        搜索
                    </button>
                </div>
            }
        >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* 消息列表 */}
                <div className="lg:col-span-1">
                    <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
                        {messages.length === 0 ? (
                            <div className="p-6 text-center">
                                <EmptyState
                                    icon={MessageSquare}
                                    title="暂无消息"
                                    description="您还没有收到任何消息。"
                                />
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                                {messages.map((message) => {
                                    const senderInfo = getSenderInfo(message);
                                    return (
                                        <li
                                            key={message.id}
                                            onClick={() => {
                                                setSelectedMessage(message);
                                                if (!message.isRead) {
                                                    handleMarkAsRead(message.id);
                                                }
                                            }}
                                            className={`cursor-pointer p-4 hover:bg-gray-50 transition-colors ${!message.isRead ? "bg-blue-50" : ""
                                                } ${selectedMessage?.id === message.id ? "bg-blue-100" : ""}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span className="text-blue-600 font-medium text-sm">
                                                        {senderInfo.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className={`text-sm font-medium truncate ${!message.isRead ? "text-gray-900" : "text-gray-700"
                                                            }`}>
                                                            {message.subject}
                                                        </p>
                                                        {!message.isRead && (
                                                            <span className="h-2 w-2 rounded-full bg-blue-600 ml-2"></span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1 truncate">
                                                        {senderInfo.name} • {senderInfo.role}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {formatDate(message.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>

                {/* 消息详情 */}
                <div className="lg:col-span-2">
                    {selectedMessage ? (
                        <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{selectedMessage.subject}</h2>
                                        <div className="mt-2 flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span className="text-blue-600 font-medium text-sm">
                                                        {getSenderInfo(selectedMessage).name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {getSenderInfo(selectedMessage).name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {getSenderInfo(selectedMessage).role}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {formatDate(selectedMessage.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {!selectedMessage.isRead && (
                                            <button
                                                onClick={() => handleMarkAsRead(selectedMessage.id)}
                                                className="rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                <MailOpen className="h-3 w-3 inline mr-1" />
                                                标为已读
                                            </button>
                                        )}
                                        <Link
                                            href={`/portal/tickets/new?subject=${encodeURIComponent(selectedMessage.subject)}`}
                                            className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                                        >
                                            回复工单
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="prose prose-sm max-w-none">
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {selectedMessage.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-12 text-center">
                            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">选择一条消息查看详情</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                点击左侧消息列表中的任意消息查看完整内容
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* 消息统计 */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">总消息数</p>
                            <p className="text-2xl font-semibold text-gray-900">{messages.length}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">未读消息</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {messages.filter(m => !m.isRead).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <Eye className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">已读消息</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {messages.filter(m => m.isRead).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}