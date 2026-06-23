"use client";

import { useRouter } from "next/navigation";

interface DeleteEmployeeButtonProps {
    employeeId: string;
    currentUserId: string;
}

export default function DeleteEmployeeButton({
    employeeId,
    currentUserId,
}: DeleteEmployeeButtonProps) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("确定要删除这个员工吗？")) {
            return;
        }

        try {
            const res = await fetch(`/api/employees/${employeeId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ currentUserId }),
            });

            if (res.ok) {
                router.refresh(); // 刷新页面
            } else {
                const data = await res.json();
                alert(data.error || "删除失败");
            }
        } catch (error) {
            console.error("删除失败:", error);
            alert("删除失败");
        }
    };

    return (
        <button
            type="button"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-900"
        >
            删除
        </button>
    );
}