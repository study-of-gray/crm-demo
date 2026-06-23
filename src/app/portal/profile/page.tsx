"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getCustomerProfile, updateCustomerProfile } from "@/actions/change-password";

export default function ProfilePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");

    // 获取客户资料
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const session = await fetch("/api/auth/session").then(res => res.json());
                if (!session?.user?.email) {
                    router.push("/login");
                    return;
                }

                setEmail(session.user.email);
                const profile = await getCustomerProfile(session.user.email);

                if (profile) {
                    setFormData({
                        name: profile.name || "",
                        phone: profile.phone || "",
                        description: profile.description || "",
                    });
                }
            } catch (err) {
                console.error("获取资料失败:", err);
                setError("获取资料失败");
            }
        };

        fetchProfile();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        if (!formData.name.trim()) {
            setError("姓名不能为空");
            setLoading(false);
            return;
        }

        try {
            const result = await updateCustomerProfile(email, formData);

            if (result.success) {
                setMessage("资料更新成功");
                router.push("/portal");
            } else {
                setError(result.message || "更新失败");
            }
        } catch (err) {
            console.error("更新资料失败:", err);
            setError("更新资料失败");
        }

        setLoading(false);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <main className="min-h-screen bg-gray-50">
            {/* 顶部导航 */}
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ← 返回
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">个人资料</h1>
                        </div>
                        <Link
                            href="/portal"
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                        >
                            客户门户
                        </Link>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 基本信息 */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h2 className="mb-6 text-lg font-medium text-gray-900">
                            基本信息
                        </h2>

                        {/* 成功/错误提示 */}
                        {message && (
                            <div className="mb-4 rounded-md bg-green-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-800">{message}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mb-4 rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-red-800">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    姓名 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="请输入您的姓名"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    邮箱
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 cursor-not-allowed"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    邮箱是登录凭证，无法修改
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    电话
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="请输入您的电话号码"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">
                                个人简介
                            </label>
                            <textarea
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="请简要介绍一下您自己..."
                            />
                        </div>
                    </div>

                    {/* 账户信息 */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h2 className="mb-4 text-lg font-medium text-gray-900">
                            账户信息
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        账户状态
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        您的账户处于正常使用状态
                                    </p>
                                </div>
                                <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold text-green-800">
                                    正常
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        登录密码
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        建议定期更换密码以确保账户安全
                                    </p>
                                </div>
                                <Link
                                    href="/portal/change-password"
                                    className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                                >
                                    修改密码
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* 提交按钮 */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                        >
                            {loading ? "保存中..." : "保存更改"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}