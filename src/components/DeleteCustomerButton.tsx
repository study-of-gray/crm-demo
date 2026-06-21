"use client";

import { useRouter } from "next/navigation";

interface DeleteCustomerButtonProps {
    customerId: string;
}

export default function DeleteCustomerButton({
    customerId,
}: DeleteCustomerButtonProps) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("确定要删除这个客户吗？")) {
            return;
        }

        try {
            const res = await fetch(`/api/customers/${customerId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.push("/dashboard/customers");
            } else {
                alert("删除失败");
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
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
        >
            删除客户
        </button>
    );
}