# 권찬혁 · 김주은 결혼 청첩장

2026년 6월 28일 일요일 오전 11시  
서울대학교 이라운지

---

## 파일 구조

```
├── index.html          # 청첩장 메인 (한국어)
├── index-en.html       # 청첩장 영문
├── styles.css          # 스타일
├── main.js             # 기능 (지도, 방명록, 갤러리 등)
├── wedding-data.js     # 날짜, 장소, 계좌 정보
├── config.js           # GitHub 토큰 설정 (gitignore — 로컬 전용)
├── admin.html          # 방명록 관리 페이지
└── assets/             # 갤러리 이미지
```

---

## 방명록 관리

방명록은 GitHub Issues를 저장소로 사용합니다.  
메시지를 모아서 보려면 **admin.html**을 열어주세요.

### admin.html 사용법

1. 브라우저에서 `admin.html` 열기  
   (로컬 파일 또는 GitHub Pages 배포 후 접속)
2. Repository: `CHYUK-ARCHI/wedding-invitation-junech` (자동 입력됨)
3. [GitHub Personal Access Token](https://github.com/settings/tokens) 발급 후 입력  
   - 권한: `repo` (read)
4. **불러오기** 클릭

> 활성 메시지 / 숨김 메시지(닫힌 이슈)를 구분해서 볼 수 있습니다.

### 방명록 삭제 방법

GitHub Issues에서 해당 이슈를 **Close**하면 청첩장 화면에서 사라집니다.  
`github.com/CHYUK-ARCHI/wedding-invitation-junech/issues`

---

## GitHub 방명록 활성화 (config.js 설정)

현재는 localStorage 모드입니다.  
GitHub Issues 모드로 전환하려면 `config.js` 파일을 아래와 같이 생성하세요.  
(**이 파일은 절대 커밋하지 마세요. gitignore에 포함되어 있습니다.**)

```js
// config.js — 로컬 전용, 커밋 금지
const WEDDING_CONFIG = {
  repo: "CHYUK-ARCHI/wedding-invitation-junech",
  token: "ghp_여기에_토큰_입력"
};
```

---

## 계좌 정보 수정

`wedding-data.js`의 `accounts` 배열을 수정합니다.

```js
accounts: [
  { side: "bride", role: "신부",       name: "김주은",  bank: "농협",     account: "1088-12-046488" },
  { side: "bride", role: "신부 아버지", name: "김병순",  bank: "신한",     account: "110-019-817811" },
  { side: "bride", role: "신부 어머니", name: "이금란",  bank: "토스뱅크", account: "1000-0594-7877" },
  { side: "groom", role: "신랑",       name: "권찬혁",  bank: "우리",     account: "1002-652-978849" },
  { side: "groom", role: "신랑 아버지", name: "권오현",  bank: "농협",     account: "312-0220-7204-21" },
  { side: "groom", role: "신랑 어머니", name: "김현숙",  bank: "하나",     account: "127-211128-00108" },
]
```
