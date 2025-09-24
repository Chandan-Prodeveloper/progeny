import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-xl">Progeny AI</span>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <CardTitle className="text-2xl">Welcome to Progeny AI!</CardTitle>
            <CardDescription>Your account has been created successfully</CardDescription>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You can now start using your 5 free plant scans daily. Check your email for confirmation if required.
            </p>
            <Button asChild className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
