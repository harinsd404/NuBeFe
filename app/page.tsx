"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDiary, ApiError } from "./lib/api";
import GenreSelect from "./components/GenreSelect";
import LoadingOverlay from "./components/LoadingOverlay";

const PLACEHOLDER =
  "오늘 하루는 어땠나요? 떠오르는 감정을 자유롭게 적어보세요 ☁︎";

export default function Home() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = content.trim().length > 0 && genre.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setError(null);
    setLoading(true);
    try {
      const diary = await createDiary({
        content: content.trim(),
        selected_genre: genre.trim(),
      });
      // 방금 만든 결과를 즉시 보여주기 위해 캐시
      try {
        sessionStorage.setItem(`nube:diary:${diary.id}`, JSON.stringify(diary));
      } catch {
        /* 저장 실패해도 상세 페이지에서 재조회됨 */
      }
      router.push(`/diary/${diary.id}`);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.status === 404
            ? "추천할 음악 데이터를 찾을 수 없어요 😢"
            : err.message
          : "잠시 후 다시 시도해주세요 🥲";
      setError(msg);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      {loading && <LoadingOverlay />}

      {/* 히어로 */}
      <section className="mb-8 text-center">
        <h1 className="chrome-text mb-3 font-pixel text-2xl leading-relaxed sm:text-4xl">
          NUBE
        </h1>
        <p className="text-base text-ink/80 sm:text-lg">
          오늘의 기분을 기록하면, <br className="sm:hidden" />
          <span className="font-bold">그 감정에 어울리는 플레이리스트</span>가
          만들어져요
        </p>
        <p className="mt-1 font-pixel text-[9px] text-pink-deep/60">
          ✦ AI 감정분석 × 음악추천 5곡 ✦
        </p>
      </section>

      {/* 작성 폼 */}
      <form onSubmit={handleSubmit} className="y2k-panel space-y-5 p-5 sm:p-8">
        <div>
          <label className="mb-2 flex items-center gap-2 font-pixel text-[10px] text-pink-deep">
            <span className="sparkle">✎</span> TODAY&apos;S DIARY
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={6}
            className="y2k-input resize-none leading-relaxed"
          />
          <p className="mt-1 text-right text-xs text-pink-deep/50">
            {content.trim().length}자
          </p>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 font-pixel text-[10px] text-pink-deep">
            <span className="sparkle" style={{ animationDelay: "0.5s" }}>
              ♫
            </span>{" "}
            FAVORITE GENRE
          </label>
          <GenreSelect value={genre} onChange={setGenre} />
        </div>

        {error && (
          <div className="rounded-2xl border-2 border-red-300 bg-red-50/80 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="y2k-btn w-full text-base sm:text-lg"
        >
          <span className="sparkle">✦</span> 추천받기{" "}
          <span className="sparkle" style={{ animationDelay: "0.4s" }}>
            ✦
          </span>
        </button>

        {!canSubmit && (
          <p className="text-center text-xs text-pink-deep/50">
            일기와 장르를 모두 입력하면 추천을 받을 수 있어요
          </p>
        )}
      </form>
    </div>
  );
}
