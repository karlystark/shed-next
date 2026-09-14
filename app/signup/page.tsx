'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import ProfileCard from '../components/profileCard/profileCard';

const colors = ['#854d0e', '#022c22', '#7f1d1d', '#9a3412', '#0f766e', '#831843'];
const icons = ['/bowl-green.png', '/bucket-green.png', '/cart-green.png', '/shed-green.png', '/grass-green.png'];

interface FormData {
  username: string;
  email: string;
  password: string;
}

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: ''
  });
  const [color, setColor] = useState('');
  const [icon, setIcon] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData ((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const submitData = { ...formData, color, icon };
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError('Account created, but automatic login failed. Please log in.');
        router.push('/login');
        return;
      }

      router.push('/resources');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="Signup min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 mb-4 text-center text-5xl font-extrabold text-gray-900">Join Shed</h2>
          <p className="text-center mb-12">your chosen family network awaits</p>
        </div>
        <form className="mt-8 space-y-6 bg-[var(--light-bg)] p-8 rounded-xl shadow-2xl" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 my-4">Email Address</label>
              <input id="email" name="email" value={formData.email} onChange={handleChange} type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-800 focus:border-yellow-800 focus:z-10 sm:text-sm" placeholder="Email address" />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 my-4">Username</label>
              <input id="username" name="username" value={formData.username} onChange={handleChange} type="text" autoComplete="username" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-800 focus:border-yellow-800 focus:z-10 sm:text-sm" placeholder="Username" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 my-4">Password</label>
              <input id="password" name="password" value={formData.password} onChange={handleChange} type="password" autoComplete="new-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 mb-8 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-800 focus:border-yellow-800 focus:z-10 sm:text-sm" placeholder="Password" />
            </div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 p-2">
              Select Profile Color
            </label>

            <div className="flex">
              {colors.map((colorChoice) => (
                <div
                  key={colorChoice}
                  onClick={() => setColor(colorChoice)}
                  className={`w-14 h-14 m-2 rounded-full cursor-pointer hover:ring-4 hover:ring-yellow-600 ${colorChoice === color && 'ring-4 ring-yellow-600'}`}
                  style= {{backgroundColor: `${colorChoice}`}}
                ></div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700 p-2">
              Select Profile Icon
            </label>
            <div className="flex">

              {icons.map((iconChoice) => (
                <div
                  key={iconChoice}
                  onClick={() => setIcon(iconChoice)}
                  className={`w-16 h-16 m-2 rounded-full cursor-pointer bg-cover bg-center hover:ring-4 hover: ring-yellow-600 ${iconChoice === icon && 'ring-4 ring-yellow-600'}`}
                  style={{ backgroundImage: `url(${iconChoice})` }}
                ></div>
              ))}
            </div>
          </div>
          <div className="mb-4 p-4 rounded-md border border-gray-300">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Preview
            </label>
            <ProfileCard username={formData.username || 'you'} color={color} icon={icon} />
          </div>

          {error && (
            <p className="text-center text-red-800 text-sm font-medium">{error}</p>
          )}

          <div>
            <button type="submit" disabled={submitting} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-950 hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              {submitting ? 'Signing up...' : 'Sign me up!'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
