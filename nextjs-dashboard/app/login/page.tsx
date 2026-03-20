import LoginForm from '@/app/ui/login-form';
import { createServerClient } from '@/app/lib/supabase-server';
import { redirect } from 'next/navigation';

export default async function Page() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
