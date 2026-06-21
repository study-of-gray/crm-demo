import { prisma } from "@/lib/prisma";
import { updateCustomer } from "@/actions/customer";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function EditCustomerPage({ params }: Props) {
    const { id } = await params;

    const customer = await prisma.customer.findUnique({
        where: { id },
        // include: { company: true },
    });

    if (!customer) notFound();

    return (
        <main className="p-6 max-w-xl space-y-6">
            <h1 className="text-xl font-bold">编辑客户</h1>

            <form action={updateCustomer.bind(null, customer.id)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">姓名</label>
                    <input
                        name="name"
                        defaultValue={customer.name}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">邮箱</label>
                    <input
                        name="email"
                        defaultValue={customer.email ?? ""}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">电话</label>
                    <input
                        name="phone"
                        defaultValue={customer.phone ?? ""}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">公司 ID</label>
                    <input
                        name="companyId"
                        defaultValue={customer.companyId ?? ""}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded"
                >
                    保存
                </button>
            </form>
        </main>
    );
}