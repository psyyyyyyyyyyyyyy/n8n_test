# 신년 이벤트 페이지

React + Vite로 만든 이벤트 페이지입니다. Supabase를 통해 페이지 방문수와 버튼 클릭률을 트래킹합니다.

## Supabase 설정

### 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 입력하세요:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Supabase 테이블 생성

Supabase SQL Editor에서 다음 SQL을 실행하세요:

```sql
-- 페이지 방문 기록 테이블
CREATE TABLE page_views (
  id BIGSERIAL PRIMARY KEY,
  page_url TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 버튼 클릭 기록 테이블
CREATE TABLE button_clicks (
  id BIGSERIAL PRIMARY KEY,
  button_name TEXT NOT NULL,
  page_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 이미지 저장 테이블 (n8n에서 전송용)
CREATE TABLE images (
  id BIGSERIAL PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  description TEXT,
  tags TEXT[],
  uploaded_by TEXT DEFAULT 'n8n',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책 설정 (익명 삽입 허용)
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE button_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts on page_views"
  ON page_views FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts on button_clicks"
  ON button_clicks FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts on images"
  ON images FOR INSERT
  TO anon
  WITH CHECK (true);

-- 통계 조회용 읽기 권한 (선택사항)
CREATE POLICY "Allow anonymous reads on page_views"
  ON page_views FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous reads on button_clicks"
  ON button_clicks FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous reads on images"
  ON images FOR SELECT
  TO anon
  USING (true);
```

### 3. Storage 버킷 생성 (이미지 파일 저장용)

Supabase 대시보드에서:

1. 왼쪽 메뉴 **Storage** 클릭
2. **New bucket** 클릭
3. 버킷 설정:
   - **Name**: `images`
   - **Public bucket**: ✅ 체크 (이미지를 공개 URL로 접근하려면)
4. **Create bucket** 클릭

그 다음 SQL Editor에서 Storage 정책 추가:

```sql
-- Storage 버킷 정책 (n8n에서 업로드 허용)
CREATE POLICY "Allow public uploads to images bucket"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow public reads from images bucket"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'images');
```

### 4. n8n에서 이미지 업로드 예시

n8n HTTP Request 노드 설정:

**이미지 파일 업로드 (Storage):**
```
POST https://[프로젝트URL]/storage/v1/object/images/[파일경로]
Headers:
  - apikey: [anon key]
  - Authorization: Bearer [anon key]
  - Content-Type: image/png (또는 image/jpeg)
Body: Binary (이미지 파일)
```

**이미지 메타데이터 저장 (Database):**
```
POST https://[프로젝트URL]/rest/v1/images
Headers:
  - apikey: [anon key]
  - Authorization: Bearer [anon key]
  - Content-Type: application/json
  - Prefer: return=representation
Body:
{
  "file_name": "event_banner.png",
  "file_path": "banners/event_banner.png",
  "file_url": "https://[프로젝트URL]/storage/v1/object/public/images/banners/event_banner.png",
  "file_size": 102400,
  "mime_type": "image/png",
  "description": "신년 이벤트 배너",
  "tags": ["event", "banner", "2026"]
}
```

### 5. 통계 확인

Supabase 대시보드 또는 SQL로 통계를 확인할 수 있습니다:

```sql
-- 총 페이지 방문수
SELECT COUNT(*) as total_views FROM page_views;

-- 총 참여 버튼 클릭수
SELECT COUNT(*) as total_clicks FROM button_clicks WHERE button_name = 'participate';

-- 클릭률 계산
SELECT 
  (SELECT COUNT(*) FROM button_clicks WHERE button_name = 'participate')::FLOAT / 
  NULLIF((SELECT COUNT(*) FROM page_views), 0) * 100 as click_rate_percent;

-- 일별 방문수
SELECT DATE(created_at) as date, COUNT(*) as views 
FROM page_views 
GROUP BY DATE(created_at) 
ORDER BY date DESC;
```

---

## 기술 스택

- React 19
- Vite 7
- Supabase (데이터베이스 & 인증)

## 개발 서버 실행

```bash
npm install
npm run dev
```

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
