"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "./navLinks";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[200px] flex-col border-r border-white/8 px-4 py-6 md:flex">
      <div className="mb-6">
        <p className="text-sm font-semibold text-white">dlnator</p>
      </div>

      <nav className="flex flex-col gap-1">
        {navLinks.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm ${
                active
                  ? "bg-white text-black"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
