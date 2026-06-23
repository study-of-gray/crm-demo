"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getCustomerMessages, getUnreadMessageCount } from "@/actions/messages";
import Link from "next/link";

export default function MessagesPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<any>(null);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const [messagesData, unreadData] = await Promise.all([
                getCustomerMessages(),
                getUnreadMessageCount(),
            ]);

            setMessages(messagesData);
            setUnreadCount(unreadData);
        } catch (error) {
            console.error("加载消息失败:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
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
                                <h1 className="text-2xl font-bold text-gray-900">消息中心</h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    您有 {unreadCount} 条未读消息
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
                    {/* 消息列表 */}
                    <div className="lg:col-span-1">
                        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                            {messages.length === 0 ? (
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
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">暂无消息</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        当有新消息时，会显示在这里
                                    </p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {messages.map((message) => (
                                        <li
                                            key={message.id}
                                            onClick={() => setSelectedMessage(message)}
                                            className={`cursor-pointer p-4 hover:bg-gray-50 transition-colors ${!message.isRead ? "bg-blue-50" : ""
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-medium ${!message.isRead ? "text-gray-900" : "text-gray-700"}`}>
                                                        {message.subject}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {message.content.substring(0, 50)}...
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {message.sender.name} · {formatDate(message.createdAt)}
                                                    </p>
                                                </div>
                                                {!message.isRead && (
                                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                                        未读
                                                    </span>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* 消息详情 */}
                    <div className="lg:col-span-2">
                        {selectedMessage ? (
                            <div className="rounded-lg border border-gray-200 bg-white p-6">
                                <div className="border-b border-gray-200 pb-4 mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {selectedMessage.subject}
                                    </h2>
                                    <div className="mt-2 flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">发件人：</span>
                                            {selectedMessage.sender.name} ({selectedMessage.sender.role === "ADMIN" ? "管理员" : selectedMessage.sender.role === "MANAGER" ? "经理" : "销售代表"})
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {formatDate(selectedMessage.createdAt)}
                                        </div>
                                    </div>
                                </div>

                                <div className="prose prose-sm max-w-none">
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {selectedMessage.content}
                                    </p>
                                </div>

                                <div className="mt-8 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={() => setSelectedMessage(null)}
                                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            返回列表
                                        </button>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    // 这里可以添加回复功能
                                                    alert("回复功能开发中...");
                                                }}
                                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                            >
                                                回复
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
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
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">选择一条消息查看详情</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    点击左侧消息列表中的任意消息查看完整内容
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}