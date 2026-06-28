import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        href: string;
    };
}

export default function EmptyState({
    icon: Icon,
    title,
    description,
    action,
}: EmptyStateProps) {
    return (
        <div className="text-center py-12">
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Icon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">{description}</p>
            {action && (
                <div className="mt-6">
                    <Link
                        href={action.href}
                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                    >
                        {action.label}
                    </Link>
                </div>
            )}
        </div>
    );
}