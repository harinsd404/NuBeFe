export default function LoadingOverlay({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-ice/80 to-pink/30 backdrop-blur-md">
      {/* 회전하는 CD */}
      <div className="relative h-32 w-32">
        <div
          className="cd-spin h-full w-full rounded-full border-4 border-white shadow-[0_0_30px_rgba(255,119,204,0.6)]"
          style={{
            background:
              "conic-gradient(from 0deg, #ff77cc, #c8a2ff, #7fe3ff, #d9ffff, #ff77cc)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white/90 text-xl">
            ♫
          </div>
        </div>
      </div>

      <p className="chrome-text font-pixel text-sm sm:text-base">
        {message ?? "당신의 감정을 분석하고 있어요..."}
      </p>
      <p className="font-pixel text-[9px] text-pink-deep/70">
        ✦ AI가 딱 맞는 음악을 고르는 중 ✦
      </p>
    </div>
  );
}
