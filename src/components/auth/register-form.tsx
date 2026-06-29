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
    <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/80 backdrop-blur-md text-zinc-100 shadow-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-extrabold tracking-tight text-center bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
          Create an Account
        </CardTitle>
        <CardDescription className="text-zinc-400 text-center">
          Join Rate Your Match to rate games and view stats
        </CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent className="space-y-4">
          {state?.error && (
            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-400 border border-emerald-500/20">
              {state.message}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-zinc-300">Username *</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="johndoe"
              required
              className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-zinc-300">Display Name</Label>
            <Input
              id="displayName"
              name="displayName"
              type="text"
              placeholder="John Doe"
              className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">Email *</Label>
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
            <Label htmlFor="password" className="text-zinc-300">Password *</Label>
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
            Register
          </Button>
          <div className="text-sm text-zinc-400 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-400 hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
