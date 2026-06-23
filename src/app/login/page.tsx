"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

type LoginType = "employee" | "customer";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [type, setType] = useState<LoginType>("employee");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            type,
            redirect: false,
        });

        if (!res?.ok) {
            setError("账号或密码错误");
            setLoading(false);
            return;
        }

        // ✅ 根据身份跳转
        if (type === "employee") {
            router.push("/dashboard");
        } else {
            router.push("/portal");
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 rounded-lg bg-white p-8 shadow-md">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">登录系统</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        请选择您的身份并登录
                    </p>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        登录身份
                    </label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as LoginType)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="employee">员工 / 管理员</option>
                        <option value="customer">客户</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        邮箱地址
                    </label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        密码
                    </label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                {error && (
                    <div className="rounded-md bg-red-50 p-3">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {loading ? "登录中..." : "登录"}
                </button>
                <p className="text-center text-xs text-gray-500">
                    {type === "employee"
                        ? "员工请联系管理员获取账号"
                        : "客户请联系对接销售开通账号"}
                </p>
            </form>
        </main>
    );
}