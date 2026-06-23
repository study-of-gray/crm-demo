import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAssignedCustomers } from "@/services/customer.service";
import { sendMessageToCustomer } from "@/actions/messages";
import { formatDate } from "@/lib/utils";

export default async function NewMessagePage() {
    const session = await auth();

    if (!session || session.user.type !== "employee") {
        redirect("/login");
    }

    // 获取员工负责的客户
    const customers = await getAssignedCustomers(
        session.user.id,
        session.user.role
    );

    async function handleSendMessage(formData: FormData) {
        "use server";

        const customerId = formData.get("customerId") as string;
        const subject = formData.get("subject") as string;
        const content = formData.get("content") as string;

        if (!customerId || !subject || !content) {
            throw new Error("请填写完整信息");
        }

        try {
            const session = await auth();
            if (!session || session.user.type !== "employee") {
                throw new Error("未登录");
            }

            // 获取员工信息
            const employee = await prisma.user.findUnique({
                where: { email: session.user.email },
            });

            if (!employee) {
                throw new Error("员工不存在");
            }

            // 发送消息
            await sendMessageToCustomer(
                employee.id,
                customerId,
                subject,
                content
            );

            redirect("/dashboard/messages");
        } catch (error: any) {
            if (error.digest && error.digest.startsWith("NEXT_REDIRECT")) {
                throw error;
            }
            console.error("发送消息失败:", error);
            throw new Error(error.message || "发送消息失败");
        }
    }

    return (
        <main className="min-h-screen bg-gray-50">
            {/* 顶部导航 */}
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard/messages"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ← 返回消息列表
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">发送消息</h1>
                        </div>
                        <Link
                            href="/dashboard"
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                        >
                            员工后台
                        </Link>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                <form action={handleSendMessage} className="space-y-6">
                    {/* 选择客户 */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h2 className="mb-6 text-lg font-medium text-gray-900">
                            选择客户
                        </h2>
                        <div>
                            <label
                                htmlFor="customerId"
                                className="block text-sm font-medium text-gray-700"
                            >
                                接收客户 <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="customerId"
                                name="customerId"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">请选择客户</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name} ({customer.email})
                                    </option>
                                ))}
                            </select>
                            {customers.length === 0 && (
                                <p className="mt-2 text-sm text-gray-500">
                                    您还没有负责的客户，请先分配客户
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 消息内容 */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h2 className="mb-6 text-lg font-medium text-gray-900">
                            消息内容
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="subject"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    主题 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="请输入消息主题"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="content"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    内容 <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="content"
                                    name="content"
                                    rows={8}
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="请输入消息内容..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* 提交按钮 */}
                    <div className="flex justify-end gap-4">
                        <Link
                            href="/dashboard/messages"
                            className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                        >
                            取消
                        </Link>
                        <button
                            type="submit"
                            disabled={customers.length === 0}
                            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                        >
                            发送消息
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}