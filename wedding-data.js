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
    lat: 37.44881859503998,
    lng: 126.95106557589031,
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

  // ── 고정 텍스트 ──
  texts: {
    invitationNote: "서로에게 따뜻한 위로와 기쁨이 되어온 두 사람이<br />이제 평생을 함께 걸어가려 합니다.<br />저희의 시작이 되는 날, 소중한 걸음으로 오셔서<br />축복해 주시면 감사하겠습니다.",
    brideDesc: "김병순 · 이금란의 장녀",
    groomDesc: "권오현 · 김현숙의 차남",
    subway: "<b>2호선 낙성대역 ④출구</b><br />GS주유소 좌회전 → 관악02번 탑승 → 제2공학관 종점 하차<br /><br /><b>2호선 서울대입구역 ③출구</b><br />5511 · 5513번 탑승 → 제2공학관 종점 하차<br /><br /><b>신림선 관악산역 ①출구</b><br />정문 버스정거장 도보 → 5511 · 5516번 탑승 → 제2공학관 종점 하차",
    car: "내비게이션에 <b>이라운지 서울대점</b> 입력<br />주차 2시간 무료 (주차권 발급 필수)",
    parking: "이라운지 앞 · 302동 지상 · 300동 · 일방통행 구간 주차 라인<br />※ 전세버스는 이라운지 앞 정류장 하차 후 주차 별도 안내",
    atm: "이라운지 맞은편 302동 주차장 쪽<br />(신한 · 농협 ATM)<br />※ 주말 학내 카페는 대부분 휴무",
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
