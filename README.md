# wedding-invitation-junech

TypeScript 기반의 반응형 청첩장 웹페이지입니다.
`emily-marries-anthony.com`의 미니멀/세리프 톤을 참고해 전체 디자인 구조를 구성했습니다.

## 구현 포인트
- 모바일 우선(one-page) 레이아웃
- 커버/초대문/신랑신부/일정/갤러리/오시는 길/계좌/RSVP 섹션 구성
- 이미지 영역은 모두 placeholder(빈칸)
- RSVP 전송은 WE-thing-Server 스타일의 REST 엔드포인트 구조 반영
- UI 동작 로직을 TypeScript(`main.ts`)로 작성

## 파일 구조
- `index.html`: 페이지 마크업
- `styles.css`: Emily 레퍼런스 톤의 스타일
- `main.ts`: 타입이 포함된 클라이언트 로직
- `main.js`: TypeScript 컴파일 결과물
- `tsconfig.json`: TypeScript 설정

## API 연동(예시)
`main.ts`의 `APP_CONFIG.api`를 실제 서버 주소로 바꾸면 RSVP 연동 가능:

```ts
api: {
  baseUrl: "https://api.your-domain.com",
  rsvpEndpoint: "/api/v1/invitations/rsvp",
}
```

## 실행
```bash
python3 -m http.server 4173
```

## 타입 체크 / 빌드
```bash
tsc --noEmit
tsc
```
