'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { createBrowserClient } from '@/app/lib/supabase-browser';

export default function LoginForm() {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setErrorMessage('Missing fields. Failed to log in.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            <ExclamationCircleIcon className="h-5 w-5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <Button className="mt-4 w-full" type="submit" disabled={isLoading}>
          {isLoading ? 'Signing in…' : 'Log in'}
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
      </div>
    </form>
  );
}
