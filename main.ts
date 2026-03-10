/* global WEDDING_CONFIG, WEDDING_DATA */

// ─── Types ───────────────────────────────────────────────────────────────────

interface TransferAccount {
  side?: string;
  role: string;
  name?: string;
  bank: string;
  account: string;
  holder?: string;
}

interface GuestbookEntry {
  id: number | string;
  name: string;
  message: string;
  createdAt: string;
}

interface WeddingConfig {
  repo?: string;
  token?: string;
}

interface WeddingDataType {
  bride?: { name: string; nameEn: string; parents?: { father: { name: string; relation: string }; mother: { name: string; relation: string } } };
  groom?: { name: string; nameEn: string; parents?: { father: { name: string; relation: string }; mother: { name: string; relation: string } } };
  wedding?: { date: string; time: string; venueName: string; venueAddress: string; lat: number; lng: number };
  accounts?: TransferAccount[];
  kakaopay?: { bride: string; groom: string };
  kakaoMapKey?: string;
  gallery?: string[];
}

declare const WEDDING_CONFIG: WeddingConfig | undefined;
declare const WEDDING_DATA: WeddingDataType | undefined;

// ─── Config ──────────────────────────────────────────────────────────────────

const WD: WeddingDataType | null = (typeof WEDDING_DATA !== 'undefined') ? WEDDING_DATA : null;

const APP_CONFIG = {
  weddingDate: (() => {
    if (WD?.wedding?.date && WD?.wedding?.time) {
      const dateStr = WD.wedding.date.replace(/년\s*/g, '-').replace(/월\s*/g, '-').replace(/일.*/, '').trim();
      const timeStr = WD.wedding.time.replace('오전 ', '').replace('시', ':00');
      const d = new Date(`${dateStr}T${timeStr}:00+09:00`);
      if (!isNaN(d.getTime())) return d;
    }
    return new Date("2026-06-28T11:00:00+09:00");
  })(),
  transfer: WD?.accounts || [
    { role: "신부측", bank: "신한", account: "000-000-000000", holder: "김주은" },
    { role: "신랑측", bank: "국민", account: "000000-00-000000", holder: "권찬혁" },
  ] as TransferAccount[],
};

const GITHUB_CONFIG = (() => {
  try {
    const cfg = typeof WEDDING_CONFIG !== "undefined" ? WEDDING_CONFIG : undefined;
    if (cfg?.repo && cfg?.token && cfg.token !== "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN_HERE") {
      return { repo: cfg.repo, token: cfg.token, enabled: true };
    }
  } catch (_) {
    /* no-op */
  }
  return { repo: "", token: "", enabled: false };
})();

const GUESTBOOK_LABEL = "방명록";

// ─── DOM Refs ─────────────────────────────────────────────────────────────────

const root = document.documentElement;
const guestbookForm = document.getElementById("guestbook-form") as HTMLFormElement;
const guestbookList = document.getElementById("guestbook-list") as HTMLUListElement;
const formStatus = document.getElementById("form-status") as HTMLParagraphElement;
const submitBtn = document.getElementById("guestbook-submit") as HTMLButtonElement;
const toastEl = document.getElementById("toast") as HTMLDivElement;
const lightbox = document.getElementById("lightbox") as HTMLDivElement;
const lightboxImg = document.getElementById("lightbox-img") as HTMLImageElement;
const lightboxCounter = document.getElementById("lightbox-counter") as HTMLSpanElement;
const lightboxClose = document.getElementById("lightbox-close") as HTMLButtonElement;
const lightboxPrev = document.getElementById("lightbox-prev") as HTMLButtonElement;
const lightboxNext = document.getElementById("lightbox-next") as HTMLButtonElement;

// ─── Toast ───────────────────────────────────────────────────────────────────

let toastTimer: ReturnType<typeof setTimeout> | null = null;

const showToast = (msg: string): void => {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2500);
};

// ─── Theme (시스템 설정 자동 적용) ───────────────────────────────────────────

const initializeTheme = (): void => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = prefersDark ? "dark" : "light";
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
    root.dataset.theme = e.matches ? "dark" : "light";
  });
};

// ─── Countdown ───────────────────────────────────────────────────────────────

const pad = (n: number): string => String(n).padStart(2, "0");

const updateCountdown = (): void => {
  const now = Date.now();
  const diff = APP_CONFIG.weddingDate.getTime() - now;

  if (diff <= 0) {
    document.getElementById("cd-days")!.textContent = "🎉";
    document.getElementById("cd-hours")!.textContent = "00";
    document.getElementById("cd-mins")!.textContent = "00";
    document.getElementById("cd-secs")!.textContent = "00";
    return;
  }

  const totalSecs = Math.floor(diff / 1000);
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  document.getElementById("cd-days")!.textContent = String(days);
  document.getElementById("cd-hours")!.textContent = pad(hours);
  document.getElementById("cd-mins")!.textContent = pad(mins);
  document.getElementById("cd-secs")!.textContent = pad(secs);
};

updateCountdown();
setInterval(updateCountdown, 1000);

// ─── Accounts ────────────────────────────────────────────────────────────────

const renderAccounts = (): void => {
  const accounts = WD?.accounts || APP_CONFIG.transfer;

  (['bride', 'groom'] as const).forEach(side => {
    const box = document.getElementById(`account-${side}`);
    if (!box) return;
    const items = accounts.filter(a => a.side === side);
    box.innerHTML = items.map(a => `
      <div class="account-item">
        <div class="account-info">
          <span class="account-role">${a.role}</span>
          <span class="account-name">${a.name || ''}</span>
          <span class="account-bank">${a.bank}</span>
          <span class="account-number">${a.account}</span>
        </div>
        <button class="copy-btn" data-copy="${a.account}" aria-label="계좌번호 복사">복사</button>
      </div>
    `).join('');
  });

  // 카카오페이 링크
  const bridePay = document.getElementById('kakaopay-bride') as HTMLAnchorElement | null;
  const groomPay = document.getElementById('kakaopay-groom') as HTMLAnchorElement | null;
  if (bridePay && WD?.kakaopay?.bride) bridePay.href = WD.kakaopay.bride;
  if (groomPay && WD?.kakaopay?.groom) groomPay.href = WD.kakaopay.groom;
};

// 탭 전환
document.querySelectorAll<HTMLButtonElement>('.account-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.account-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const side = tab.dataset.side;
    document.querySelectorAll('.account-scroll-box').forEach(box => box.classList.add('hidden'));
    document.getElementById(`account-${side}`)?.classList.remove('hidden');
  });
});

// ─── Gallery Slider ───────────────────────────────────────────────────────────

const GALLERY_IMAGES: string[] = WD?.gallery || [
  "assets/IMG_0963.webp",
  "assets/IMG_0966.webp",
  "assets/IMG_0981.webp",
  "assets/IMG_0982.webp",
  "assets/IMG_0983.webp",
  "assets/IMG_1007.webp",
];

let sliderIndex = 0;

const updateSlider = (idx: number): void => {
  sliderIndex = (idx + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
  const mainImg = document.getElementById("gs-main-img") as HTMLImageElement | null;
  const counter = document.getElementById("gs-counter");
  if (mainImg) mainImg.src = GALLERY_IMAGES[sliderIndex];
  if (counter) counter.textContent = `${sliderIndex + 1} / ${GALLERY_IMAGES.length}`;

  document.querySelectorAll<HTMLElement>(".gallery-thumb").forEach((thumb, i) => {
    thumb.classList.toggle("active", i === sliderIndex);
  });
};

const initGallerySlider = (): void => {
  const prevBtn = document.getElementById("gs-prev");
  const nextBtn = document.getElementById("gs-next");

  prevBtn?.addEventListener("click", () => updateSlider(sliderIndex - 1));
  nextBtn?.addEventListener("click", () => updateSlider(sliderIndex + 1));

  document.querySelectorAll<HTMLElement>(".gallery-thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const idx = parseInt(thumb.dataset.idx ?? "0", 10);
      updateSlider(idx);
    });
  });

  // 터치 스와이프
  const mainEl = document.getElementById("gallery-main");
  if (mainEl) {
    let touchStartX = 0;
    mainEl.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    mainEl.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        updateSlider(sliderIndex + (dx < 0 ? 1 : -1));
      }
    }, { passive: true });
  }
};

// ─── Lightbox ────────────────────────────────────────────────────────────────

let galleryPhotos: string[] = GALLERY_IMAGES;
let currentPhotoIndex = 0;

const initGallery = (): void => {
  initGallerySlider();
};

const openLightbox = (idx: number): void => {
  currentPhotoIndex = idx;
  showLightboxPhoto();
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
};

const closeLightbox = (): void => {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
};

const showLightboxPhoto = (): void => {
  lightboxImg.src = galleryPhotos[currentPhotoIndex] ?? "";
  lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${galleryPhotos.length}`;
};

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => {
  currentPhotoIndex = (currentPhotoIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
  showLightboxPhoto();
});
lightboxNext.addEventListener("click", () => {
  currentPhotoIndex = (currentPhotoIndex + 1) % galleryPhotos.length;
  showLightboxPhoto();
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (lightbox.classList.contains("open")) {
    if (e.key === "Escape") { closeLightbox(); return; }
    if (e.key === "ArrowLeft") { currentPhotoIndex = (currentPhotoIndex - 1 + galleryPhotos.length) % galleryPhotos.length; showLightboxPhoto(); }
    if (e.key === "ArrowRight") { currentPhotoIndex = (currentPhotoIndex + 1) % galleryPhotos.length; showLightboxPhoto(); }
    return;
  }
  // 갤러리 슬라이더 키보드 지원
  if (e.key === "ArrowLeft") updateSlider(sliderIndex - 1);
  if (e.key === "ArrowRight") updateSlider(sliderIndex + 1);
});

// ─── Account Copy ────────────────────────────────────────────────────────────

document.addEventListener("click", async (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-copy]");
  if (!btn) return;
  const val = btn.dataset.copy;
  if (!val) return;
  try {
    await navigator.clipboard.writeText(val);
    showToast("✓ 계좌번호가 복사되었습니다");
  } catch {
    showToast("복사에 실패했습니다. 직접 복사해 주세요.");
  }
});

// ─── Guestbook ───────────────────────────────────────────────────────────────

// ── localStorage fallback ──
const LS_KEY = "wedding-guestbook";

const lsLoadEntries = (): GuestbookEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]") as GuestbookEntry[];
  } catch {
    return [];
  }
};

const lsSaveEntry = (entry: GuestbookEntry): void => {
  const entries = lsLoadEntries();
  entries.unshift(entry);
  localStorage.setItem(LS_KEY, JSON.stringify(entries));
};

// ── GitHub Issues API ──
const GH_API = "https://api.github.com";

const ghHeaders = (): HeadersInit => ({
  "Accept": "application/vnd.github+json",
  "Authorization": `Bearer ${GITHUB_CONFIG.token}`,
  "X-GitHub-Api-Version": "2022-11-28",
});

const ghFetchIssues = async (): Promise<GuestbookEntry[]> => {
  const url = `${GH_API}/repos/${GITHUB_CONFIG.repo}/issues?labels=${encodeURIComponent(GUESTBOOK_LABEL)}&state=open&per_page=30&sort=created&direction=desc`;
  const res = await fetch(url, { headers: ghHeaders() });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const issues: any[] = await res.json();
  return issues.map((issue) => ({
    id: issue.number as number,
    name: issue.title as string,
    message: issue.body as string,
    createdAt: issue.created_at as string,
  }));
};

const ghCreateIssue = async (name: string, message: string): Promise<void> => {
  const url = `${GH_API}/repos/${GITHUB_CONFIG.repo}/issues`;
  const res = await fetch(url, {
    method: "POST",
    headers: { ...ghHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ title: name, body: message, labels: [GUESTBOOK_LABEL] }),
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
};

// ── Like Toggle ──
const LS_LIKES_KEY = "wedding-likes";

const getLikes = (): Record<string, boolean> => {
  try {
    return JSON.parse(localStorage.getItem(LS_LIKES_KEY) ?? "{}") as Record<string, boolean>;
  } catch {
    return {};
  }
};

const saveLike = (id: string, liked: boolean): void => {
  const likes = getLikes();
  likes[id] = liked;
  localStorage.setItem(LS_LIKES_KEY, JSON.stringify(likes));
};

const initLikeBtn = (btn: HTMLButtonElement, entryId: string): void => {
  const likes = getLikes();
  const liked = !!likes[entryId];
  btn.textContent = liked ? "♥" : "♡";
  btn.dataset.liked = liked ? "true" : "false";

  btn.addEventListener("click", () => {
    const isLiked = btn.dataset.liked === "true";
    const next = !isLiked;
    btn.dataset.liked = next ? "true" : "false";
    btn.textContent = next ? "♥" : "♡";
    saveLike(entryId, next);
    // trigger animation
    btn.classList.remove("liked");
    void btn.offsetWidth; // reflow to restart animation
    if (next) btn.classList.add("liked");
  });
};

// ── Render ──
const renderEntry = (entry: GuestbookEntry): HTMLLIElement => {
  const li = document.createElement("li");
  const date = new Date(entry.createdAt);
  const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  const entryId = String(entry.id);
  li.innerHTML = `
    <div class="guestbook-entry">
      <div class="guestbook-entry-body">
        <strong>${escapeHtml(entry.name)}</strong>
        <p>${escapeHtml(entry.message)}</p>
        <time datetime="${entry.createdAt}">${dateStr}</time>
      </div>
      <button type="button" class="like-btn" aria-label="좋아요" data-entry-id="${entryId}">♡</button>
    </div>
  `;
  const likeBtn = li.querySelector<HTMLButtonElement>(".like-btn");
  if (likeBtn) initLikeBtn(likeBtn, entryId);
  return li;
};

const escapeHtml = (str: string): string =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const loadGuestbook = async (): Promise<void> => {
  guestbookList.innerHTML = `<li class="guestbook-loading">불러오는 중…</li>`;

  try {
    let entries: GuestbookEntry[];

    if (GITHUB_CONFIG.enabled) {
      entries = await ghFetchIssues();
    } else {
      entries = lsLoadEntries();
    }

    guestbookList.innerHTML = "";
    if (entries.length === 0) {
      guestbookList.innerHTML = `<li class="guestbook-loading">아직 방명록이 없습니다. 첫 번째 메시지를 남겨주세요! 🎉</li>`;
      return;
    }
    entries.forEach((e) => guestbookList.appendChild(renderEntry(e)));
  } catch (err) {
    console.error(err);
    guestbookList.innerHTML = `<li class="guestbook-loading">방명록을 불러오지 못했습니다.</li>`;
  }
};

guestbookForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(guestbookForm);
  const name = String(fd.get("name") ?? "").trim();
  const message = String(fd.get("message") ?? "").trim();
  if (!name || !message) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "등록 중…";
  formStatus.textContent = "";

  try {
    if (GITHUB_CONFIG.enabled) {
      await ghCreateIssue(name, message);
    } else {
      const entry: GuestbookEntry = {
        id: Date.now(),
        name,
        message,
        createdAt: new Date().toISOString(),
      };
      lsSaveEntry(entry);
    }
    guestbookForm.reset();
    showToast("💌 방명록이 등록되었습니다. 감사합니다!");
    await loadGuestbook();
  } catch (err) {
    console.error(err);
    formStatus.textContent = "등록 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "메시지 남기기";
  }
});

// ─── Kakao Map ───────────────────────────────────────────────────────────────

const initKakaoMap = (): void => {
  const key = WD?.kakaoMapKey;
  const mapContainer = document.getElementById('kakao-map-container');
  if (!key || !mapContainer) return;

  // SDK 동적 로드
  const script = document.createElement('script');
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`;
  script.onload = () => {
    (window as any).kakao.maps.load(() => {
      mapContainer.style.display = 'block';
      // 정적 지도 숨기기
      const mapThumbLink = document.querySelector<HTMLElement>('.map-thumb-link');
      if (mapThumbLink) mapThumbLink.style.display = 'none';

      const lat = WD?.wedding?.lat ?? 37.4589;
      const lng = WD?.wedding?.lng ?? 126.9525;
      const options = {
        center: new (window as any).kakao.maps.LatLng(lat, lng),
        level: 3,
        draggable: true,
      };
      const map = new (window as any).kakao.maps.Map(mapContainer, options);
      const marker = new (window as any).kakao.maps.Marker({
        position: new (window as any).kakao.maps.LatLng(lat, lng),
      });
      marker.setMap(map);
      const infoWindow = new (window as any).kakao.maps.InfoWindow({
        content: `<div style="padding:6px 10px;font-size:13px;font-weight:600;">${WD?.wedding?.venueName ?? '서울대학교 이라운지'}</div>`,
      });
      infoWindow.open(map, marker);
    });
  };
  document.head.appendChild(script);
};

// ─── Scroll Reveal ───────────────────────────────────────────────────────────

const initScrollReveal = (): void => {
  const targets = document.querySelectorAll<HTMLElement>(".section-fade");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  targets.forEach((el) => observer.observe(el));
};

// ─── Init ────────────────────────────────────────────────────────────────────

initializeTheme();
renderAccounts();
initKakaoMap();
initGallery();
initScrollReveal();
loadGuestbook();
