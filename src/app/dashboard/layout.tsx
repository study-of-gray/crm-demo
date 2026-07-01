export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
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
import UserMenu from "@/components/ui/layouts/UserMenu";

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
                            <UserMenu user={session.user} />
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