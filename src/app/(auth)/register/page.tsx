import { RegisterForm } from '@/components/auth/register-form'
import { getCurrentUser } from '@/features/auth/queries'
import { redirect } from 'next/navigation'

export default async function RegisterPage() {
  const session = await getCurrentUser()
  
  if (session) {
    redirect('/')
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#161e29] px-4 py-12">
      <div className="relative z-10 w-full flex justify-center">
        <RegisterForm />
      </div>
    </main>
  )
}
