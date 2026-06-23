// target_valence / target_energy 를 2D 좌표로 시각화 (AGENTS.md §3.2)
export default function EmotionMap({
  valence,
  energy,
  accent,
}: {
  valence: number;
  energy: number;
  accent: string;
}) {
  const x = Math.max(0, Math.min(1, valence)) * 100;
  const y = (1 - Math.max(0, Math.min(1, energy))) * 100; // 위쪽이 에너지 높음

  return (
    <div className="y2k-card p-4">
      <div className="mb-3 flex items-center justify-between font-pixel text-[8px] text-pink-deep">
        <span>EMOTION MAP</span>
        <span>
          V {valence.toFixed(2)} · E {energy.toFixed(2)}
        </span>
      </div>
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border-2 border-white bg-gradient-to-br from-ice/60 via-white to-pink/20">
        {/* 격자선 */}
        <div className="absolute left-1/2 top-0 h-full w-px bg-pink/20" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-pink/20" />

        {/* 축 라벨 */}
        <span className="absolute left-1/2 top-1 -translate-x-1/2 text-[9px] text-pink-deep/60">
          ↑ 에너지
        </span>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] text-pink-deep/60">
          차분
        </span>
        <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] text-pink-deep/60">
          부정
        </span>
        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-pink-deep/60">
          긍정
        </span>

        {/* 감정 좌표 점 */}
        <div
          className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            background: accent,
            boxShadow: `0 0 0 4px ${accent}44, 0 0 18px ${accent}`,
          }}
        >
          <span className="absolute inset-0 animate-ping rounded-full" style={{ background: `${accent}55` }} />
        </div>
      </div>
    </div>
  );
}
