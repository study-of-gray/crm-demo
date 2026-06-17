import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteCustomer } from "@/actions/customer";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function CustomerDetailPage({ params }: Props) {
    const { id } = await params;

    const customer = await prisma.customer.findUnique({
        where: { id },
        include: {
            company: true,
        },
    });

    if (!customer) {
        notFound();
    }

    return (
        <main className="p-6 max-w-xl space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">客户详情</h1>
                <Button variant="outline">
                    <Link href="/customers">返回列表</Link>
                </Button>
            </div>

            <section className="space-y-4 rounded-lg border p-4">
                <div>
                    <div className="text-sm text-muted-foreground">姓名</div>
                    <div className="text-lg font-medium">{customer.name}</div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">公司</div>
                    <div>{customer.company?.name ?? "-"}</div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">邮箱</div>
                    <div>{customer.email ?? "-"}</div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">电话</div>
                    <div>{customer.phone ?? "-"}</div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">创建时间</div>
                    <div>
                        {new Date(customer.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </section>

            <div className="flex gap-2">
                <Button variant="outline">
                    <Link href={`/customers/${customer.id}/edit`}>编辑</Link>
                </Button>

                <form action={deleteCustomer.bind(null, customer.id)}>
                    <Button type="submit" variant="destructive">
                        删除
                    </Button>
                </form>
            </div>
        </main>
    );
}