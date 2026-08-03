"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "./navLinks";

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-white/8 bg-black md:hidden">
      {navLinks.map((link) => {
        const active = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex-1 px-3 py-3 text-center text-xs ${
              active ? "text-white" : "text-white/50"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
