import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createEmployee } from "@/services/user.service";
import { getCompanies } from "@/services/company.service";

export default async function NewEmployeePage() {
    const session = await auth();

    if (!session || session.user.type !== "employee") {
        redirect("/login");
    }

    // 只有 ADMIN 和 MANAGER 可以新增员工
    if (session.user.role !== "ADMIN" && session.user.role !== "MANAGER") {
        redirect("/dashboard");
    }

    const companies = await getCompanies();

    async function handleCreate(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const password = formData.get("password") as string;
        const role = formData.get("role") as "ADMIN" | "MANAGER" | "STAFF";
        const companyId = formData.get("companyId") as string;

        if (!name || !email || !password) {
            throw new Error("姓名、邮箱和密码不能为空");
        }

        try {
            await createEmployee(
                {
                    name,
                    email,
                    phone,
                    password,
                    role,
                    companyId,
                },
                session.user.id,
                session.user.role
            );

            redirect("/dashboard/employees");
        } catch (error: any) {
            if (error.digest && error.digest.startsWith("NEXT_REDIRECT")) {
                throw error;
            }

            console.error("创建员工失败:", error);
            throw new Error(error.message || "创建员工失败");
        }
    }

    return (
        <main className="min-h-screen bg-gray-50">
            {/* 顶部导航 */}
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/employees"
                            className="text-gray-600 hover:text-gray-900"
                        >
                            ← 返回员工列表
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">新增员工</h1>
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
                                    姓名 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="请输入员工姓名"
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
                                    placeholder="employee@company.com"
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
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    初始密码 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    required
                                    defaultValue="123456"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="请输入初始密码"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    默认密码：123456（员工可自行修改）
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="role"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    角色 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="STAFF">员工</option>
                                    <option value="MANAGER">经理</option>
                                    {session.user.role === "ADMIN" && (
                                        <option value="ADMIN">管理员</option>
                                    )}
                                </select>
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
                    </div>

                    {/* 提交按钮 */}
                    <div className="flex justify-end gap-4">
                        <Link
                            href="/dashboard/employees"
                            className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                        >
                            取消
                        </Link>
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                        >
                            创建员工
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}