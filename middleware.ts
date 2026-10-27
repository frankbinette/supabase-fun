import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Only the pages that use the visitor's session; the rest of the site stays static.
  matcher: ["/guestbook", "/login", "/auth/:path*"],
};
