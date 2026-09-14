'use client';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { CATEGORIES } from '../../../../lib/constants';

interface FormData {
  title: string;
  description: string;
  quantity: string;
  category: string;
}

export default function EditResource() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    async function loadResource() {
      const response = await fetch(`/api/resources/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Could not load this resource.');
        return;
      }

      if (session && data.owner?.username !== session.user.username) {
        router.push(`/users/${data.owner?.username}`);
        return;
      }

      setFormData({
        title: data.title,
        description: data.description || '',
        quantity: String(data.quantity),
        category: data.category,
      });
    }

    if (status === 'authenticated') {
      loadResource();
    }
  }, [status, session, params.id, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => prevData && ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch(`/api/resources/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, quantity: Number(formData.quantity) }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      router.push(`/users/${session?.user.username}`);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (status !== 'authenticated' || !formData) {
    return null;
  }

  return (
    <div className="EditResource min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 mb-4 text-center text-5xl font-extrabold text-gray-900">Edit resource</h2>
        </div>
        <form className="mt-8 space-y-6 bg-[var(--light-bg)] p-8 rounded-xl shadow-2xl" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 my-4">Title</label>
            <input id="title" name="title" value={formData.title} onChange={handleChange} type="text" required maxLength={50} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-800 focus:border-yellow-800 focus:z-10 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 my-4">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} maxLength={100} rows={3} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-800 focus:border-yellow-800 focus:z-10 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 my-4">Quantity</label>
            <input id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} type="number" min={1} required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-800 focus:border-yellow-800 focus:z-10 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 my-4">Category</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-800 focus:border-yellow-800 focus:z-10 sm:text-sm">
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-center text-red-800 text-sm font-medium">{error}</p>
          )}

          <div>
            <button type="submit" disabled={submitting} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-950 hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
