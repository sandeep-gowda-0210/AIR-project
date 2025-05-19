'use client'
import React from "react";
import { Settings, Home, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Sidebar() {

    const router = useRouter(); 
    const pathname = usePathname() ?? '/';
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
    <div className="w-15 h-full bg-[#171717] pl-4 border-r">
      <div className="flex flex-col gap-y-4 h-full justify-between py-5">
        <div className="flex flex-col  gap-y-6">
        <Link className={`${pathname.startsWith('/pages/home/chat-page') ? " text-blue-500" : " text-blue-200"} flex hover:text-white items-center gap-y-2 transform transition-transform duration-300 hover:scale-110`} href="/pages/home/chat-page">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle-more-icon lucide-message-circle-more"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>
        </Link>
        <Link className={`${pathname.startsWith('/pages/home/document-page')? " text-blue-500" : " text-blue-200"} flex hover:text-white items-center gap-y-2 transform transition-transform duration-300 hover:scale-110`} href="/pages/home/document-page">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-files-icon lucide-files"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>
        </Link>
        </div>
        <div className="flex flex-col  gap-y-8">
        <Link className={`${pathname.startsWith('/pages/home/settings') ? " text-blue-500" : " text-blue-200"} flex hover:text-white items-center gap-y-2 transform transition-transform duration-300 hover:scale-110`} href="/pages/home/settings/profile-page">
          <Settings size={30} /> 
        </Link>
        <button className="flex items-center gap-y-2 text-blue-200 hover:text-white mt-auto hover:cursor-pointer transform transition-transform duration-300 hover:scale-110" onClick={logout}>
          <LogOut size={30} />
        </button>
        </div>
      </div>
    </div>
  );
}
