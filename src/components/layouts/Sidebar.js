"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Button from "@ui/Button";
import { navLinks } from "./navLinks";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-[200px] flex-col self-start overflow-y-auto border-r border-white/8 px-4 py-6 md:flex">
      <div className="mb-6 flex items-center gap-2">
        <img src="/logo.svg" alt="" className="h-6 w-6 rounded-md" />
        <p className="text-sm font-semibold text-white">dlnator</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
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

      <Button
        variant="outline"
        onClick={handleLogout}
        className="w-full px-3 py-2 text-left text-white/70 hover:text-white"
      >
        log out
      </Button>
    </aside>
  );
}
