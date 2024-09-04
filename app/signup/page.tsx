'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import React from 'react';

const colors = ['#854d0e', '#022c22', '#7f1d1d', '#9a3412', '#0f766e', '#831843'];
const icons = ['/bowl-green.png', '/bucket-green.png', '/cart-green.png', '/shed-green.png', '/grass-green.png'];

interface FormData {
  username: string;
  email: string;
  password: string;
}

export default function Signup() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: ''
  });
  const [color, setColor] = useState('');
  const [icon, setIcon] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData ((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const submitData = {
    //   ...formData,
    //   color: color,
    //   icon: icon
    // }
    // const response = await axios.post('/api/users', submitData);
    // console.log(response.data);
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
              <input id="username" name="username" value={formData.username} onChange={handleChange}type="username" autoComplete="username" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-800 focus:border-yellow-800 focus:z-10 sm:text-sm" placeholder="Username" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 my-4">Password</label>
              <input id="password" name="password" value={formData.password} onChange={handleChange}type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 mb-8 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-800 focus:border-yellow-800 focus:z-10 sm:text-sm" placeholder="Password" />
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
            <div
              className={'w-full h-32 rounded-lg flex items-center p-4'}
              style={{backgroundColor: `${color ? `${color}` : 'bg-gray-200'}`}}
            >
              {icon && (
                <div
                  className="w-16 h-16 rounded-full bg-[#f4f2ed] flex items-center justify-center"
                  style={{ backgroundImage: `url(${icon})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                ></div>
              )}
              {formData.username && (<h2 className='preview-name text-[#f4f2ed] ml-6 mt-2 text-lg truncate'>{formData.username}</h2>)}
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-950 hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Sign me up!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
