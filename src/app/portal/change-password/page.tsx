import Link from "next/link";
import PortalLayout from "@/components/ui/layouts/PortalLayout";
import PageContainer from "@/components/ui/PageContainer";
import { changeCustomerPassword } from "@/actions/customer-profile";
import { redirect } from "next/navigation";
import { Key, Lock, CheckCircle, AlertTriangle } from "lucide-react";

export default async function ChangePasswordPage() {
    async function handleChangePassword(formData: FormData) {
        "use server";

        const currentPassword = formData.get("currentPassword") as string;
        const newPassword = formData.get("newPassword") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (!currentPassword || !newPassword || !confirmPassword) {
            throw new Error("请填写所有字段");
        }

        if (newPassword !== confirmPassword) {
            throw new Error("两次输入的新密码不一致");
        }

        if (newPassword.length < 6) {
            throw new Error("新密码长度至少为6位");
        }

        const result = await changeCustomerPassword(currentPassword, newPassword);

        if (!result.success) {
            throw new Error(result.message);
        }

        redirect("/portal/profile?passwordChanged=true");
    }

    return (
        <PortalLayout>
            <PageContainer
                title="修改密码"
                description="定期更换密码以确保账户安全"
            >
                <div className="max-w-2xl mx-auto">
                    <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Key className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">修改密码</h2>
                                    <p className="text-sm text-gray-600 mt-1">建议定期更换密码以确保账户安全</p>
                                </div>
                            </div>
                        </div>

                        <form action={handleChangePassword} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Lock className="h-4 w-4 inline mr-2" />
                                    当前密码 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    required
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="请输入当前密码"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Key className="h-4 w-4 inline mr-2" />
                                    新密码 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    required
                                    minLength={6}
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="请输入新密码（至少6位）"
                                />
                                <p className="mt-1 text-xs text-gray-500">密码长度至少为6位字符</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <CheckCircle className="h-4 w-4 inline mr-2" />
                                    确认新密码 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    minLength={6}
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="请再次输入新密码"
                                />
                            </div>

                            {/* 密码安全提示 */}
                            <div className="rounded-lg bg-blue-50 p-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <h3 className="text-sm font-medium text-blue-900">密码安全提示</h3>
                                        <ul className="mt-2 text-sm text-blue-700 space-y-1">
                                            <li>• 使用至少8个字符的组合</li>
                                            <li>• 包含大小写字母、数字和特殊符号</li>
                                            <li>• 避免使用生日、姓名等容易被猜到的信息</li>
                                            <li>• 不要与其他网站使用相同的密码</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                                <Link
                                    href="/portal/profile"
                                    className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                                >
                                    取消
                                </Link>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                                >
                                    <Key className="h-4 w-4" />
                                    确认修改
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </PageContainer>
        </PortalLayout>
    );
}