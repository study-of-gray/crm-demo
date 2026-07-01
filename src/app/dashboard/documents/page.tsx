import PageContainer from "@/components/ui/PageContainer";
import { getDocuments } from "@/actions/documents";
import { formatDate, formatFileSize } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import { FileText, Plus, Search, Download, Eye } from "lucide-react";
import Link from "next/link";

export default async function DocumentsPage() {
    const documents = await getDocuments();

    return (
        <PageContainer
            title="文档管理"
            description="管理客户文档和资料"
            actions={
                <Link
                    href="/dashboard/documents/upload"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    上传文档
                </Link>
            }
        >
            {/* 搜索栏 */}
            <div className="mb-6 rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="搜索文档名称或描述..."
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            {documents.length === 0 ? (
                <EmptyState
                    icon={FileText}
                    title="暂无文档"
                    description="您还没有上传任何文档，点击上方按钮上传文档。"
                    action={{ label: "上传文档", href: "/dashboard/documents/upload" }}
                />
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="rounded-xl bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <FileText className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{doc.name}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{doc.fileName}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>大小</span>
                                    <span>{formatFileSize(doc.fileSize)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>客户</span>
                                    <span>{doc.customer?.name || "未知"}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>上传时间</span>
                                    <span>{formatDate(doc.uploadedAt)}</span>
                                </div>
                            </div>

                            {doc.description && (
                                <p className="text-xs text-gray-600 mb-4 line-clamp-2">{doc.description}</p>
                            )}

                            <div className="flex gap-2">
                                <a
                                    href={doc.filePath}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors text-center"
                                >
                                    <Eye className="h-3 w-3 inline mr-1" />
                                    预览
                                </a>
                                <a
                                    href={doc.filePath}
                                    download={doc.fileName}
                                    className="flex-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors text-center"
                                >
                                    <Download className="h-3 w-3 inline mr-1" />
                                    下载
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageContainer>
    );
}