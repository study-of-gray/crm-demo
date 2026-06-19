"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            alert("账号或密码错误");
            return;
        }

        router.push("/customers");
    };

    return (
        <main className="flex h-screen items-center justify-center">
            <form onSubmit={handleSubmit} className="space-y-4 w-80">
                <h1 className="text-xl font-bold">登录</h1>

                <input
                    className="border p-2 w-full"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="border p-2 w-full"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                    className="bg-black text-white w-full py-2 rounded"
                >
                    登录
                </button>
            </form>
        </main>
    );
}