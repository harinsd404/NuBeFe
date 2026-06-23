import type { Song } from "../lib/types";
import SpotifyPlayer from "./SpotifyPlayer";
import YouTubeBox from "./YouTubeBox";

// distance(작을수록 적합)를 0~100% 매칭도로 환산 (대략적 시각화)
function matchPercent(distance: number): number {
  const pct = Math.round((1 - Math.min(distance, 1)) * 100);
  return Math.max(0, Math.min(100, pct));
}

const RANK_MEDAL = ["🥇", "🥈", "🥉", "④", "⑤"];

export default function SongCard({ song }: { song: Song }) {
  const match = matchPercent(song.distance);

  return (
    <article className="y2k-card p-4 sm:p-5">
      <div className="mb-3 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gradient-to-b from-white to-ice text-lg shadow-[0_0_0_2px_rgba(255,119,204,0.4)]">
          {RANK_MEDAL[song.rank - 1] ?? song.rank}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-ink sm:text-lg">
            {song.title}
          </h3>
          <p className="truncate text-sm text-pink-deep/80">{song.artist}</p>
        </div>
        <span className="shrink-0 rounded-full border-2 border-white bg-white/70 px-2.5 py-1 font-pixel text-[8px] text-pink-deep">
          {song.genre}
        </span>
      </div>

      {/* 매칭도 게이지 */}
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between font-pixel text-[8px] text-pink-deep/80">
          <span>MATCH</span>
          <span>{match}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full border border-white bg-white/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-ice-deep via-lilac to-pink transition-all"
            style={{ width: `${match}%` }}
          />
        </div>
      </div>

      <SpotifyPlayer
        trackId={song.spotify_track_id}
        title={song.title}
        artist={song.artist}
      />

      <YouTubeBox title={song.title} artist={song.artist} />
    </article>
  );
}
