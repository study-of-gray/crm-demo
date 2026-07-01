export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import {
    LayoutDashboard,
    Users,
    UserCircle,
    MessageSquare,
    FileText,
    Ticket,
    Settings,
    Bell,
    ChevronDown,
} from "lucide-react";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // ✅ 必须 await
    const session = await auth();

    if (!session || session.user.type !== "employee") {
        redirect("/login");
    }

    const navigation = [
        { name: "仪表盘", href: "/dashboard", icon: LayoutDashboard },
        { name: "客户管理", href: "/dashboard/customers", icon: Users, roles: ["ADMIN", "MANAGER", "STAFF"] },
        { name: "消息中心", href: "/dashboard/messages", icon: MessageSquare, roles: ["ADMIN", "MANAGER", "STAFF"] },
        { name: "文档管理", href: "/dashboard/documents", icon: FileText, roles: ["ADMIN", "MANAGER", "STAFF"] },
        { name: "工单管理", href: "/dashboard/tickets", icon: Ticket, roles: ["ADMIN", "MANAGER", "STAFF"] },
        { name: "员工管理", href: "/dashboard/employees", icon: UserCircle, roles: ["ADMIN", "MANAGER"] },
        { name: "系统设置", href: "/dashboard/settings", icon: Settings, roles: ["ADMIN"] },
    ];

    const filteredNavigation = navigation.filter(
        (item) => !item.roles || item.roles.includes(session.user.role)
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-40">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">C</span>
                            </div>
                            <span className="hidden md:block text-xl font-bold text-gray-900">
                                CRM Pro
                            </span>
                        </Link>

                        {/* Search */}
                        <div className="hidden md:block flex-1 max-w-md mx-8">
                            <input
                                placeholder="搜索客户、工单、文档..."
                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1"
                            />
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                            </button>

                            <div className="relative group">
                                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 font-medium text-sm">
                                            {session.user.name?.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium">{session.user.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {session.user.role === "ADMIN"
                                                ? "管理员"
                                                : session.user.role === "MANAGER"
                                                    ? "经理"
                                                    : "销售代表"}
                                        </p>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
                                </button>

                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-50">
                                    <Link href="/dashboard/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                                        个人资料
                                    </Link>
                                    <Link href="/dashboard/settings" className="block px-4 py-2 text-sm hover:bg-gray-100">
                                        账户设置
                                    </Link>
                                    <div className="px-4 py-2">
                                        <LogoutButton />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="hidden lg:block w-64 bg-white border-r sticky top-16 h-[calc(100vh-4rem)]">
                    <nav className="p-4 space-y-1">
                        {filteredNavigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    <Icon className="h-5 w-5 text-gray-400" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                        <div className="rounded-lg bg-blue-50 p-3 text-xs">
                            <p className="font-medium text-blue-900">CRM Pro v1.0</p>
                            <p className="text-blue-700">企业级客户关系管理系统</p>
                        </div>
                    </div>
                </aside>

                {/* Main */}
                <main className="flex-1 p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}