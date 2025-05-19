'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Topbar({ user }: { user: any }) {
    const pathname = usePathname();

  return (
    <div className="w-full h-16 bg-[#313131] shadow flex items-center justify-between px-4 border-b-2 border-gray-300">
      <div className="text-xl font-bold">AIR</div>
      <div className="flex items-center gap-2" >
      <Link className={`${pathname === '/pages/home/settings/profile-page' ? "text-blue-400 " : " text-blue-200"} flex items-center gap-y-2 text-blue-200 hover:text-white transform transition-transform duration-300 hover:scale-110`} href="/pages/home/settings/profile-page">
        <img src={`${user?.profile_url}?t=${new Date().getTime()}`} className="h-10 rounded-4xl mr-8"/>
        </Link>
      </div>
    </div>
  );
}
