"use client";

import React, { ReactNode } from "react";
import PortalSidebar from "./PortalSidebar";
import PortalHeader from "./PortalHeader";

interface PortalLayoutProps {
    user: any;
    children: ReactNode;
}

export default function PortalLayout({
    user,
    children,
}: PortalLayoutProps) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* ✅ 左侧导航（永远只这一个） */}
            <PortalSidebar user={user} />

            {/* ✅ 右侧内容区 */}
            <div className="flex flex-1 flex-col">
                {/* ✅ 顶部 Header（永远只这一个） */}
                <PortalHeader user={user} />

                {/* ✅ 页面内容（这里什么都不写，只放 children） */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}