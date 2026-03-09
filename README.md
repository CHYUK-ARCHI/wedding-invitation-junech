# wedding-invitation-junech

TypeScript 기반의 반응형 청첩장 웹페이지입니다.
모바일 우선(one-page) 구조이며, 방명록/갤러리 좋아요·댓글/계좌복사 같은 기본 상호작용이 포함되어 있습니다.

## 현재 업데이트 상황 요약
- 레이아웃: 모바일 우선 + 태블릿/데스크톱 반응형
- 인터랙션: 갤러리 좋아요/댓글, 방명록, 계좌번호 복사
- 테마: 라이트/다크 모드 토글 + 시스템 다크모드 자동 감지
- 데이터 저장: 별도 서버 없이 브라우저 `localStorage` 기반

## 이미지 파일 교체 방법
현재 메인 사진은 `assets/main-photo.svg`를 사용합니다.

### 1) 메인 이미지 바꾸기
1. 원하는 파일을 `assets/` 폴더에 넣기 (예: `assets/main-photo.jpg`)
2. `index.html`에서 아래 경로를 변경

```html
<img src="assets/main-photo.svg" alt="권찬혁 김주은 메인 사진" decoding="async" />
```

예시:

```html
<img src="assets/main-photo.jpg" alt="권찬혁 김주은 메인 사진" decoding="async" />
```

### 2) 갤러리/스토리/프로필 이미지 바꾸기
`index.html`의 `img src="..."` 경로를 원하는 실제 파일 경로로 바꾸면 됩니다.

팁:
- 파일명은 영문 소문자 + 하이픈 권장 (`our-story-01.jpg`)
- 비율 권장
  - 메인: 세로형 3:4 또는 4:5
  - 갤러리: 세로형 3:4
  - 스토리: 가로형 4:3

## 실행 방법
```bash
python3 -m http.server 4173
```
브라우저에서 `http://localhost:4173` 접속

## 타입 체크 / 빌드
```bash
tsc --noEmit
tsc
```

## 추후 발전사항(추천)
1. **백엔드 연동**: 방명록/좋아요/댓글을 DB에 저장해 모든 사용자에게 공유
2. **관리자 기능**: 방명록/댓글 삭제, 스팸 필터링
3. **이미지 최적화**: WebP/AVIF + `srcset`/`sizes` 적용
4. **성능/접근성 강화**: Lighthouse 기준 성능/접근성 점수 개선
5. **배포 자동화**: GitHub Actions로 main push 시 자동 배포


## 요청하신 5장 사진 배치 기준
현재 페이지는 아래 파일명을 기준으로 이미지가 연결되어 있습니다.
- `assets/photo-1.svg`
- `assets/photo-2.svg`
- `assets/photo-3.svg`
- `assets/photo-4.svg`
- `assets/photo-5.svg`

사용 방법:
1. 위 5개 파일을 동일한 이름의 실제 사진 파일(`.jpg` 또는 `.png`)로 교체
2. 확장자를 바꿨다면 `index.html`의 `src` 확장자도 함께 수정

권장 배치:
- `photo-3`: 메인 사진
- `photo-1`, `photo-4`: 신부/신랑 프로필
- `photo-2`, `photo-5`: 스토리/갤러리
