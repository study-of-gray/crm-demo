import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSentMessages } from "@/actions/messages";
import { formatDate } from "@/lib/utils";

export default async function EmployeeMessagesPage() {
    const session = await auth();

    if (!session || session.user.type !== "employee") {
        redirect("/login");
    }

    const messages = await getSentMessages(session.user.id);

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
                            <h1 className="text-2xl font-bold text-gray-900">消息管理</h1>
                        </div>
                        <Link
                            href="/dashboard/messages/new"
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                        >
                            发送消息
                        </Link>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* 消息列表 */}
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
                                点击右上角"发送消息"开始沟通
                            </p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        主题
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        接收客户
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        发送时间
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        状态
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {messages.map((message) => (
                                    <tr key={message.id} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                            {message.subject}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                            {message.receiver?.name || "未知客户"}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                            {formatDate(message.createdAt)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <span
                                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${message.isRead
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {message.isRead ? "已读" : "未读"}
                                            </span>
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