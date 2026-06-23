"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getArchive, ApiError } from "../lib/api";
import { getEmotionTheme, type DiarySummary } from "../lib/types";
import EmotionBadge from "../components/EmotionBadge";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ArchivePage() {
  const [items, setItems] = useState<DiarySummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchArchive = useCallback(() => {
    getArchive()
      .then(setItems)
      .catch((err) =>
        setError(
          err instanceof ApiError
            ? err.message
            : "아카이브를 불러오지 못했어요 🥲",
        ),
      );
  }, []);

  // 재시도 버튼: 상태를 초기화한 뒤 다시 조회
  function retry() {
    setError(null);
    setItems(null);
    fetchArchive();
  }

  useEffect(() => {
    fetchArchive();
  }, [fetchArchive]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="mb-8 text-center">
        <p className="floaty mb-2 text-5xl">📼</p>
        <h1 className="chrome-text font-pixel text-xl sm:text-3xl">ARCHIVE</h1>
        <p className="mt-2 text-ink/80">지금까지 기록한 감정들 ✦</p>
      </section>

      {/* 로딩 */}
      {items === null && !error && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="y2k-card h-28 animate-pulse opacity-60"
              aria-hidden
            />
          ))}
        </div>
      )}

      {/* 에러 */}
      {error && (
        <div className="y2k-panel p-8 text-center">
          <p className="mb-4 text-ink/80">{error}</p>
          <button onClick={retry} className="y2k-btn">
            다시 시도
          </button>
        </div>
      )}

      {/* 빈 상태 */}
      {items !== null && items.length === 0 && (
        <div className="y2k-panel p-10 text-center">
          <p className="floaty mb-4 text-5xl">☁︎</p>
          <p className="mb-2 chrome-text font-pixel text-sm">EMPTY</p>
          <p className="mb-6 text-ink/70">아직 작성한 일기가 없어요</p>
          <Link href="/" className="y2k-btn">
            ✎ 첫 일기 쓰러 가기
          </Link>
        </div>
      )}

      {/* 목록 */}
      {items !== null && items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => {
            const theme = getEmotionTheme(item.emotion_label);
            return (
              <Link
                key={item.id}
                href={`/diary/${item.id}`}
                className="y2k-card block p-4 sm:p-5"
                style={{
                  borderTop: `4px solid ${theme.accent}`,
                }}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <EmotionBadge label={item.emotion_label} size="sm" />
                  <span className="shrink-0 font-pixel text-[8px] text-pink-deep/60">
                    {formatDate(item.created_at)}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm leading-relaxed text-ink/85">
                  {item.content}
                </p>
                <p className="mt-3 text-right font-pixel text-[8px] text-pink-deep/70">
                  자세히 보기 →
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
