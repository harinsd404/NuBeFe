"use client";

import { useState } from "react";
import {
  hasYouTubeApi,
  searchYouTubeVideoId,
  youtubeSearchUrl,
  youtubeWatchUrl,
} from "../lib/youtube";

export default function YouTubeBox({
  title,
  artist,
}: {
  title: string;
  artist: string;
}) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const searchUrl = youtubeSearchUrl(title, artist);
  // 영상 ID를 찾았으면 정확한 영상으로, 아니면 검색 결과로 바로가기
  const linkUrl = videoId ? youtubeWatchUrl(videoId) : searchUrl;

  async function togglePreview() {
    if (open) {
      setOpen(false);
      return;
    }
    if (videoId) {
      setOpen(true);
      return;
    }
    setLoading(true);
    setFailed(false);
    try {
      const id = await searchYouTubeVideoId(title, artist);
      if (id) {
        setVideoId(id);
        setOpen(true);
      } else {
        setFailed(true);
      }
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* 유튜브 바로가기 (API 키 없어도 항상 동작) */}
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-white bg-gradient-to-b from-[#ff5b6e] to-[#e60023] px-3 py-1.5 font-pixel text-[9px] text-white shadow-[0_0_0_2px_rgba(230,0,35,0.4),0_4px_10px_rgba(230,0,35,0.35)] transition-transform active:translate-y-0.5"
        >
          ▶ YOUTUBE
        </a>

        {/* 미리보기 토글 (API 키 있을 때만) */}
        {hasYouTubeApi && (
          <button
            type="button"
            onClick={togglePreview}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-white bg-white/70 px-3 py-1.5 font-pixel text-[9px] text-pink-deep transition-colors hover:bg-ice disabled:opacity-50"
          >
            {loading ? "불러오는 중..." : open ? "미리보기 닫기" : "미리보기"}
          </button>
        )}
      </div>

      {failed && (
        <p className="mt-1.5 font-pixel text-[8px] text-pink-deep/60">
          미리보기를 찾지 못했어요. 바로가기로 확인해 주세요.
        </p>
      )}

      {open && videoId && (
        <div className="mt-2 overflow-hidden rounded-2xl border-2 border-white shadow-[0_0_0_2px_rgba(230,0,35,0.35),0_6px_16px_rgba(230,0,35,0.25)]">
          <iframe
            title={`${title} - ${artist} (YouTube)`}
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            width="100%"
            height={152}
            frameBorder={0}
            allow="encrypted-media; picture-in-picture; clipboard-write"
            allowFullScreen
            loading="lazy"
            style={{ display: "block" }}
          />
        </div>
      )}
    </div>
  );
}
