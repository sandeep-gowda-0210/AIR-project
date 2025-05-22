'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/userauth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("called");
    
    if (res.ok) {
      router.push('/pages/home/chat-page');
    } else {
      setMessage('Login failed');
    }
  }
  

  return (
    <div className='flex justify-center mt-20'>
      <div className="flex flex-col gap-2 max-w-sm">
    <form onSubmit={handleLogin} className="flex flex-col gap-2 max-w-sm">
      <input
        type="email"
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Log In
      </button>
      {message && <p>{message}</p>}
    </form>
    <div className='border-t-orange-400 border-t-2 border-dashed text-center mt-5'>
      go to signup page if account doesn't exists

    </div>
    <button className="bg-blue-500 text-white p-2 rounded mt-10 w-full" onClick={()=>{router.push('/pages/signup')}}>signup</button>
    </div>
    </div>
  );
}
