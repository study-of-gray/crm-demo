"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function PortalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[Portal Error]", error);
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold text-gray-900">出错了</h2>
                <p className="mt-2 text-gray-600">
                    客户门户加载失败，请稍后重试
                </p>
                <Button onClick={() => reset()} className="mt-6">
                    重新加载
                </Button>
            </div>
        </div>
    );
}