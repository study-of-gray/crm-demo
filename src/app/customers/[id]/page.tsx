import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteCustomer, getCustomerById } from "@/actions/customer";

type Props = {
    params: { id: string };
};

export default async function CustomerDetailPage({ params }: Props) {
    const { id } = await params;

    const data = await getCustomerById(id);

    if (!data) notFound();

    const { name, email, phone, password, role, companyId, createdAt } = data;

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
                    <div className="text-lg font-medium">{name}</div>
                </div>
                <div>
                    <div className="text-sm text-muted-foreground">邮箱</div>
                    <div>{email}</div>
                </div>
                <div>
                    <div className="text-sm text-muted-foreground">电话</div>
                    <div>{phone ?? "-"}</div>
                </div>
                <div>
                    <div className="text-sm text-muted-foreground">公司</div>
                    <div>{companyId ?? "-"}</div>
                </div>
                <div>
                    <div className="text-sm text-muted-foreground">创建时间</div>
                    <div>
                        {new Date(createdAt).toLocaleDateString()}
                    </div>
                </div>
            </section>
            <div className="flex gap-2">
                <Button>
                    <Link href={`/customers/${id}/edit`}>编辑</Link>
                </Button>

                <form action={deleteCustomer.bind(null, id)}>
                    <Button type="submit" variant="destructive">
                        删除
                    </Button>
                </form>
            </div>
        </main>
    );
}