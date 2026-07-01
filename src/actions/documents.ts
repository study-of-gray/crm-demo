"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// 获取客户的文档列表
export async function getCustomerDocuments() {
    try {
        const session = await auth();
        if (!session || session.user.type !== "customer") {
            return [];
        }

        const documents = await prisma.document.findMany({
            where: {
                customer: {
                    email: session.user.email,
                },
            },
            include: {
                uploadedBy: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                uploadedAt: "desc",
            },
        });

        return documents;
    } catch (error) {
        console.error("获取文档列表失败:", error);
        return [];
    }
}

// 上传文档（员工使用）
export async function uploadDocument(
    customerId: string,
    file: File,
    description?: string
): Promise<{ success: boolean; message?: string; documentId?: string }> {
    try {
        const session = await auth();
        if (!session || session.user.type !== "employee") {
            return { success: false, message: "未登录" };
        }

        // 验证客户是否存在
        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
        });

        if (!customer) {
            return { success: false, message: "客户不存在" };
        }

        // 生成唯一文件名
        const fileExtension = file.name.split(".").pop();
        const uniqueFileName = `${uuidv4()}.${fileExtension}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads", "documents");
        const filePath = path.join(uploadDir, uniqueFileName);

        // 确保上传目录存在
        await mkdir(uploadDir, { recursive: true });

        // 将文件保存到服务器
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // 获取文件大小
        const fileSize = buffer.length;

        // 创建文档记录
        const document = await prisma.document.create({
            data: {
                name: file.name.replace(`.${fileExtension}`, ""),
                fileName: file.name,
                filePath: `/uploads/documents/${uniqueFileName}`,
                fileSize: fileSize,
                mimeType: file.type,
                description: description || null,
                customerId: customerId,
                uploadedById: session.user.id,
            },
        });

        return {
            success: true,
            message: "文档上传成功",
            documentId: document.id
        };
    } catch (error) {
        console.error("上传文档失败:", error);
        return { success: false, message: "上传文档失败" };
    }
}

// 删除文档（员工使用）
export async function deleteDocument(documentId: string): Promise<{ success: boolean; message?: string }> {
    try {
        const session = await auth();
        if (!session || session.user.type !== "employee") {
            return { success: false, message: "未登录" };
        }

        // 获取文档信息
        const document = await prisma.document.findUnique({
            where: { id: documentId },
        });

        if (!document) {
            return { success: false, message: "文档不存在" };
        }

        // 删除数据库记录
        await prisma.document.delete({
            where: { id: documentId },
        });

        // 删除服务器上的文件（可选）
        // 注意：在实际应用中，你可能不想立即删除文件，而是保留备份
        // 这里我们只是删除数据库记录

        return { success: true, message: "文档删除成功" };
    } catch (error) {
        console.error("删除文档失败:", error);
        return { success: false, message: "删除文档失败" };
    }
}

// 获取文档下载链接
export async function getDocumentDownloadUrl(documentId: string): Promise<string | null> {
    try {
        const session = await auth();
        if (!session) {
            return null;
        }

        const document = await prisma.document.findUnique({
            where: { id: documentId },
            include: {
                customer: true,
            },
        });

        if (!document) {
            return null;
        }

        // 检查权限：客户只能下载自己的文档，员工可以下载所有文档
        if (session.user.type === "customer") {
            if (document.customer.email !== session.user.email) {
                return null;
            }
        }

        return document.filePath;
    } catch (error) {
        console.error("获取下载链接失败:", error);
        return null;
    }
}
// 获取所有文档（员工使用）
export async function getAllDocuments(userId: string, role: string) {
    try {
        if (role === "ADMIN" || role === "MANAGER") {
            // 管理员/经理可以看到所有文档
            return prisma.document.findMany({
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    uploadedBy: {
                        select: {
                            id: true,
                            name: true,
                            role: true,
                        },
                    },
                },
                orderBy: {
                    uploadedAt: "desc",
                },
            });
        } else {
            // 员工只能看到自己上传的文档
            return prisma.document.findMany({
                where: {
                    uploadedById: userId,
                },
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    uploadedBy: {
                        select: {
                            id: true,
                            name: true,
                            role: true,
                        },
                    },
                },
                orderBy: {
                    uploadedAt: "desc",
                },
            });
        }
    } catch (error) {
        console.error("获取文档列表失败:", error);
        return [];
    }
}
// ✅ 获取所有文档（员工使用）
export async function getDocuments() {
    const session = await auth();

    if (!session || session.user.type !== "employee") {
        return [];
    }

    const isAdminOrManager = session.user.role === "ADMIN" || session.user.role === "MANAGER";

    const documents = await prisma.document.findMany({
        where: isAdminOrManager ? {} : { customer: { assignedStaff: { some: { userId: session.user.id } } } },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                },
            },
            uploadedBy: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                },
            },
        },
        orderBy: { uploadedAt: "desc" },
    });

    return documents;
}