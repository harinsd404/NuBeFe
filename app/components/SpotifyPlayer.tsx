export default function SpotifyPlayer({
  trackId,
  title,
  artist,
}: {
  trackId: string;
  title: string;
  artist: string;
}) {
  if (!trackId) {
    // 폴백: 트랙 ID가 없으면 텍스트만 표시
    return (
      <div className="rounded-2xl border-2 border-dashed border-pink/50 bg-white/60 p-4 text-sm text-pink-deep/70">
        🎵 {title} — {artist} (재생 정보를 불러올 수 없어요)
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-white shadow-[0_0_0_2px_rgba(127,227,255,0.5),0_6px_16px_rgba(127,227,255,0.35)]">
      <iframe
        title={`${title} - ${artist}`}
        src={`https://open.spotify.com/embed/track/${trackId}`}
        width="100%"
        height={80}
        frameBorder={0}
        allow="encrypted-media"
        loading="lazy"
        style={{ display: "block" }}
      />
    </div>
  );
}
