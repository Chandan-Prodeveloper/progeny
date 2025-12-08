"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useState } from "react"
import { validateName, validatePassword, type PasswordRequirements } from "@/lib/validation"
import { Check, X } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [nameError, setNameError] = useState<string>("")
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumbers: false,
    hasSpecialChar: false,
    meetsAll: false,
  })
  const router = useRouter()

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFullName(value)
    
    if (value) {
      const validation = validateName(value)
      setNameError(validation.valid ? "" : validation.error)
    } else {
      setNameError("")
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    setPasswordRequirements(validatePassword(value))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const nameValidation = validateName(fullName)
    if (!nameValidation.valid) {
      setNameError(nameValidation.error)
      return
    }
    
    if (!passwordRequirements.meetsAll) {
      setError("Password does not meet all requirements")
      return
    }

    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) throw error
      router.push("/auth/verify-email")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const RequirementItem = ({ met, label }: { met: boolean; label: string }) => (
    <div className="flex items-center gap-2 text-sm">
      <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${met ? "bg-green-100" : "bg-gray-100"}`}>
        {met ? (
          <Check className="w-3 h-3 text-green-600" />
        ) : (
          <X className="w-3 h-3 text-gray-400" />
        )}
      </div>
      <span className={met ? "text-green-700" : "text-gray-600"}>{label}</span>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
               <img src="/logo.png" alt="Logo" className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl">Progeny</span>
          </div>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Join thousands of farmers protecting their plants with AI</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={handleNameChange}
                required
                className={nameError ? "border-red-500" : ""}
              />
              {nameError && <p className="text-sm text-red-600">{nameError}</p>}
              {fullName && !nameError && <p className="text-sm text-green-600">✓ Valid name</p>}
            </div>

            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              
              {password && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 space-y-2">
                  <p className="text-xs font-semibold text-blue-900">Password Requirements:</p>
                  <RequirementItem met={passwordRequirements.hasMinLength} label="Length greater than 8 characters" />
                  <RequirementItem met={passwordRequirements.hasUppercase} label="At least 2 uppercase letters (A-Z)" />
                  <RequirementItem met={passwordRequirements.hasLowercase} label="At least 2 lowercase letters (a-z)" />
                  <RequirementItem met={passwordRequirements.hasNumbers} label="At least 2 numbers (0-9)" />
                  <RequirementItem met={passwordRequirements.hasSpecialChar} label="At least 2 special characters (!@#$%^&*)" />
                </div>
              )}
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !passwordRequirements.meetsAll || !!nameError || !fullName}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
