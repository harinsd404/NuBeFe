import type { Diary, DiaryCreate, DiarySummary } from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = `요청에 실패했어요 (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
      /* JSON 파싱 실패 시 기본 메시지 사용 */
    }
    throw new ApiError(res.status, detail);
  }
  return res.json() as Promise<T>;
}

// POST /diary — 일기 작성 및 음악 추천
export async function createDiary(payload: DiaryCreate): Promise<Diary> {
  const res = await fetch(`${BASE_URL}/diary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle<Diary>(res);
}

// GET /diary/{id} — 특정 일기 + 추천 기록 조회
export async function getDiary(id: string): Promise<Diary> {
  const res = await fetch(`${BASE_URL}/diary/${id}`, { cache: "no-store" });
  return handle<Diary>(res);
}

// GET /archive — 전체 일기 요약 목록
export async function getArchive(): Promise<DiarySummary[]> {
  const res = await fetch(`${BASE_URL}/archive`, { cache: "no-store" });
  return handle<DiarySummary[]>(res);
}
