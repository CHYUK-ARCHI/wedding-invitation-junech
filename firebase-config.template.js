// firebase-config.js 설정 가이드
// 이 파일을 복사해서 firebase-config.js 로 저장하고 아래 값을 채워주세요.
// firebase-config.js 는 gitignore 처리되어 GitHub에 올라가지 않습니다.
//
// Firebase 설정 방법:
// 1. https://console.firebase.google.com 접속
// 2. 프로젝트 생성 → Firestore Database 생성 (프로덕션 모드)
// 3. 프로젝트 설정 → 내 앱 → 웹 앱 추가 → 아래 설정값 복사
// 4. Firestore 규칙 설정 (아래 참고)
//
// Firestore 보안 규칙:
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /guestbook/{docId} {
//       allow read, create: if true;
//       allow delete: if true;
//     }
//   }
// }

const FIREBASE_CONFIG = {
  apiKey: "여기에_API_KEY",
  authDomain: "여기에_PROJECT_ID.firebaseapp.com",
  projectId: "여기에_PROJECT_ID",
  storageBucket: "여기에_PROJECT_ID.appspot.com",
  messagingSenderId: "여기에_SENDER_ID",
  appId: "여기에_APP_ID"
};

// 방명록 삭제용 관리자 키 — 본인만 아는 문자열로 설정
// 사용법: 청첩장 URL 뒤에 ?admin=여기설정한값 을 붙이면 삭제 버튼 표시
// 예) https://your-site.com/?admin=june0628
const WEDDING_ADMIN_KEY = "여기에_관리자키";
