"use client"; // ✅ 明确是 Client Component

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import {
    User,
    Key,
    FileText,
    MessageSquare,
    Ticket,
    Home,
    ChevronDown,
    Bell,
    HelpCircle,
} from "lucide-react";

interface PortalLayoutProps {
    children: React.ReactNode;
    customerName?: string; // ✅ 从页面传进来
}

export default function PortalLayout({
    children,
    customerName = "客户",
}: PortalLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* 顶部导航栏 */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/portal" className="flex items-center">
                                <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">P</span>
                                </div>
                                <span className="ml-3 text-xl font-bold text-gray-900 hidden md:block">
                                    客户门户
                                </span>
                            </Link>
                        </div>

                        {/* 导航链接 */}
                        <nav className="hidden md:flex items-center space-x-1">
                            <NavLink href="/portal" icon={Home}>首页</NavLink>
                            <NavLink href="/portal/profile" icon={User}>个人资料</NavLink>
                            <NavLink href="/portal/documents" icon={FileText}>我的文档</NavLink>
                            <NavLink href="/portal/messages" icon={MessageSquare}>消息</NavLink>
                            <NavLink href="/portal/tickets" icon={Ticket}>我的工单</NavLink>
                        </nav>

                        {/* 用户菜单 */}
                        <UserMenu customerName={customerName} />
                    </div>
                </div>
            </header>

            {/* 页面内容 */}
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}

/* ===================== 子组件 ===================== */

function NavLink({
    href,
    icon: Icon,
    children,
}: {
    href: string;
    icon: React.ElementType;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
            <Icon className="h-4 w-4" />
            {children}
        </Link>
    );
}

function UserMenu({ customerName }: { customerName: string }) {
    return (
        <div className="relative group">
            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-medium text-sm">
                        {customerName.charAt(0)}
                    </span>
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-900">
                    {customerName}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
            </button>

            {/* 下拉菜单 */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="py-1">
                    <Link href="/portal/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        个人资料
                    </Link>
                    <Link href="/portal/change-password" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        修改密码
                    </Link>
                    <hr className="my-1 border-gray-200" />
                    <div className="px-4 py-2">
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </div>
    );
}