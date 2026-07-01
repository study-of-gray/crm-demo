"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    User,
    FileText,
    MessageSquare,
    Ticket,
} from "lucide-react";

const navItems = [
    { href: "/portal", label: "门户首页", icon: Home },
    { href: "/portal/profile", label: "个人资料", icon: User },
    { href: "/portal/documents", label: "我的文档", icon: FileText },
    { href: "/portal/messages", label: "消息中心", icon: MessageSquare },
    { href: "/portal/tickets", label: "我的工单", icon: Ticket },
];

export default function PortalSidebar({ user }: { user: any }) {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex w-64 flex-col border-r bg-white">
            {/* ✅ 不要写“客户门户”标题 */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${active
                                    ? "bg-blue-50 text-blue-700 font-medium"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t text-xs text-gray-500">
                欢迎，{user?.name}
            </div>
        </aside>
    );
}