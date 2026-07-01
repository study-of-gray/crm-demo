"use client";

import { User, LogOut, Bell } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export default function PortalHeader({ user }: { user: any }) {
    return (
        <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
            <div className="mx-auto flex h-16 items-center justify-between px-6">
                {/* ✅ 这里只写一次“客户门户” */}
                <span className="text-xl font-bold text-gray-900">客户门户</span>

                <div className="flex items-center gap-4">
                    <Bell className="h-5 w-5 text-gray-400" />
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-gray-500" />
                        <span className="text-sm text-gray-700">{user?.name}</span>
                    </div>
                    <LogoutButton>
                        <LogOut className="h-4 w-4" />
                    </LogoutButton>
                </div>
            </div>
        </header>
    );
}