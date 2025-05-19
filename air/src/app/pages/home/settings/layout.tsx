'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() || '/';
    return (<div className="flex h-full overflow-hidden">
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-[20%] w-[15%] h-full border-r-2 font-bold flex flex-col gap-2 bg-[#2b2323] p-2"
            >
            <p className="text-3xl border-b-2 mr-4">Setting</p>
            <div>
                <Link className={`${pathname.startsWith('/pages/home/settings/profile-page') ? " text-blue-500" : " text-blue-200"} flex hover:text-white items-center gap-y-2 transform transition-transform duration-300 hover:scale-98`} href="/pages/home/settings/profile-page">
                    <div>Profile</div>
                </Link>
                <Link className={`${pathname.startsWith('/pages/home/settings/help-feedback-page') ? " text-blue-500" : " text-blue-200"} flex hover:text-white items-center gap-y-2 transform transition-transform duration-300 hover:scale-98`} href="/pages/home/chat-page">
                    <div>Help & Feedback</div>
                </Link>
            </div>
                </motion.div>
            </AnimatePresence>
        <div className="min-w-[80%] h-full">
            {children}
        </div>
    </div>)
}