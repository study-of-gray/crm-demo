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
    ChevronDown,
    Bell
} from "lucide-react";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session || session.user.type !== "employee") {
        redirect("/login");
    }

    const navigation = [
        {
            name: "仪表盘",
            href: "/dashboard",
            icon: LayoutDashboard,
            current: true,
        },
        {
            name: "客户管理",
            href: "/dashboard/customers",
            icon: Users,
            roles: ["ADMIN", "MANAGER", "STAFF"],
        },
        {
            name: "消息中心",
            href: "/dashboard/messages",
            icon: MessageSquare,
            roles: ["ADMIN", "MANAGER", "STAFF"],
        },
        {
            name: "文档管理",
            href: "/dashboard/documents",
            icon: FileText,
            roles: ["ADMIN", "MANAGER", "STAFF"],
        },
        {
            name: "工单管理",
            href: "/dashboard/tickets",
            icon: Ticket,
            roles: ["ADMIN", "MANAGER", "STAFF"],
        },
        {
            name: "员工管理",
            href: "/dashboard/employees",
            icon: UserCircle,
            roles: ["ADMIN", "MANAGER"],
        },
        {
            name: "系统设置",
            href: "/dashboard/settings",
            icon: Settings,
            roles: ["ADMIN"],
        },
    ];

    const filteredNavigation = navigation.filter(item =>
        !item.roles || item.roles.includes(session.user.role)
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 顶部导航栏 */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/dashboard" className="flex items-center">
                                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">C</span>
                                </div>
                                <span className="ml-3 text-xl font-bold text-gray-900 hidden md:block">
                                    CRM Pro
                                </span>
                            </Link>
                        </div>

                        {/* 搜索框 - 占位符，后续可扩展 */}
                        <div className="hidden md:block flex-1 max-w-md mx-8">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="搜索客户、工单、文档..."
                                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* 右侧工具栏 */}
                        <div className="flex items-center gap-4">
                            {/* 通知铃铛 */}
                            <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                            </button>

                            {/* 用户菜单 */}
                            <div className="relative group">
                                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 font-medium text-sm">
                                            {session.user.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {session.user.role === "ADMIN" ? "管理员" :
                                                session.user.role === "MANAGER" ? "经理" : "销售代表"}
                                        </p>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
                                </button>

                                {/* 下拉菜单 */}
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="py-1">
                                        <Link
                                            href="/dashboard/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            个人资料
                                        </Link>
                                        <Link
                                            href="/dashboard/settings"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            账户设置
                                        </Link>
                                        <hr className="my-1 border-gray-200" />
                                        <div className="px-4 py-2">
                                            <LogoutButton />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* 侧边栏 */}
                <aside className="hidden lg:block w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)] border-r border-gray-200 sticky top-16">
                    <nav className="p-4 space-y-1">
                        {filteredNavigation.map((item) => {
                            const Icon = item.icon;
                            // 简单判断当前路径，实际项目中可以使用 usePathname hook（客户端组件）
                            // 这里我们用服务器组件，通过 children 传递的路径来判断
                            const isCurrent = item.href === "/dashboard"; // 简化示例

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isCurrent
                                            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                >
                                    <Icon className={`h-5 w-5 ${isCurrent ? "text-blue-700" : "text-gray-400 group-hover:text-gray-500"}`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* 底部信息 */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                        <div className="rounded-lg bg-blue-50 p-3">
                            <p className="text-xs font-medium text-blue-900">CRM Pro v1.0</p>
                            <p className="text-xs text-blue-700 mt-1">企业级客户关系管理系统</p>
                        </div>
                    </div>
                </aside>

                {/* 主内容区 */}
                <main className="flex-1 p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}