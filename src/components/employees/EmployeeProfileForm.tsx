// components/employees/EmployeeProfileForm.tsx
"use client";

export default function EmployeeProfileForm({
    employee,
}: {
    employee: any;
}) {
    return (
        <div className="rounded-lg border bg-white p-6 space-y-4">
            <div>
                <p className="text-sm text-gray-500">姓名</p>
                <p className="text-lg font-medium">{employee.name}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">邮箱</p>
                <p className="text-lg">{employee.email}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">角色</p>
                <p className="text-lg">
                    {employee.role === "ADMIN"
                        ? "管理员"
                        : employee.role === "MANAGER"
                            ? "经理"
                            : "员工"}
                </p>
            </div>
        </div>
    );
}