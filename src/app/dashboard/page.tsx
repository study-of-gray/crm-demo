import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getEmployeeStats } from "@/services/dashboard.service";

export default async function DashboardPage() {
    const session = await auth();

    // ✅ 权限校验
    if (!session || session.user.type !== "employee") {
        redirect("/login");
    }

    // ✅ 获取统计数据
    const stats = await getEmployeeStats(
        session.user.id,
        session.user.role
    );

    return (
        <main className="min-h-screen bg-gray-50">
            {/* 顶部导航 */}
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">
                            员工后台
                        </h1>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                {session.user.name} ({session.user.role})
                            </span>
                            <Link
                                href="/api/auth/signout"
                                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-500"
                            >
                                退出登录
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* 主要内容 */}
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* 欢迎语 */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900">
                        欢迎回来，{session.user.name}！
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        {session.user.role === "ADMIN" && "您拥有系统最高权限"}
                        {session.user.role === "MANAGER" && "您可以管理部门客户"}
                        {session.user.role === "STAFF" && "您正在跟进客户"}
                    </p>
                </div>

                {/* 统计卡片 */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="总客户数"
                        value={stats.totalCustomers}
                        color="blue"
                    />
                    <StatCard
                        title="我的客户"
                        value={stats.myCustomers}
                        color="green"
                    />
                    <StatCard
                        title="本月新增"
                        value={stats.newThisMonth}
                        color="purple"
                    />
                    <StatCard
                        title="待跟进"
                        value={stats.pendingFollowUp}
                        color="orange"
                    />
                </div>

                {/* 快捷操作 */}
                <div className="mt-10">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        快捷操作
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {(session.user.role === "ADMIN" ||
                            session.user.role === "MANAGER") && (
                                <>
                                    <QuickActionCard
                                        title="客户管理"
                                        description="查看和管理所有客户"
                                        href="/dashboard/customers"
                                        icon="👥"
                                    />
                                    <QuickActionCard
                                        title="员工管理"
                                        description="管理系统员工"
                                        href="/dashboard/employees"
                                        icon="👤"
                                    />
                                    <QuickActionCard
                                        title="消息管理"
                                        description="与客户沟通消息"
                                        href="/dashboard/messages"
                                        icon="💬"
                                    />
                                </>
                            )}

                        {session.user.role === "STAFF" && (
                            <>
                                <QuickActionCard
                                    title="我的客户"
                                    description="查看负责的客户"
                                    href="/dashboard/customers"
                                    icon="👥"
                                />
                                <QuickActionCard
                                    title="消息管理"
                                    description="与客户沟通消息"
                                    href="/dashboard/messages"
                                    icon="💬"
                                />
                                <QuickActionCard
                                    title="新增客户"
                                    description="录入新客户"
                                    href="/dashboard/customers/new"
                                    icon="➕"
                                />
                            </>
                        )}
                    </div>
                </div>
                {session.user.role === "STAFF" && (
                    <div className="mt-10">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            最近跟进的客户
                        </h3>
                        <RecentCustomers userId={session.user.id} />
                    </div>
                )}
            </div>
        </main>
    );
}

// ✅ 统计卡片组件
function StatCard({
    title,
    value,
    color,
}: {
    title: string;
    value: number;
    color: "blue" | "green" | "purple" | "orange";
}) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
    };

    return (
        <div className={`rounded-lg p-6 ${colors[color]}`}>
            <h3 className="text-sm font-medium">{title}</h3>
            <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
    );
}

// ✅ 快捷操作卡片
function QuickActionCard({
    title,
    description,
    href,
    icon,
}: {
    title: string;
    description: string;
    href: string;
    icon: string;
}) {
    return (
        <Link
            href={href}
            className="rounded-lg border border-gray-200 bg-white p-6 hover:border-blue-500 hover:shadow-md transition-all"
        >
            <div className="text-3xl mb-2">{icon}</div>
            <h4 className="font-semibold text-gray-900">{title}</h4>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
        </Link>
    );
}

// ✅ 最近客户组件
async function RecentCustomers({ userId }: { userId: string }) {
    const customers = await getRecentCustomers(userId);

    if (customers.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                <p className="text-gray-500">暂无客户数据</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            客户名称
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            邮箱
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            电话
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                            操作
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {customers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50">
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                {customer.name}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                {customer.email}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                {customer.phone}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                <Link
                                    href={`/dashboard/customers/${customer.id}`}
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    查看
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}