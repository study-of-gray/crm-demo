import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCustomer } from "@/actions/customer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CustomersPage() {
    const customers = await prisma.customer.findMany({
        // where: {
        //     company: null,
        // },
        // include: {
        //     user: true,
        // },
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">客户管理</h1>
                <Dialog>
                    <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                        新增客户
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>新增客户</DialogTitle>
                        </DialogHeader>
                        <form action={createCustomer} className="space-y-4 mt-4">
                            <div>
                                <Label htmlFor="name">姓名</Label>
                                <Input id="name" name="name" required />
                            </div>
                            <div>
                                <Label htmlFor="company">公司</Label>
                                <Input id="company" name="company" />
                            </div>
                            <div>
                                <Label htmlFor="email">邮箱</Label>
                                <Input id="email" name="email" type="email" />
                            </div>
                            <div>
                                <Label htmlFor="phone">电话</Label>
                                <Input id="phone" name="phone" />
                            </div>
                            <Button type="submit" className="w-full">
                                保存
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>客户列表</CardTitle>
                </CardHeader>
                <CardContent>
                    {customers.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12">
                            暂无客户数据
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>姓名</TableHead>
                                    <TableHead>公司</TableHead>
                                    <TableHead>邮箱</TableHead>
                                    <TableHead>电话</TableHead>
                                    <TableHead>创建时间</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customers.map((c) => (
                                    <TableRow key={c.id} className="hover:bg-muted">
                                        <TableCell>
                                            <Link
                                                href={`/customers/${c.id}`}
                                                className="text-primary hover:underline font-medium"
                                            >
                                                {c.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{c.companyId ?? "-"}</TableCell>
                                        <TableCell>{c.email ?? "-"}</TableCell>
                                        <TableCell>{c.phone ?? "-"}</TableCell>
                                        <TableCell>
                                            {new Date(c.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}