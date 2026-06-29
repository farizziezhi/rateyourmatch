import { LoginForm } from '@/components/auth/login-form'
import { getCurrentUser } from '@/features/auth/queries'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const session = await getCurrentUser()
  
  if (session) {
    redirect('/')
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-4 py-12">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-950/20 via-zinc-950 to-black" />
      <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
      
      <div className="relative z-10 w-full flex justify-center">
        <LoginForm />
      </div>
    </main>
  )
}
