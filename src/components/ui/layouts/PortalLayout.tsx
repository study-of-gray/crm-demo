import { auth } from "@/auth";
import { redirect } from "next/navigation";
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
    HelpCircle
} from "lucide-react";

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session || session.user.type !== "customer") {
        redirect("/login");
    }

    const navigation = [
        { name: "门户首页", href: "/portal", icon: Home },
        { name: "个人资料", href: "/portal/profile", icon: User },
        { name: "修改密码", href: "/portal/change-password", icon: Key },
        { name: "我的文档", href: "/portal/documents", icon: FileText },
        { name: "消息中心", href: "/portal/messages", icon: MessageSquare },
        { name: "我的工单", href: "/portal/tickets", icon: Ticket },
        { name: "帮助中心", href: "/portal/help", icon: HelpCircle },
    ];

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

                        {/* 导航链接 - 桌面端 */}
                        <nav className="hidden md:flex items-center space-x-1">
                            {navigation.slice(0, 5).map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* 右侧用户菜单 */}
                        <div className="flex items-center gap-4">
                            {/* 通知铃铛 */}
                            <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                            </button>

                            {/* 用户菜单 */}
                            <div className="relative group">
                                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <span className="text-green-600 font-medium text-sm">
                                            {session.user.name?.charAt(0) || "客"}
                                        </span>
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                                        <p className="text-xs text-gray-500">客户</p>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
                                </button>

                                {/* 下拉菜单 */}
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="py-1">
                                        <Link
                                            href="/portal/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            个人资料
                                        </Link>
                                        <Link
                                            href="/portal/help"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            帮助中心
                                        </Link>
                                        <hr className="my-1 border-gray-200" />
                                        <div className="px-4 py-2">
                                            <LogoutButton />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 移动端菜单按钮 */}
                            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* 移动端导航菜单 */}
                    <div className="md:hidden border-t border-gray-200 py-2">
                        <div className="flex space-x-1 overflow-x-auto">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 min-w-max"
                                    >
                                        <Icon className="h-5 w-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </header>

            {/* 主内容区 */}
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    {children}
                </div>
            </main>

            {/* 底部信息 */}
            <footer className="bg-white border-t border-gray-200 py-4">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-500">
                            © 2024 CRM Pro. 保留所有权利.
                        </p>
                        <div className="flex space-x-4 mt-2 md:mt-0">
                            <Link href="/portal/help" className="text-sm text-gray-500 hover:text-gray-700">
                                帮助中心
                            </Link>
                            <Link href="/portal/contact" className="text-sm text-gray-500 hover:text-gray-700">
                                联系我们
                            </Link>
                            <Link href="/portal/privacy" className="text-sm text-gray-500 hover:text-gray-700">
                                隐私政策
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}