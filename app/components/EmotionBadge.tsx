import { getEmotionTheme } from "../lib/types";

export default function EmotionBadge({
  label,
  size = "md",
}: {
  label: string;
  size?: "sm" | "md" | "lg";
}) {
  const t = getEmotionTheme(label);
  const pad =
    size === "lg"
      ? "px-4 py-2 text-lg"
      : size === "sm"
        ? "px-2.5 py-1 text-xs"
        : "px-3 py-1.5 text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-2 border-white font-bold ${pad}`}
      style={{
        background: `linear-gradient(180deg, #fff, ${t.soft})`,
        color: t.accent,
        boxShadow: `0 0 0 2px ${t.accent}55, 0 4px 12px ${t.glow}77, inset 0 1px 3px #fff`,
      }}
    >
      <span style={{ fontSize: "1.15em" }}>{t.emoji}</span>
      {label}
    </span>
  );
}
