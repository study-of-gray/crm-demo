"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LoginType = "employee" | "customer";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [type, setType] = useState<LoginType>("employee"); // ✅ 默认员工
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log("---------------------------------email, password, type`", email, password, type);

            const res = await signIn("credentials", {
                email,
                password,
                type, // ✅ 关键：传递身份类型
                redirect: false,
            });
            console.log("---------------------------------登录响应：", res);
            if (!res?.ok || res?.error) {
                alert(res?.error || "账号或密码错误");
                setLoading(false);

                return null;
            }

            // ✅ 根据身份跳转到不同页面
            if (type === "employee") {
                router.push("/dashboard"); // 员工后台
            } else {
                router.push("/portal"); // 客户门户
            }
        } catch (error) {
            alert("登录失败，请稍后重试");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm space-y-6 rounded-lg bg-white p-8 shadow-md"
            >
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">登录系统</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        请选择您的身份并登录
                    </p>
                </div>

                {/* ✅ 身份选择 */}
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

                {/* ✅ 邮箱 */}
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

                {/* ✅ 密码 */}
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

                {/* ✅ 提交按钮 */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {loading ? "登录中..." : "登录"}
                </button>

                {/* ✅ 提示文字 */}
                <p className="text-center text-xs text-gray-500">
                    {type === "employee"
                        ? "员工请联系管理员获取账号"
                        : "客户请联系对接销售开通账号"}
                </p>
            </form>
        </main>
    );
}