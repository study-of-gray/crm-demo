import Link from "next/link";
import PageContainer from "@/components/ui/PageContainer";
import { getCustomerProfile, updateCustomerProfile } from "@/actions/customer-profile";
import { redirect } from "next/navigation";
import { User, Mail, Phone, Building, Save } from "lucide-react";

export default async function ProfilePage() {
    const profile = await getCustomerProfile();

    if (!profile) {
        redirect("/login");
    }

    async function handleUpdateProfile(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;
        const description = formData.get("description") as string;

        if (!name?.trim()) {
            throw new Error("姓名不能为空");
        }

        await updateCustomerProfile(profile.email, {
            name,
            phone,
            description,
        });

        redirect("/portal/profile");
    }

    return (
        <PageContainer
            title="个人资料"
            description="查看和更新您的个人信息"
            actions={
                <button
                    form="profile-form"
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                >
                    <Save className="h-4 w-4" />
                    保存更改
                </button>
            }
        >
            <form id="profile-form" action={handleUpdateProfile}>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* 基本信息 */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">基本信息</h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <User className="h-4 w-4 inline mr-2" />
                                            姓名 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            defaultValue={profile.name}
                                            required
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="请输入您的姓名"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Mail className="h-4 w-4 inline mr-2" />
                                            邮箱
                                        </label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            disabled
                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">邮箱是登录凭证，无法修改</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Phone className="h-4 w-4 inline mr-2" />
                                            电话
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            defaultValue={profile.phone || ""}
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="请输入您的电话号码"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Building className="h-4 w-4 inline mr-2" />
                                            所属公司
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.companyCustomers?.[0]?.company?.name || "未分配"}
                                            disabled
                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        个人简介
                                    </label>
                                    <textarea
                                        name="description"
                                        rows={4}
                                        defaultValue={profile.description || ""}
                                        className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="请简要介绍一下您自己..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 账户信息 */}
                    <div>
                        <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">账户信息</h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">账户状态</p>
                                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                                        正常
                                    </span>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">注册时间</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(profile.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">客户编号</p>
                                    <p className="text-sm text-gray-600 font-mono">
                                        #{profile.id.slice(-8).toUpperCase()}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <Link
                                        href="/portal/change-password"
                                        className="flex items-center justify-center gap-2 w-full rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                                    >
                                        <Save className="h-4 w-4" />
                                        修改密码
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </PageContainer>
    );
}