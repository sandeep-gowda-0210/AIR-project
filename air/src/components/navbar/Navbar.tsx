'use client'

import { useUserData } from "@/app/pages/home/layout";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const {user} = useUserData();
  const router = useRouter();  // from next/navigation
  const pathname = usePathname();

  const logout = async () => {
    const result = await fetch('/api/userauth/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (result.ok) {
      console.log("logged out");
      router.push('/pages/login');  // redirect after logout
    }
  }

  return (
    <nav className="flex justify-between p-4 shadow-md bg-black">
      <div className="flex gap-10 shadow-md bg-black">
      <Link className={pathname === '/pages/home/chat-page' ? "text-blue-400" : ""} href="/pages/home/chat-page">chat</Link>
      <Link className={pathname === '/pages/home/document-page' ? "text-blue-400" : ""} href="/pages/home/document-page">document</Link>
      <Link className={pathname === '/pages/home/settings/profile-page' ? "text-blue-400" : ""} href="./settings/profile-page">profile</Link>
      </div>
      <div className="flex gap-10 shadow-md bg-black">
      <button className="border-blue-600 hover:cursor-pointer hover:text-blue-200 transition-all ease-in-out duration-200 rounded-md border-2 text-white px-2" onClick={logout}>log out</button>
      <img src={`${user?.profile_url}?t=${new Date().getTime()}`} className="h-10 rounded-4xl mr-8"/>
      </div>
    </nav>
  );
}
