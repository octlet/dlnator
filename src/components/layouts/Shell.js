"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@layouts/Sidebar";
import MobileNav from "@layouts/MobileNav";

export default function Shell({ children }) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return children;
  }

  return (
    <div className="flex w-full">
      <Sidebar />

      <div className="flex flex-1 flex-col px-4 py-4 pb-24 md:px-6 md:py-6 md:pb-6">
        {children}
      </div>

      <MobileNav />
    </div>
  );
}
