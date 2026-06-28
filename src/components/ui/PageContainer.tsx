interface PageContainerProps {
    children: React.ReactNode;
    title: string;
    description?: string;
    actions?: React.ReactNode;
}

export default function PageContainer({
    children,
    title,
    description,
    actions,
}: PageContainerProps) {
    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    {description && (
                        <p className="mt-1 text-sm text-gray-600">{description}</p>
                    )}
                </div>
                {actions && <div className="flex gap-3">{actions}</div>}
            </div>

            {/* 页面内容 */}
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
}