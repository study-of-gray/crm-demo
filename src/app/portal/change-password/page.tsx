"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { changeCustomerPassword } from "@/actions/change-password";

export default function ChangePasswordPage() {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("所有字段不能为空");
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("两次密码不一致");
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError("新密码至少 6 位");
            setLoading(false);
            return;
        }

        const session = await fetch("/api/auth/session").then(r => r.json());

        const result = await changeCustomerPassword(
            session.user.email,
            currentPassword,
            newPassword
        );

        if (result.success) {
            setMessage(result.message);
            setTimeout(() => router.push("/portal"), 1200);
        } else {
            setError(result.message || "修改失败");
        }

        setLoading(false);
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 rounded-lg bg-white p-8 shadow-md">
                <h1 className="text-2xl font-bold text-center">修改密码</h1>

                {error && <div className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</div>}
                {message && <div className="rounded bg-green-50 p-3 text-sm text-green-700">{message}</div>}

                <div className="space-y-4">
                    <input
                        type="password"
                        placeholder="当前密码"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full rounded border px-3 py-2"
                    />
                    <input
                        type="password"
                        placeholder="新密码"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded border px-3 py-2"
                    />
                    <input
                        type="password"
                        placeholder="确认新密码"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded border px-3 py-2"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded bg-blue-600 py-2 text-white disabled:opacity-50"
                >
                    {loading ? "提交中..." : "修改密码"}
                </button>
            </form>
        </main>
    );
}