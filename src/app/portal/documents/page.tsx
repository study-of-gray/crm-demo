"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCustomerDocuments } from "@/actions/documents";

export default function DocumentsPage() {
    const router = useRouter();
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            const docs = await getCustomerDocuments();
            setDocuments(docs);
        } catch (error) {
            console.error("加载文档失败:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.includes("pdf")) return "📄";
        if (mimeType.includes("word") || mimeType.includes("doc")) return "📝";
        if (mimeType.includes("excel") || mimeType.includes("sheet")) return "📊";
        if (mimeType.includes("image")) return "🖼️";
        if (mimeType.includes("zip")) return "🗜️";
        return "📎";
    };

    const handleDownload = (filePath: string, fileName: string) => {
        const link = document.createElement("a");
        link.href = filePath;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">加载中...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            {/* 顶部导航 */}
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ← 返回
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">我的文档</h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    下载合同、报价单等重要文档
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/portal"
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                        >
                            客户门户
                        </Link>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {documents.length === 0 ? (
                    <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">暂无文档</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            您的销售代表会上传相关文档到这里
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{getFileIcon(doc.mimeType)}</span>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                                {doc.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {doc.fileName}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>大小</span>
                                        <span>{formatFileSize(doc.fileSize)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>上传者</span>
                                        <span>{doc.uploadedBy.name}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>上传时间</span>
                                        <span>{formatDate(doc.uploadedAt)}</span>
                                    </div>
                                </div>

                                {doc.description && (
                                    <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                                        {doc.description}
                                    </p>
                                )}

                                <button
                                    onClick={() => handleDownload(doc.filePath, doc.fileName)}
                                    className="w-full rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                                >
                                    下载文档
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}