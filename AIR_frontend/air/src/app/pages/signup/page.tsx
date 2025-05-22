// components/AuthForm.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
    const response = await fetch('/api/userauth/signup',{
      method: 'POST',
      body: JSON.stringify({ email, password, username, firstname }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if(response.status===200) router.push('/pages/home/chat-page');
  }
  catch(error){
    if (error) setMessage(`${error}`);
    // else setMessage('✅ Signup successful! Check your email to confirm.');
  }
  };

  return (
    <div className='flex justify-center mt-20'>
            <div className="flex flex-col gap-2 max-w-sm">
    <form onSubmit={handleSignup} className="flex flex-col gap-2 max-w-sm">
      <input
        type="email"
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <input
        type="username"
        value={username}
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <input
        type="firstname"
        value={firstname}
        placeholder="firstname"
        onChange={(e) => setFirstname(e.target.value)}
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
        Sign Up
      </button>
      {message && <p>{message}</p>}
    </form>
      <div className='border-t-orange-400 border-t-2 border-dashed text-center mt-5'>
        go to login page if account exists

      </div>
        <button className="bg-blue-300 text-white p-2 rounded mt-5 w-full" onClick={()=>router.push('/pages/login')}>Login</button>
    </div>
      </div>
  );
}
