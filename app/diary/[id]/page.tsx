"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getDiary, ApiError } from "../../lib/api";
import { getEmotionTheme, type Diary } from "../../lib/types";
import EmotionBadge from "../../components/EmotionBadge";
import EmotionMap from "../../components/EmotionMap";
import SongCard from "../../components/SongCard";
import LoadingOverlay from "../../components/LoadingOverlay";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DiaryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // 방금 작성한 결과가 캐시에 있으면 즉시 사용 (lazy initializer)
  const [diary, setDiary] = useState<Diary | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const cached = sessionStorage.getItem(`nube:diary:${id}`);
      return cached ? (JSON.parse(cached) as Diary) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => diary === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 캐시 적중 시 네트워크 조회 생략 (state는 lazy init으로 이미 채워짐)
    try {
      if (sessionStorage.getItem(`nube:diary:${id}`)) return;
    } catch {
      /* 접근 불가 시 그냥 네트워크 조회 진행 */
    }

    let cancelled = false;

    // 아카이브 등에서 진입한 경우 서버 조회
    getDiary(id)
      .then((d) => {
        if (!cancelled) {
          setDiary(d);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? err.message
            : "추천 결과를 불러오지 못했어요 🥲",
        );
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <LoadingOverlay message="추억을 불러오는 중..." />;

  if (error || !diary) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-20 text-center">
        <p className="floaty mb-4 text-6xl">🥲</p>
        <p className="chrome-text mb-2 font-pixel text-lg">NOT FOUND</p>
        <p className="mb-6 text-ink/70">
          {error ?? "추천 결과를 찾을 수 없어요"}
        </p>
        <Link href="/" className="y2k-btn">
          새 일기 쓰러 가기
        </Link>
      </div>
    );
  }

  const theme = getEmotionTheme(diary.emotion_label);
  const sorted = [...diary.recommendations].sort((a, b) => a.rank - b.rank);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      {/* 일기 + 감정 */}
      <section className="y2k-panel mb-6 p-5 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <EmotionBadge label={diary.emotion_label} size="lg" />
          <span className="font-pixel text-[9px] text-pink-deep/60">
            {formatDate(diary.created_at)}
          </span>
        </div>

        <p className="whitespace-pre-wrap text-lg leading-relaxed text-ink">
          {diary.content}
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_1.2fr] sm:items-center">
          <EmotionMap
            valence={diary.target_valence}
            energy={diary.target_energy}
            accent={theme.accent}
          />
          <div className="space-y-2 text-sm text-ink/80">
            <p>
              <span className="font-pixel text-[9px] text-pink-deep">GENRE</span>{" "}
              <span className="ml-1 rounded-full border-2 border-white bg-white/70 px-2.5 py-0.5">
                {diary.selected_genre}
              </span>
            </p>
            <p className="leading-relaxed">
              오늘의 감정은 <b style={{ color: theme.accent }}>{theme.short}</b>
              {theme.emoji} 이에요. 이 기분에 어울리는 음악{" "}
              <b>{sorted.length}곡</b>을 골라봤어요!
            </p>
          </div>
        </div>
      </section>

      {/* 추천 곡 */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 px-1">
          <span className="sparkle text-xl">✦</span>
          <span className="chrome-text font-pixel text-base sm:text-lg">
            PLAYLIST FOR YOU
          </span>
        </h2>

        {sorted.length === 0 ? (
          <div className="y2k-card p-8 text-center text-ink/60">
            추천된 곡이 없어요 😢
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {sorted.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </section>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className="y2k-btn">
          또 기록하기
        </Link>
        <Link href="/archive" className="y2k-btn y2k-btn--ice">
          📼 아카이브 보기
        </Link>
      </div>
    </div>
  );
}
