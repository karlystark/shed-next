'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface LandingGateProps {
  initiallyUnlocked: boolean;
}

export default function LandingGate({ initiallyUnlocked }: LandingGateProps) {
  const router = useRouter();
  const [unlocked, setUnlocked] = useState(initiallyUnlocked);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/site-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError('Incorrect password.');
        return;
      }

      setUnlocked(true);
      router.refresh();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (unlocked) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 w-full max-w-sm flex flex-col items-center gap-4 text-center bg-[var(--green)] rounded-xl shadow-2xl p-8"
    >
      <label htmlFor="site-password" className="text-[#f4f2ed]">
        this is a private beta &mdash; enter the password your friend shared with you
      </label>
      <input
        id="site-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="appearance-none w-full px-3 py-2 border border-transparent text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--yellow)] sm:text-sm"
        placeholder="password"
      />
      {error && <p className="text-red-300 text-sm font-medium">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="bg-[var(--yellow)] hover:brightness-90 text-[var(--green)] text-lg font-bold py-2 px-6 rounded-full transition disabled:opacity-50"
      >
        {submitting ? 'Checking...' : 'Enter'}
      </button>
    </form>
  );
}
