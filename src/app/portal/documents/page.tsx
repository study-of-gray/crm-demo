import PageContainer from "@/components/ui/PageContainer";
import { getCustomerDocuments } from "@/actions/documents";
import { formatDate, formatFileSize } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import { FileText, Download, Eye, Search, Filter } from "lucide-react";

export default async function DocumentsPage() {
    const documents = await getCustomerDocuments();

    const getFileIcon = (mimeType: string) => {
        if (mimeType.includes("pdf")) return "📄";
        if (mimeType.includes("word") || mimeType.includes("doc")) return "📝";
        if (mimeType.includes("excel") || mimeType.includes("sheet")) return "📊";
        if (mimeType.includes("image")) return "🖼️";
        if (mimeType.includes("zip") || mimeType.includes("compressed")) return "🗜️";
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

    return (
        <PageContainer
            title="我的文档"
            description="下载合同、报价单等重要文档"
            actions={
                <div className="flex gap-3">
                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                        <Filter className="h-4 w-4" />
                        筛选
                    </button>
                </div>
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
                    description="您的销售代表会上传相关文档到这里，请稍后再查看。"
                    action={{ label: "刷新页面", href: "/portal/documents" }}
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
                                <button
                                    onClick={() => handleDownload(doc.filePath, doc.fileName)}
                                    className="flex-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors text-center"
                                >
                                    <Download className="h-3 w-3 inline mr-1" />
                                    下载
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 文档说明 */}
            <div className="mt-8 rounded-xl bg-blue-50 p-6">
                <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-blue-900">关于文档下载</h3>
                        <ul className="mt-2 text-sm text-blue-700 space-y-1">
                            <li>• 所有文档均为PDF格式，请确保您的设备已安装PDF阅读器</li>
                            <li>• 下载的文档仅供您个人使用，请勿转发给他人</li>
                            <li>• 如遇文档无法打开或内容错误，请及时联系您的销售代表</li>
                            <li>• 文档会定期更新，请留意最新版本</li>
                        </ul>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}