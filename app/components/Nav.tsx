"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "WRITE", ko: "일기쓰기" },
  { href: "/archive", label: "ARCHIVE", ko: "아카이브" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 px-4 py-3 sm:px-6">
      <nav className="y2k-panel mx-auto flex max-w-3xl items-center justify-between px-4 py-2.5 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-2xl">☁</span>
          <span className="chrome-text font-pixel text-lg sm:text-xl">
            NUBE
          </span>
          <span className="text-base">✦</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {LINKS.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full border-2 border-white px-3 py-1.5 font-pixel text-[9px] transition-all sm:text-[10px] ${
                  active
                    ? "bg-pink text-white shadow-[0_0_0_2px_rgba(214,58,160,0.5),0_4px_10px_rgba(214,58,160,0.4)]"
                    : "bg-white/70 text-pink-deep hover:bg-ice"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
