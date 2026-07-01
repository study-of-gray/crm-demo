"use client"; // ✅ 关键

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { ChevronDown, Bell } from "lucide-react";

export default function UserMenu({ user }: { user: any }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // ✅ 点击外部关闭
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div className="flex items-center gap-4">
            {/* 通知 */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* 用户菜单 */}
            <div className="relative" ref={ref}>
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                >
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                            {user.name?.charAt(0)}
                        </span>
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">
                            {user.role === "ADMIN"
                                ? "管理员"
                                : user.role === "MANAGER"
                                    ? "经理"
                                    : "销售代表"}
                        </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {/* ✅ 受控渲染，不是 CSS hover */}
                {open && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                        <Link
                            href="/dashboard/profile"
                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                            个人资料
                        </Link>
                        <Link
                            href="/dashboard/settings"
                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                            账户设置
                        </Link>
                        <div className="px-4 py-2">
                            <LogoutButton />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}