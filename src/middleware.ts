import { type NextRequest } from "next/server";
import { updateSession } from "../config/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/posts/add",
    "/posts/edit",
    "/posts/edit/:path*",
    "/auth/sign-in",
    "/auth/sign-up",
  ],
};
