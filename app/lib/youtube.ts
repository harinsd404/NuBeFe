// YouTube 연동 유틸
// - 바로가기: API 키 없이도 검색 URL로 항상 동작
// - 미리보기(임베드): NEXT_PUBLIC_YOUTUBE_API_KEY 설정 시 정확한 영상 검색

const YT_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

// 미리보기(임베드) 기능 사용 가능 여부 (API 키 존재)
export const hasYouTubeApi = Boolean(YT_KEY);

// "제목 아티스트" 유튜브 검색 결과 페이지 URL
export function youtubeSearchUrl(title: string, artist: string): string {
  const q = encodeURIComponent(`${title} ${artist}`);
  return `https://www.youtube.com/results?search_query=${q}`;
}

// 특정 영상 시청 URL
export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

// YouTube Data API v3로 곡에 가장 잘 맞는 영상 ID 검색 (키 없으면 null)
export async function searchYouTubeVideoId(
  title: string,
  artist: string,
): Promise<string | null> {
  if (!YT_KEY) return null;
  const q = encodeURIComponent(`${title} ${artist} official audio`);
  const url =
    `https://www.googleapis.com/youtube/v3/search` +
    `?part=snippet&type=video&maxResults=1&videoEmbeddable=true&q=${q}&key=${YT_KEY}`;

  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data?.items?.[0]?.id?.videoId ?? null;
}
