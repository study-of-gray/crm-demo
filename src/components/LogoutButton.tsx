"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    return (
        <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
            <LogOut className="h-4 w-4" />
            退出登录
        </button>
    );
}