'use client'

import * as React from 'react'
import { useActionState } from 'react'
import { signIn } from '@/features/auth/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export function LoginForm() {
  const [state, action, isPending] = useActionState(signIn, null)

  return (
    <form action={action} className="w-full max-w-md">
      <Card className="w-full border-none bg-[#161e29] text-[#fefcfb] shadow-2xl shadow-black/50">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-center text-[#fefcfb]">
            Rate Your Match
          </CardTitle>
          <CardDescription className="text-[#b8b9bc] text-center">
            Sign in to rate matches and join the community
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state?.error && (
            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
              {state.error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#d0d0d1]">Email</Label>
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
            <Label htmlFor="password" className="text-[#d0d0d1]">Password</Label>
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
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
          <div className="text-center text-sm text-[#b8b9bc]">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#5f4dbd] hover:text-[#9868cc] font-medium transition-colors">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
