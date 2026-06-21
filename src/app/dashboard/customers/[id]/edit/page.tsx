import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCustomerByIdForEmployee } from "@/services/customer.service";
import { updateCustomer } from "@/services/customer.service";

export default async function EditCustomerPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    const { id } = await params;

    if (!session || session.user.type !== "employee") {
        redirect("/login");
    }

    const customer = await getCustomerByIdForEmployee(
        id,
        session.user.id,
        session.user.role
    );

    if (!customer) {
        redirect("/dashboard/customers");
    }

    // 检查编辑权限
    const canEdit =
        session.user.role === "ADMIN" ||
        session.user.role === "MANAGER" ||
        customer.assignedStaff.some(
            (assignment) => assignment.userId === session.user.id
        );

    if (!canEdit) {
        redirect(`/dashboard/customers/${id}`);
    }

    async function handleUpdate(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const description = formData.get("description") as string;

        await updateCustomer(
            id,
            {
                name,
                email,
                phone,
                description,
            },
            session.user.id,
            session.user.role
        );

        redirect(`/dashboard/customers/${id}`);
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/dashboard/customers/${id}`}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            ← 返回客户详情
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">编辑客户</h1>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                <form action={handleUpdate} className="space-y-6">
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h2 className="mb-6 text-lg font-medium text-gray-900">
                            基本信息
                        </h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    客户名称
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={customer.name}
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    邮箱
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={customer.email}
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    电话
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    defaultValue={customer.phone}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">
                                客户备注
                            </label>
                            <textarea
                                name="description"
                                rows={4}
                                defaultValue={customer.description || ""}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="请输入客户备注信息..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link
                            href={`/dashboard/customers/${id}`}
                            className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                        >
                            取消
                        </Link>
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                        >
                            保存更改
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}