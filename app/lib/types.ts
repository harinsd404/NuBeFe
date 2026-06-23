// 누베(Nube) 데이터 모델 — AGENTS.md §5 기준

export type EmotionLabel =
  | "행복 (Joy)"
  | "슬픔 (Sadness)"
  | "분노 (Anger)"
  | "평온 (Neutral)";

export interface Song {
  id: string;
  spotify_track_id: string;
  title: string;
  artist: string;
  genre: string;
  valence: number;
  energy: number;
  rank: number;
  distance: number;
}

export interface Diary {
  id: string;
  content: string;
  emotion_label: EmotionLabel;
  target_valence: number;
  target_energy: number;
  selected_genre: string;
  created_at: string; // ISO datetime
  recommendations: Song[];
}

export interface DiarySummary {
  id: string;
  content: string;
  emotion_label: EmotionLabel;
  created_at: string;
}

export interface DiaryCreate {
  content: string;
  selected_genre: string;
}

// 감정 라벨 → UI 테마 매핑 (AGENTS.md §5)
export interface EmotionTheme {
  label: EmotionLabel;
  emoji: string;
  short: string; // 한글 단어
  accent: string; // 메인 색
  soft: string; // 배경용 옅은 색
  glow: string; // 글로우/그림자 색
}

export const EMOTION_THEME: Record<EmotionLabel, EmotionTheme> = {
  "행복 (Joy)": {
    label: "행복 (Joy)",
    emoji: "😊",
    short: "행복",
    accent: "#FFB300",
    soft: "#FFF3C4",
    glow: "#FFD54F",
  },
  "슬픔 (Sadness)": {
    label: "슬픔 (Sadness)",
    emoji: "😢",
    short: "슬픔",
    accent: "#3B82F6",
    soft: "#DBEAFE",
    glow: "#93C5FD",
  },
  "분노 (Anger)": {
    label: "분노 (Anger)",
    emoji: "😤",
    short: "분노",
    accent: "#EF4444",
    soft: "#FEE2E2",
    glow: "#FCA5A5",
  },
  "평온 (Neutral)": {
    label: "평온 (Neutral)",
    emoji: "😌",
    short: "평온",
    accent: "#10B981",
    soft: "#D1FAE5",
    glow: "#6EE7B7",
  },
};

// 안전한 테마 조회 (알 수 없는 라벨 폴백)
export function getEmotionTheme(label: string): EmotionTheme {
  return (
    EMOTION_THEME[label as EmotionLabel] ?? {
      label: label as EmotionLabel,
      emoji: "🎵",
      short: label,
      accent: "#FF77CC",
      soft: "#FFE0F4",
      glow: "#FFB3E6",
    }
  );
}
