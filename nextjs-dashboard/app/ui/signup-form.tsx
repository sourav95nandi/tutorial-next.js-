// app/ui/signup-form.tsx
'use client';

import { lusitana } from '@/app/ui/fonts';
import { useActionState, useState } from 'react';
import { signUp } from '@/app/lib/actions';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';

export default function SignUpForm() {
  const [serverError, formAction, isPending] = useActionState(
    signUp,
    undefined,
  );
  const [clientError, setClientError] = useState('');
  const handleClientValidation = (formData: FormData) => {
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Check if they match on the client
    if (password !== confirmPassword) {
      setClientError('Passwords do not match.');
      return; // Stop here! The server action is never called.
    }
    setClientError('');
    formAction(formData);
  };
  return (
    <form action={handleClientValidation}className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Sign Up
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
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <button type="submit" disabled={isPending} className="mt-4 w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-400">
          {isPending ? 'Signing up...' : 'Sign up'}
        </button>
        <div className="flex h-8 items-end space-x-1">
          {(clientError || serverError) && (
            <p className="text-sm text-red-500">{clientError || serverError}</p>
          )}
        </div>
      </div>
    </form>
  );
}