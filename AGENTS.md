# ☁️ 누베(Nube) 프론트엔드 명세서 (Frontend Specification)

> 감정 일기 기반 초개인화 음악 추천 서비스 '누베(Nube)'의 프론트엔드 구현을 위한 명세서입니다.
> 본 문서는 실제 백엔드 구현(FastAPI)을 기준으로 작성되었으며, 화면 구성·API 연동·데이터 모델·사용자 흐름을 정의합니다.

---

## 1. 서비스 개요

사용자가 오늘의 감정을 일기로 적고 선호 장르를 고르면, AI가 일기에서 감정을 분석해 그 기분에 가장 잘 맞는 **음악 5곡을 추천**해주는 서비스입니다.

- **핵심 가치**: "오늘의 기분을 기록하면, 그 감정에 어울리는 플레이리스트가 만들어진다."
- **사용자 식별 없음**: 로그인/회원가입 과정이 없습니다. 누구나 바로 일기를 작성하고 추천을 받을 수 있습니다.
- **추천 결과 재생**: 추천된 곡은 Spotify 임베드 위젯으로 화면 안에서 바로 미리듣기/재생합니다.

---

## 2. 기술 연동 정보

| 항목                     | 값                           |
| :----------------------- | :--------------------------- |
| Backend 프레임워크       | FastAPI (Python)             |
| 기본 API Base URL (로컬) | `http://localhost:8000`      |
| 응답 포맷                | JSON                         |
| 인증                     | 없음 (토큰/세션 불필요)      |
| API 문서(Swagger)        | `http://localhost:8000/docs` |
| 음악 재생                | Spotify Iframe Embed Widget  |

> ⚠️ CORS: 프론트엔드를 별도 포트(예: Vite `5173`, Next `3000`)에서 띄울 경우, 백엔드에 `CORSMiddleware` 설정이 필요합니다. 현재 `main.py`에는 CORS 미들웨어가 없으므로 백엔드 담당자와 협의해 추가해야 합니다.

---

## 3. 화면(페이지) 구성

### 3.1. 일기 작성 화면 (Home / Write)

서비스의 메인 진입점입니다.

**구성 요소**

- 일기 입력 텍스트영역 (multiline, placeholder 예: "오늘 하루는 어땠나요?")
- 선호 장르 선택 (드롭다운 또는 검색형 셀렉트 — 장르 목록은 §6 참고)
- "추천받기" 제출 버튼
- 제출 시 로딩 상태 표시 (AI 감정 분석 + 추천 연산에 수 초 소요될 수 있음)

**동작**

- 제출 → `POST /diary` 호출 → 응답으로 받은 일기 + 추천 5곡을 **결과 화면**으로 전달/렌더링

### 3.2. 추천 결과 화면 (Result / Diary Detail)

일기 작성 직후, 또는 아카이브에서 특정 일기를 눌렀을 때 보이는 화면입니다.

**구성 요소**

- 작성한 일기 내용 (`content`)
- 분석된 감정 라벨 뱃지 (`emotion_label`, 예: "행복 (Joy)") — 감정별 색상/이모지 매핑 권장 (§5)
- (선택) 감정 좌표 시각화: `target_valence`, `target_energy`를 2D 좌표/게이지로 표현
- 추천 곡 리스트 (1위~5위, `rank` 순 정렬)
  - 곡 제목, 아티스트, 장르
  - `distance` 값(감정과의 근접도) — "매칭도"로 환산해 표시 가능 (작을수록 가까움)
  - **Spotify 임베드 플레이어** (각 곡의 `spotify_track_id` 사용, §7)
- 작성 시각 (`created_at`)

### 3.3. 아카이브 화면 (Archive)

과거에 작성된 모든 일기를 모아 보는 화면입니다.

**구성 요소**

- 일기 카드 목록 (최근 작성 순으로 정렬되어 내려옴)
  - 각 카드: 감정 라벨 뱃지, 일기 내용 미리보기(말줄임), 작성 날짜
- 카드 클릭 → 해당 `id`로 **추천 결과 화면**(3.2)으로 이동 (`GET /diary/{diary_id}`)

> 참고: `/archive` 응답에는 추천 곡 목록이 **포함되지 않습니다**(요약만 반환). 곡 목록은 카드 클릭 시 `GET /diary/{diary_id}`로 별도 조회합니다.

---

## 4. API 명세 (실제 구현 기준)

### 4.1. `POST /diary` — 일기 작성 및 음악 추천

일기와 장르를 받아 감정 분석 → KNN 추천을 수행하고, 결과를 저장 후 반환합니다.

- **요청 본문**

```json
{
  "content": "오늘 너무 피곤하고 지치는 하루였어...",
  "selected_genre": "indie"
}
```

- **성공 응답: `201 Created`**

```json
{
  "id": "uuid-string",
  "content": "오늘 너무 피곤하고 지치는 하루였어...",
  "emotion_label": "슬픔 (Sadness)",
  "target_valence": 0.2,
  "target_energy": 0.2,
  "selected_genre": "indie",
  "created_at": "2026-06-23T10:00:00",
  "recommendations": [
    {
      "id": "uuid-string",
      "spotify_track_id": "5SuOikwiRyPMVoIQDJUgSV",
      "title": "곡 제목",
      "artist": "아티스트명",
      "genre": "indie",
      "valence": 0.21,
      "energy": 0.19,
      "rank": 1,
      "distance": 0.014
    }
    // ... 최대 5곡, rank 1~5
  ]
}
```

- **실패 응답: `404 Not Found`** — 추천할 곡 데이터가 없을 때

```json
{
  "detail": "추천할 음악 데이터를 찾을 수 없습니다. 데이터베이스를 확인해 주세요."
}
```

### 4.2. `GET /diary/{diary_id}` — 특정 일기 + 추천 기록 조회

- **경로 변수**: `diary_id` (UUID)
- **성공 응답: `200 OK`** — 형식은 `POST /diary` 응답과 동일 (`recommendations` 포함)
- **실패 응답: `404 Not Found`**

```json
{ "detail": "요청하신 ID의 일기를 찾을 수 없습니다." }
```

### 4.3. `GET /archive` — 전체 일기 요약 목록 조회

- **성공 응답: `200 OK`** — 최근 작성 순 배열, 각 항목은 **요약 정보만** 포함

```json
[
  {
    "id": "uuid-string",
    "content": "오늘 너무 피곤하고...",
    "emotion_label": "슬픔 (Sadness)",
    "created_at": "2026-06-23T10:00:00"
  }
]
```

### 4.4. `GET /` — 헬스 체크

```json
{ "message": "Nube API" }
```

---

## 5. 데이터 모델 (프론트 타입 정의 참고)

### DiaryCreate (요청)

| 필드             | 타입   | 필수 | 설명                        |
| :--------------- | :----- | :--: | :-------------------------- |
| `content`        | string |  ✅  | 일기 본문 텍스트            |
| `selected_genre` | string |  ✅  | 선택 장르 (소문자 권장, §6) |

### SongResponse (추천 곡)

| 필드               | 타입            | 설명                                        |
| :----------------- | :-------------- | :------------------------------------------ |
| `id`               | UUID            | 곡 내부 ID                                  |
| `spotify_track_id` | string          | Spotify 트랙 ID (임베드에 사용)             |
| `title`            | string          | 곡 제목                                     |
| `artist`           | string          | 아티스트명                                  |
| `genre`            | string          | 장르                                        |
| `valence`          | float (0.0~1.0) | 곡의 긍정/부정 정서                         |
| `energy`           | float (0.0~1.0) | 곡의 에너지/강렬함                          |
| `rank`             | int (1~5)       | 추천 순위                                   |
| `distance`         | float           | 감정 좌표와의 유클리드 거리 (작을수록 적합) |

### DiaryResponse (일기 상세)

`id`(UUID), `content`, `emotion_label`, `target_valence`(float), `target_energy`(float), `selected_genre`, `created_at`(ISO datetime), `recommendations`(SongResponse 배열)

### DiarySummaryResponse (아카이브 항목)

`id`(UUID), `content`, `emotion_label`, `created_at`(ISO datetime)

### 감정 라벨 (emotion_label) — 4종 고정값

프론트에서 색상/이모지 매핑에 활용하세요. (target 좌표는 백엔드에서 자동 계산되어 내려옵니다.)

| 라벨 값          | Valence | Energy | 추천 UI 톤 (예시)        |
| :--------------- | :-----: | :----: | :----------------------- |
| `행복 (Joy)`     |   0.8   |  0.7   | 밝은 노랑/오렌지, 😊     |
| `슬픔 (Sadness)` |   0.2   |  0.2   | 차분한 블루, 😢          |
| `분노 (Anger)`   |   0.3   |  0.8   | 강렬한 레드, 😤          |
| `평온 (Neutral)` |   0.5   |  0.4   | 부드러운 그린/그레이, 😌 |

---

## 6. 장르(selected_genre) 입력 처리

- 백엔드는 장르 필터링 시 **대소문자를 구분하지 않습니다**(`ILIKE`). 다만 일관성을 위해 **소문자 영문 값** 전달을 권장합니다.
- 데이터셋에는 **114개 장르**가 존재합니다. 전부 노출하기보다 자주 쓰이는 장르를 우선 노출하거나 검색형 셀렉트 사용을 권장합니다.
- 대표 장르 예시: `acoustic`, `pop`, `k-pop`, `indie`, `rock`, `hip-hop`, `jazz`, `classical`, `r-n-b`, `edm`, `dance`, `ambient`, `chill`, `electronic`, `folk`, `metal`, `blues`, `disco`, `house`, `study`, `sad`, `happy` 등.
- **폴백 동작 안내**: 선택 장르에 곡이 5곡 미만이면 백엔드가 전체 곡 풀에서 추천합니다. 즉 추천된 곡의 `genre`가 선택 장르와 다를 수 있으니, 결과 화면에서는 각 곡의 실제 `genre`를 함께 표시하세요.

---

## 7. Spotify 임베드 위젯 연동

추천 곡의 `spotify_track_id`를 사용해 iframe으로 플레이어를 렌더링합니다.

```html
<iframe
  src="https://open.spotify.com/embed/track/{spotify_track_id}"
  width="100%"
  height="80"
  frameborder="0"
  allow="encrypted-media"
  loading="lazy"
>
</iframe>
```

- `height="80"`은 컴팩트 플레이어, `height="152"` 이상은 앨범아트 포함 카드형입니다.
- 곡이 Spotify에서 제공되지 않는 경우 빈 플레이어가 나올 수 있으니, 곡 제목/아티스트 텍스트를 항상 함께 표시해 폴백 정보를 제공하세요.

---

## 8. 핵심 사용자 흐름 (User Flow)

```
[일기 작성 화면]
   │  content + selected_genre 입력
   │  "추천받기" 클릭
   ▼
POST /diary  ──(로딩: 감정분석 + KNN)──►  201 응답(일기 + 추천 5곡)
   │
   ▼
[추천 결과 화면]  ◄── 감정 라벨 뱃지 + Spotify 플레이어 5개 렌더
   │
   │  (상단 메뉴) "아카이브" 이동
   ▼
[아카이브 화면]  ◄── GET /archive (요약 목록)
   │  카드 클릭
   ▼
GET /diary/{id}  ──►  [추천 결과 화면] 재방문
```

---

## 9. 상태 처리 / 예외 UX 가이드

| 상황                               | 권장 UX                                                     |
| :--------------------------------- | :---------------------------------------------------------- |
| 추천 연산 대기                     | 스피너 + "당신의 감정을 분석하고 있어요..." 류 안내 메시지  |
| `content` 빈 값                    | 제출 버튼 비활성화 또는 인라인 검증 메시지 (프론트 단 검증) |
| 장르 미선택                        | 동일하게 프론트 단 검증                                     |
| `404` (곡 데이터 없음 / 일기 없음) | "추천 결과를 찾을 수 없어요" 안내 + 작성 화면 복귀 버튼     |
| 네트워크/`500` 오류                | "잠시 후 다시 시도해주세요" 토스트 + 재시도 버튼            |
| 아카이브 빈 목록                   | "아직 작성한 일기가 없어요" 빈 상태(empty state) UI         |

---

## 10. 구현 권장 사항 (선택)

- **프레임워크**: React(Vite) 또는 Next.js + TypeScript 권장. 위 데이터 모델을 그대로 TS 타입으로 정의하면 됩니다.
- **API 클라이언트**: `fetch`/`axios` + (선택) React Query로 `/archive` 캐싱.
- **반응형**: 모바일 우선. 일기 작성·플레이어가 핵심이라 모바일 뷰포트에서의 가독성을 우선하세요.
- **환경 변수**: `VITE_API_BASE_URL` 등으로 Base URL을 분리해 로컬/배포 전환을 용이하게 하세요.

```ts
// 예시 타입
type EmotionLabel =
  | "행복 (Joy)"
  | "슬픔 (Sadness)"
  | "분노 (Anger)"
  | "평온 (Neutral)";

interface Song {
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

interface Diary {
  id: string;
  content: string;
  emotion_label: EmotionLabel;
  target_valence: number;
  target_energy: number;
  selected_genre: string;
  created_at: string; // ISO
  recommendations: Song[];
}

interface DiarySummary {
  id: string;
  content: string;
  emotion_label: EmotionLabel;
  created_at: string;
}
```
