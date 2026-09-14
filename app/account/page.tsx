'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const [confirming, setConfirming] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.username);
      setEmail(session.user.email);
    }
  }, [session]);

  async function handleProfileSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfileError('');
    setProfileMessage('');
    setSavingProfile(true);

    try {
      const response = await fetch('/api/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email }),
      });
      const data = await response.json();

      if (!response.ok) {
        setProfileError(data.error || 'Something went wrong.');
        return;
      }

      await update({ username: data.username, email: data.email });
      setProfileMessage('Profile updated.');
    } catch (err) {
      setProfileError('Something went wrong. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      const response = await fetch('/api/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, password: newPassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.error || 'Something went wrong.');
        return;
      }

      setPasswordMessage('Password updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError('Something went wrong. Please try again.');
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleDelete(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDeleteError('');
    setDeleting(true);

    try {
      const response = await fetch('/api/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        setDeleteError(data.error || 'Something went wrong.');
        return;
      }

      await signOut({ callbackUrl: '/' });
    } catch (err) {
      setDeleteError('Something went wrong. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  if (status !== 'authenticated' || !session) {
    return null;
  }

  return (
    <div className="Account min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div>
          <h2 className="mt-6 mb-4 text-center text-5xl font-extrabold text-gray-900">Account</h2>
          <p className="text-center mb-4">signed in as {session.user.username}</p>
        </div>

        <form onSubmit={handleProfileSubmit} className="bg-[var(--light-bg)] p-8 rounded-xl shadow-2xl space-y-4">
          <h3 className="text-xl font-bold mb-2">Profile</h3>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              maxLength={30}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-800 focus:border-yellow-800 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-800 focus:border-yellow-800 sm:text-sm"
            />
          </div>
          {profileError && <p className="text-red-800 text-sm font-medium">{profileError}</p>}
          {profileMessage && <p className="text-emerald-900 text-sm font-medium">{profileMessage}</p>}
          <button
            type="submit"
            disabled={savingProfile}
            className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-950 hover:bg-yellow-800 disabled:opacity-50"
          >
            {savingProfile ? 'Saving...' : 'Save profile'}
          </button>
        </form>

        <form onSubmit={handlePasswordSubmit} className="bg-[var(--light-bg)] p-8 rounded-xl shadow-2xl space-y-4">
          <h3 className="text-xl font-bold mb-2">Change password</h3>
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">Current password</label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-800 focus:border-yellow-800 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">New password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-800 focus:border-yellow-800 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm new password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-800 focus:border-yellow-800 sm:text-sm"
            />
          </div>
          {passwordError && <p className="text-red-800 text-sm font-medium">{passwordError}</p>}
          {passwordMessage && <p className="text-emerald-900 text-sm font-medium">{passwordMessage}</p>}
          <button
            type="submit"
            disabled={savingPassword}
            className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-950 hover:bg-yellow-800 disabled:opacity-50"
          >
            {savingPassword ? 'Saving...' : 'Update password'}
          </button>
        </form>

        <div className="bg-[var(--light-bg)] p-8 rounded-xl shadow-2xl border-2 border-red-800">
          <h3 className="text-xl font-bold text-red-900 mb-2">Danger zone</h3>
          <p className="text-sm text-gray-700 mb-6">
            Deleting your account permanently removes your profile, everything in your shed, and your
            friend connections. This can&apos;t be undone.
          </p>

          {!confirming ? (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="py-2 px-4 border border-red-800 text-sm font-medium rounded-md text-red-900 hover:bg-red-800 hover:text-white"
            >
              Delete my account
            </button>
          ) : (
            <form onSubmit={handleDelete} className="space-y-4">
              <div>
                <label htmlFor="deletePassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your password to confirm
                </label>
                <input
                  id="deletePassword"
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-800 focus:border-red-800 sm:text-sm"
                />
              </div>
              {deleteError && <p className="text-red-800 text-sm font-medium">{deleteError}</p>}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={deleting}
                  className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-800 hover:bg-red-900 disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Permanently delete my account'}
                </button>
                <button
                  type="button"
                  onClick={() => { setConfirming(false); setDeletePassword(''); setDeleteError(''); }}
                  className="py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
