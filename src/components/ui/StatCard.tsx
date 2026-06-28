import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: "blue" | "green" | "yellow" | "purple" | "red";
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export default function StatCard({
    title,
    value,
    icon: Icon,
    color,
    trend,
}: StatCardProps) {
    const colorClasses = {
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        yellow: "bg-yellow-100 text-yellow-600",
        purple: "bg-purple-100 text-purple-600",
        red: "bg-red-100 text-red-600",
    };

    return (
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <p className={`mt-2 text-sm ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}% 较上月
                        </p>
                    )}
                </div>
                <div className={`rounded-xl p-3 ${colorClasses[color]}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}