import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-xl">Progeny</span>
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>We've sent you a verification link to complete your registration</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-6xl mb-4">📧</div>
          <p className="text-muted-foreground">
            Please check your email and click the verification link to activate your account. You can close this tab
            once you've clicked the link.
          </p>
          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/auth/login">Back to Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
