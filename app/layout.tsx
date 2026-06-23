import type { Metadata } from "next";
import "./globals.css";
import Nav from "./components/Nav";

export const metadata: Metadata = {
  title: "☁ Nube — 오늘의 기분 플레이리스트",
  description:
    "감정 일기를 적으면 AI가 기분에 어울리는 음악 5곡을 추천해주는 초개인화 음악 서비스, 누베(Nube).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        {/* 한글+영문 픽셀 폰트 Galmuri(갈무리) */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/galmuri/dist/galmuri.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="relative z-10 flex min-h-full flex-col">
          <Nav />
          <main className="flex-1 w-full">{children}</main>
          <footer className="py-8 text-center font-pixel text-[10px] text-[var(--pink-deep)]/70">
            ☆ NUBE © 2026 ☆ made with ♡
          </footer>
        </div>
      </body>
    </html>
  );
}
