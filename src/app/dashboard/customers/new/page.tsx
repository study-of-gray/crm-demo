import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createCustomer } from "@/services/customer.service";
import { getCompanies } from "@/services/company.service";
import { getEmployees } from "@/services/user.service";

export default async function NewCustomerPage() {
    const session = await auth();

    if (!session || session.user.type !== "employee") {
        redirect("/login");
    }

    // 检查权限：只有管理员、经理和员工可以创建客户
    const canCreate =
        session.user.role === "ADMIN" ||
        session.user.role === "MANAGER" ||
        session.user.role === "STAFF";

    if (!canCreate) {
        redirect("/dashboard/customers");
    }

    // 获取公司列表（用于分配公司）
    const companies = await getCompanies();

    // 获取员工列表（用于分配负责人）
    const employees = await getEmployees(session.user.id, session.user.role);

    async function handleCreate(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const description = formData.get("description") as string;
        const companyId = formData.get("companyId") as string;
        const assignedToId = formData.get("assignedToId") as string;

        if (!name || !email) {
            throw new Error("客户名称和邮箱不能为空");
        }

        try {
            await createCustomer(
                {
                    name,
                    email,
                    phone,
                    description,
                    companyId,
                    assignedToId,
                },
                session.user.id,
                session.user.role
            );

            redirect("/dashboard/customers");
        } catch (error: any) {
            // 检查是否是重定向错误，如果是则重新抛出
            if (error.digest && error.digest.startsWith("NEXT_REDIRECT")) {
                throw error;
            }

            console.error("创建客户失败:", error);
            throw new Error(error.message || "创建客户失败");
        }
    }

    return (
        <main className="min-h-screen bg-gray-50">
            {/* 顶部导航 */}
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/customers"
                            className="text-gray-600 hover:text-gray-900"
                        >
                            ← 返回客户列表
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">新增客户</h1>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                <form action={handleCreate} className="space-y-6">
                    {/* 基本信息 */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h2 className="mb-6 text-lg font-medium text-gray-900">
                            基本信息
                        </h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    客户名称 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="请输入客户名称"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    邮箱 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="example@company.com"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    电话
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="请输入电话号码"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="companyId"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    所属公司
                                </label>
                                <select
                                    id="companyId"
                                    name="companyId"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">请选择公司</option>
                                    {companies.map((company) => (
                                        <option key={company.id} value={company.id}>
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700"
                            >
                                客户备注
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="请输入客户备注信息..."
                            />
                        </div>
                    </div>

                    {/* 分配负责人 */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h2 className="mb-4 text-lg font-medium text-gray-900">
                            分配负责人
                        </h2>
                        <div>
                            <label
                                htmlFor="assignedToId"
                                className="block text-sm font-medium text-gray-700"
                            >
                                负责员工
                            </label>
                            <select
                                id="assignedToId"
                                name="assignedToId"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">请选择负责人</option>
                                {employees.map((employee) => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.name} ({employee.role})
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500">
                                如果不选择，将自动分配给当前登录员工
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <Link
                            href="/dashboard/customers"
                            className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                        >
                            取消
                        </Link>
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                        >
                            创建客户
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}