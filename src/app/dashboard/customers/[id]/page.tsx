import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCustomerByIdForEmployee } from "@/services/customer.service";
import { formatDate } from "@/lib/utils";
import DeleteCustomerButton from "@/components/DeleteCustomerButton";

export default async function CustomerDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    const { id } = await params;

    // ✅ 更严格的会话检查
    if (!session) {
        redirect("/login");
    }

    // ✅ 检查用户类型
    if (session.user.type !== "employee") {
        redirect("/login");
    }

    // ✅ 添加错误处理
    let customer;
    try {
        customer = await getCustomerByIdForEmployee(
            id,
            session.user.id,
            session.user.role
        );
    } catch (error) {
        console.error("获取客户详情失败:", error);
        redirect("/dashboard/customers");
    }

    // ✅ 检查客户是否存在
    if (!customer) {
        redirect("/dashboard/customers");
    }

    // 检查是否有编辑权限
    const canEdit =
        session.user.role === "ADMIN" ||
        session.user.role === "MANAGER" ||
        customer.assignedStaff.some(
            (assignment) => assignment.userId === session.user.id
        );

    // 检查是否有删除权限
    const canDelete =
        session.user.role === "ADMIN" ||
        session.user.role === "MANAGER";

    return (
        <main className="min-h-screen bg-gray-50">
            {/* 顶部导航 */}
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard/customers"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ← 返回客户列表
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">
                                客户详情
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            {canEdit && (
                                <Link
                                    href={`/dashboard/customers/${customer.id}/edit`}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                                >
                                    编辑客户
                                </Link>
                            )}
                            {canDelete && (
                                <DeleteCustomerButton customerId={customer.id} /> // ✅ 使用客户端组件
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* 主要内容 */}
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* 左侧：客户基本信息 */}
                    <div className="lg:col-span-2">
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="mb-6 text-lg font-medium text-gray-900">
                                基本信息
                            </h2>
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
                                    <dt className="text-sm font-medium text-gray-500">创建时间</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {formatDate(customer.createdAt)}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* 客户备注/描述 */}
                        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 text-lg font-medium text-gray-900">
                                客户备注
                            </h2>
                            <p className="text-sm text-gray-600">
                                {customer.description || "暂无备注信息"}
                            </p>
                        </div>

                        {/* 跟进记录（占位） */}
                        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 text-lg font-medium text-gray-900">
                                跟进记录
                            </h2>
                            <div className="text-center py-8">
                                <p className="text-gray-500">暂无从跟进记录</p>
                                <button className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
                                    添加跟进记录
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 右侧：侧边栏信息 */}
                    <div className="space-y-8">
                        {/* 负责人信息 */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 text-lg font-medium text-gray-900">
                                负责人信息
                            </h2>
                            {customer.assignedStaff && customer.assignedStaff.length > 0 ? (
                                <div className="space-y-4">
                                    {customer.assignedStaff.map((assignment) => (
                                        <div key={assignment.id} className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <span className="text-blue-600 font-medium">
                                                    {assignment.user.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {assignment.user.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {assignment.user.role === "ADMIN"
                                                        ? "系统管理员"
                                                        : assignment.user.role === "MANAGER"
                                                            ? "部门经理"
                                                            : "销售员"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">暂未分配负责人</p>
                            )}
                        </div>

                        {/* 公司信息 */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 text-lg font-medium text-gray-900">
                                公司信息
                            </h2>
                            {customer.companyCustomers && customer.companyCustomers.length > 0 ? (
                                <div className="space-y-4">
                                    {customer.companyCustomers.map((cc) => (
                                        <div key={cc.id}>
                                            <p className="text-sm font-medium text-gray-900">
                                                {cc.company.name}
                                            </p>
                                            <p className="text-xs text-gray-500">所属公司</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">暂无公司信息</p>
                            )}
                        </div>

                        {/* 操作记录 */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 text-lg font-medium text-gray-900">
                                操作记录
                            </h2>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <span className="text-green-600 text-xs">创</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-900">客户创建</p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(customer.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 text-xs">分</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-900">分配给销售员</p>
                                        <p className="text-xs text-gray-500">2024-01-15</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}