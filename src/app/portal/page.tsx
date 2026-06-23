import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCustomerProfile } from "@/services/customer.service";
import { formatDate } from "@/lib/utils";

export default async function PortalPage() {
    const session = await auth();

    // ✅ 检查是否是客户
    if (!session || session.user.type !== "customer") {
        redirect("/login");
    }

    // ✅ 获取客户详细信息
    const customer = await getCustomerProfile(session.user.email!);

    if (!customer) {
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-gray-50">
            {/* 顶部导航 */}
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                客户门户
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                欢迎回来，{customer.name}！
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                客户编号：{customer.id.slice(-8).toUpperCase()}
                            </span>
                            <Link
                                href="/api/auth/signout"
                                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                            >
                                退出登录
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* 左侧：客户信息 */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* 基本信息卡片 */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-medium text-gray-900">
                                    基本信息
                                </h2>
                                <Link
                                    href="/portal/profile"
                                    className="text-sm text-blue-600 hover:text-blue-900"
                                >
                                    编辑资料
                                </Link>
                            </div>
                            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">客户名称</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{customer.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">邮箱</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{customer.email}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">电话</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{customer.phone || "未填写"}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">注册时间</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {formatDate(customer.createdAt)}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* 我的负责人 */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="mb-6 text-lg font-medium text-gray-900">
                                我的负责人
                            </h2>
                            {customer.assignedStaff && customer.assignedStaff.length > 0 ? (
                                <div className="space-y-4">
                                    {customer.assignedStaff.map((assignment) => (
                                        <div key={assignment.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                                <span className="text-blue-600 font-medium text-lg">
                                                    {assignment.user.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {assignment.user.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {assignment.user.role === "ADMIN"
                                                        ? "系统管理员"
                                                        : assignment.user.role === "MANAGER"
                                                            ? "部门经理"
                                                            : "销售代表"}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    邮箱：{assignment.user.email}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <a
                                                    href={`mailto:${assignment.user.email}`}
                                                    className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                                                >
                                                    发邮件
                                                </a>
                                                <a
                                                    href={`tel:${assignment.user.phone || ""}`}
                                                    className="rounded-md bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                                                >
                                                    打电话
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">暂未分配负责人</p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        如有需要，请联系客服分配专属销售代表
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* 公司信息 */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="mb-6 text-lg font-medium text-gray-900">
                                所属公司
                            </h2>
                            {customer.companyCustomers && customer.companyCustomers.length > 0 ? (
                                <div className="space-y-4">
                                    {customer.companyCustomers.map((cc) => (
                                        <div key={cc.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                                                <span className="text-indigo-600 font-medium">
                                                    {cc.company.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {cc.company.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    合作客户
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">暂无公司信息</p>
                            )}
                        </div>
                    </div>

                    {/* 右侧：快捷操作 */}
                    <div className="space-y-8">
                        {/* 账户安全 */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 text-lg font-medium text-gray-900">
                                账户安全
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            登录密码
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            建议定期更换密码
                                        </p>
                                    </div>
                                    <Link
                                        href="/portal/change-password"
                                        className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                                    >
                                        修改密码
                                    </Link>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            账户状态
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            正常使用中
                                        </p>
                                    </div>
                                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold text-green-800">
                                        正常
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 快捷操作 */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 text-lg font-medium text-gray-900">
                                快捷操作
                            </h2>
                            <div className="space-y-3">
                                <Link
                                    href="/portal/profile"
                                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-xl">👤</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            个人资料
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            查看和修改个人信息
                                        </p>
                                    </div>
                                </Link>
                                <Link
                                    href="/portal/messages"
                                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-xl">💬</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            消息中心
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            查看销售代表留言
                                        </p>
                                    </div>
                                </Link>
                                <Link
                                    href="/portal/documents"
                                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-xl">📄</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            我的文档
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            下载合同和资料
                                        </p>
                                    </div>
                                </Link>
                                <Link
                                    href="/portal/support"
                                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-xl">🎫</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            提交工单
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            遇到问题？提交工单
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* 帮助中心 */}
                        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                            <h2 className="mb-2 text-lg font-medium text-gray-900">
                                需要帮助？
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                如果您有任何问题，请联系您的专属销售代表或客服团队。
                            </p>
                            <a
                                href="mailto:support@example.com"
                                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                            >
                                联系客服
                                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}