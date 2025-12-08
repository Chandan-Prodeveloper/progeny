import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  // If Supabase credentials are not configured, skip middleware
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  // Otherwise, use the Supabase middleware
  const { updateSession } = await import("@/lib/supabase/middleware")
  return await updateSession(request)
}

export default middleware

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|mov|avi)$).*)"],
}
