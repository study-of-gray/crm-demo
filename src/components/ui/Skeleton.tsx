export function SkeletonCard() {
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200 animate-pulse">
            <div className="flex items-center justify-between">
                <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-20 mt-2"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
            </div>
        </div>
    );
}

export function SkeletonTable() {
    return (
        <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
            <div className="divide-y divide-gray-200">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-6 animate-pulse">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                                <div>
                                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-48"></div>
                                </div>
                            </div>
                            <div className="h-8 bg-gray-200 rounded w-20"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}