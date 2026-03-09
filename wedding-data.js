// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 웨딩 초대장 정보 설정 파일
// 이 파일만 수정하면 초대장 내용이 바뀝니다.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const WEDDING_DATA = {

  // ── 신부 정보 ──
  bride: {
    name: "김주은",
    nameEn: "June",
    parents: {
      father: { name: "김병순", relation: "신부 아버지" },
      mother: { name: "이금란", relation: "신부 어머니" },
    },
  },

  // ── 신랑 정보 ──
  groom: {
    name: "권찬혁",
    nameEn: "Chan",
    parents: {
      father: { name: "권오현", relation: "신랑 아버지" },
      mother: { name: "김현숙", relation: "신랑 어머니" },
    },
  },

  // ── 결혼식 일시/장소 ──
  wedding: {
    date: "2026년 6월 28일 일요일",
    time: "오전 11시",
    venueName: "서울대학교 이라운지",
    venueAddress: "서울 관악구 관악로 1",
    lat: 37.4589,
    lng: 126.9525,
  },

  // ── 계좌 정보 (account: "실제계좌번호"로 교체하세요) ──
  accounts: [
    // 신부측
    { side: "bride", role: "신부", name: "김주은",  bank: "신한",  account: "000-000-000000" },
    { side: "bride", role: "신부 아버지", name: "김병순", bank: "농협", account: "000-0000-0000-00" },
    { side: "bride", role: "신부 어머니", name: "이금란", bank: "국민", account: "000000-00-000000" },
    // 신랑측
    { side: "groom", role: "신랑", name: "권찬혁",  bank: "국민",  account: "000000-00-000000" },
    { side: "groom", role: "신랑 아버지", name: "권오현", bank: "신한", account: "000-000-000000" },
    { side: "groom", role: "신랑 어머니", name: "김현숙", bank: "우리", account: "0000-000-000000" },
  ],

  // ── 카카오페이 송금 링크 (실제 링크로 교체하세요) ──
  kakaopay: {
    bride: "https://qr.kakaopay.com/BRIDE_LINK_HERE",
    groom: "https://qr.kakaopay.com/GROOM_LINK_HERE",
  },

  // ── 카카오맵 JavaScript API 키 (https://developers.kakao.com 에서 발급) ──
  kakaoMapKey: "c00b4b806976cdd0faf033f948a1756f",

  // ── 갤러리 이미지 (assets/ 폴더 기준) ──
  gallery: [
    "assets/IMG_0963.webp",
    "assets/IMG_0966.webp",
    "assets/IMG_0981.webp",
    "assets/IMG_0982.webp",
    "assets/IMG_0983.webp",
    "assets/IMG_1007.webp",
  ],
};
