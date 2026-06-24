import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAssignedCustomers } from "@/services/customer.service";
import { uploadDocument } from "@/actions/documents";

export default async function UploadDocumentPage() {
    const session = await auth();

    if (!session || session.user.type !== "employee") {
        redirect("/login");
    }

    const customers = await getAssignedCustomers(
        session.user.id,
        session.user.role
    );

    async function handleUpload(formData: FormData) {
        "use server";

        const customerId = formData.get("customerId") as string;
        const description = formData.get("description") as string;
        const file = formData.get("file") as File;

        if (!customerId || !file) {
            throw new Error("请选择客户和文件");
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB限制
            throw new Error("文件大小不能超过10MB");
        }

        try {
            const result = await uploadDocument(customerId, file, description);

            if (result.success) {
                redirect("/dashboard/documents");
            } else {
                throw new Error(result.message || "上传失败");
            }
        } catch (error: any) {
            console.error("上传文档失败:", error);
            throw new Error(error.message || "上传文档失败");
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
                                href="/dashboard/documents"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ← 返回文档列表
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">上传文档</h1>
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
                <form action={handleUpload} className="space-y-6">
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
                                客户 <span className="text-red-500">*</span>
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
                        </div>
                    </div>

                    {/* 上传文件 */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h2 className="mb-6 text-lg font-medium text-gray-900">
                            上传文档
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="file"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    选择文件 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    name="file"
                                    required
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip"
                                    className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    支持 PDF、Word、Excel、图片、压缩包等格式，最大 10MB
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    文档描述
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="请输入文档描述..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* 提交按钮 */}
                    <div className="flex justify-end gap-4">
                        <Link
                            href="/dashboard/documents"
                            className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                        >
                            取消
                    </div>
                    <button
                        type="submit"
                        className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                    >
                        上传文档
                    </button>
            </div>
        </form>
      </div >
    </main >
  );
}