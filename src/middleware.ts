"use server"
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dinein/:path*", "/sign-in"],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
   const url = request.nextUrl;

  if (token && url.pathname.startsWith("/sign-in")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!token && url.pathname.startsWith("/dinein")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}
