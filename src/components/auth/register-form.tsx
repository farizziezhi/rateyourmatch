'use client'

import * as React from 'react'
import { useActionState } from 'react'
import { signUp } from '@/features/auth/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export function RegisterForm() {
  const [state, action, isPending] = useActionState(signUp, null)

  return (
    <form action={action} className="w-full max-w-md">
      <Card className="w-full border-none bg-[#161e29] text-[#fefcfb] shadow-2xl shadow-black/50">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-center text-[#fefcfb]">
            Create an Account
          </CardTitle>
          <CardDescription className="text-[#b8b9bc] text-center">
            Join Rate Your Match to rate games and view stats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state?.error && (
            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="rounded-md bg-[#5f4dbd]/10 p-3 text-sm text-[#9868cc] border border-[#5f4dbd]/20">
              {state.message}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-[#d0d0d1]">Username *</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="johndoe"
              required
              className="border-[#1e1d1d] bg-[#1e1d1d] text-[#fefcfb] placeholder-[#b8b9bc] focus:border-[#5f4dbd] focus:ring-[#5f4dbd] rounded-full px-4"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-[#d0d0d1]">Display Name</Label>
            <Input
              id="displayName"
              name="displayName"
              type="text"
              placeholder="John Doe"
              className="border-[#1e1d1d] bg-[#1e1d1d] text-[#fefcfb] placeholder-[#b8b9bc] focus:border-[#5f4dbd] focus:ring-[#5f4dbd] rounded-full px-4"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#d0d0d1]">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="border-[#1e1d1d] bg-[#1e1d1d] text-[#fefcfb] placeholder-[#b8b9bc] focus:border-[#5f4dbd] focus:ring-[#5f4dbd] rounded-full px-4"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#d0d0d1]">Password *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="border-[#1e1d1d] bg-[#1e1d1d] text-[#fefcfb] focus:border-[#5f4dbd] focus:ring-[#5f4dbd] rounded-full px-4"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-[#fefcfb] hover:bg-[#e6e4e3] text-[#161e29] rounded-full font-bold cursor-pointer transition-colors"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Sign Up'
            )}
          </Button>
          <div className="text-center text-sm text-[#b8b9bc]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#5f4dbd] hover:text-[#9868cc] font-medium transition-colors">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
