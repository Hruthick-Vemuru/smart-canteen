import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { token } = req.nextauth;
        const { pathname } = req.nextUrl;

        if (pathname.startsWith("/seller") && !pathname.startsWith("/seller/login")) {
            if (token?.role !== "SELLER") {
                return NextResponse.redirect(new URL("/seller/login", req.url));
            }
        }

        if (
            pathname.startsWith("/menu") ||
            pathname.startsWith("/cart") ||
            pathname.startsWith("/my-orders") ||
            pathname.startsWith("/profile")
        ) {
            if (!token) {
                return NextResponse.redirect(new URL("/login", req.url));
            }
            if (token.role === "SELLER") {
                return NextResponse.redirect(new URL("/seller/dashboard", req.url));
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // We handle redirects within the middleware body directly so return true here 
                // if they hit a protected path as defined in matcher.
                return true;
            },
        },
    }
);

export const config = {
    matcher: [
        "/seller/:path*",
        "/menu/:path*",
        "/cart/:path*",
        "/my-orders/:path*",
        "/profile/:path*",
    ],
};
