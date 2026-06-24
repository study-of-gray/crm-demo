"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentCustomerProfile } from "@/actions/get-current-customer";

export default function ProfilePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        description: "",
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const profile = await getCurrentCustomerProfile();

            if (!profile) {
                router.push("/login");
                return;
            }

            setFormData({
                name: profile.name || "",
                phone: profile.phone || "",
                description: profile.description || "",
            });
        } catch (err) {
            console.error("获取资料失败:", err);
            setError("获取资料失败");
        } finally {
            setLoading(false);
        }
    };

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
            const res = await fetch("/api/portal/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setMessage("资料更新成功");
            } else {
                setError("更新失败");
            }
        } catch (err) {
            setError("更新失败");
        }

        setLoading(false);
    };

    if (loading) {
        return <div className="p-8">加载中...</div>;
    }

    return (
        <main className="max-w-2xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">个人资料</h1>

            {message && <div className="mb-4 text-green-600">{message}</div>}
            {error && <div className="mb-4 text-red-600">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="姓名"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                />

                <input
                    type="tel"
                    placeholder="电话"
                    value={formData.phone}
                    onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                />

                <textarea
                    placeholder="简介"
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {loading ? "保存中..." : "保存"}
                </button>
            </form>
        </main>
    );
}