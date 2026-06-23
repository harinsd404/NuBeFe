"use client";

import { useEffect, useRef, useState } from "react";
import { GENRES } from "../lib/genres";

export default function GenreSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selected = GENRES.find((g) => g.value === value);
  // 검색어가 데이터셋 114개 장르를 직접 입력하는 경우도 허용
  const filtered = GENRES.filter(
    (g) =>
      g.label.toLowerCase().includes(query.toLowerCase()) ||
      g.value.includes(query.toLowerCase()),
  );

  function pick(v: string) {
    onChange(v);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="y2k-input flex items-center justify-between text-left"
      >
        <span className={selected ? "text-ink" : "text-ink/40"}>
          {selected ? selected.label : "장르를 골라주세요 🎶"}
        </span>
        <span className="text-pink-deep">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border-2 border-white bg-white/95 shadow-[0_0_0_2px_rgba(255,119,204,0.5),0_14px_30px_rgba(214,58,160,0.3)] backdrop-blur">
          <div className="p-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="장르 검색 (예: jazz)"
              className="w-full rounded-xl border-2 border-ice bg-ice/40 px-3 py-2 text-sm outline-none focus:border-pink"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto px-2 pb-2">
            {filtered.length === 0 && query.trim() !== "" && (
              <li>
                <button
                  type="button"
                  onClick={() => pick(query.trim().toLowerCase())}
                  className="w-full rounded-xl px-3 py-2 text-left text-sm text-pink-deep hover:bg-ice"
                >
                  &ldquo;{query.trim().toLowerCase()}&rdquo; 장르로 직접 추천받기 →
                </button>
              </li>
            )}
            {filtered.map((g) => (
              <li key={g.value}>
                <button
                  type="button"
                  onClick={() => pick(g.value)}
                  className={`w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    g.value === value
                      ? "bg-pink font-bold text-white"
                      : "text-ink hover:bg-ice"
                  }`}
                >
                  {g.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
