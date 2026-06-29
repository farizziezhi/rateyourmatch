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
    <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/80 backdrop-blur-md text-zinc-100 shadow-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-extrabold tracking-tight text-center bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
          Rate Your Match
        </CardTitle>
        <CardDescription className="text-zinc-400 text-center">
          Sign in to rate matches and join the community
        </CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent className="space-y-4">
          {state?.error && (
            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
              {state.error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="border-zinc-800 bg-zinc-900/50 text-zinc-100 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-zinc-950 font-semibold cursor-pointer transition-all duration-200 shadow-lg shadow-emerald-500/10"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
          <div className="text-sm text-zinc-400 text-center">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-emerald-400 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
