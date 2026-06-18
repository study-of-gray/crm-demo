import { auth } from "@/auth";
import type { ProxyRequest, ProxyResponse } from "next/server";

/**
 * Next.js 16 的 Proxy 函数签名
 * 注意：这里的参数和返回值与 middleware 完全不同
 */
export async function proxy(
    request: ProxyRequest
): Promise<ProxyResponse | void> {
    const session = await auth();

    // 如果是访问 /customers 且没有登录
    if (request.nextUrl.pathname.startsWith("/customers") && !session) {
        // 返回一个重定向响应
        return new ProxyResponse(null, {
            status: 302,
            headers: {
                Location: "/login",
            },
        });
    }

    // 放行请求
    return;
}