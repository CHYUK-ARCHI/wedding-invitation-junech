"use strict";

const WD = (typeof WEDDING_DATA !== "undefined") ? WEDDING_DATA : null;

const WEDDING_DATE = (() => {
  if (WD?.wedding?.date && WD?.wedding?.time) {
    const d = WD.wedding.date.replace(/년\s*/g,"-").replace(/월\s*/g,"-").replace(/일.*/,"").trim();
    const t = WD.wedding.time.replace("오전 ","").replace("시",":00");
    const dt = new Date(`${d}T${t}:00+09:00`);
    if (!isNaN(dt.getTime())) return dt;
  }
  return new Date("2026-06-28T11:00:00+09:00");
})();

const GALLERY_IMGS = WD?.gallery || [
  "assets/IMG_0876.webp",
  "assets/IMG_0963.webp","assets/IMG_0966.webp","assets/IMG_0981.webp",
  "assets/IMG_0982.webp","assets/IMG_0983.webp","assets/IMG_1007.webp",
];

const GH_CONFIG = (() => {
  try {
    const c = typeof WEDDING_CONFIG !== "undefined" ? WEDDING_CONFIG : undefined;
    if (c?.repo && c?.token && c.token !== "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN_HERE")
      return { repo: c.repo, token: c.token, enabled: true };
  } catch(_) {}
  return { repo:"", token:"", enabled:false };
})();

/* helpers */
const $  = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);
const pad = n => String(n).padStart(2,"0");
const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

/* ─── Theme ──────────────────────────────────────────────── */
const root = document.documentElement;
const themeBtn = $("#theme-toggle");

function applyTheme(t) {
  root.dataset.theme = t;
  localStorage.setItem("inv-theme", t);
  if (themeBtn) themeBtn.textContent = t === "dark" ? "[ LIGHT ]" : "[ DARK ]";
}

(function initTheme() {
  const saved = localStorage.getItem("inv-theme");
  if (saved === "light" || saved === "dark") { applyTheme(saved); return; }
  applyTheme(window.matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light");
})();

themeBtn?.addEventListener("click", () =>
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark")
);

/* ─── Toast ──────────────────────────────────────────────── */
const toastEl = $("#toast");
let toastT;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(() => toastEl.classList.remove("show"), 2600);
}

/* ─── Countdown ──────────────────────────────────────────── */
function tick() {
  const diff = WEDDING_DATE - Date.now();
  if (diff <= 0) {
    ["cd-days","cd-hours","cd-mins","cd-secs"].forEach(id => {
      const el = document.getElementById(id);
      if(el) el.textContent = "00";
    });
    return;
  }
  const s = Math.floor(diff/1000);
  document.getElementById("cd-days").textContent  = String(Math.floor(s/86400));
  document.getElementById("cd-hours").textContent = pad(Math.floor((s%86400)/3600));
  document.getElementById("cd-mins").textContent  = pad(Math.floor((s%3600)/60));
  document.getElementById("cd-secs").textContent  = pad(s%60);
}
tick(); setInterval(tick, 1000);

/* ─── Accounts ───────────────────────────────────────────── */
function renderAccounts() {
  const accounts = WD?.accounts || [];
  ["bride","groom"].forEach(side => {
    const box = document.getElementById(`account-${side}`);
    if (!box) return;
    const items = accounts.filter(a => a.side === side);
    box.innerHTML = items.map(a => `
      <div class="account-item">
        <div class="account-info">
          <span class="account-role">${a.role}</span>
          <span class="account-name">${a.name||""}</span>
          <span class="account-bank">${a.bank}</span>
          <span class="account-number">${a.account}</span>
        </div>
        <button class="copy-btn" data-copy="${esc(a.account)}" aria-label="복사">COPY</button>
      </div>`).join("");
  });
  const bp = document.getElementById("kakaopay-bride");
  const gp = document.getElementById("kakaopay-groom");
  if (bp && WD?.kakaopay?.bride) bp.href = WD.kakaopay.bride;
  if (gp && WD?.kakaopay?.groom) gp.href = WD.kakaopay.groom;
}

$$(".account-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    $$(".account-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    $$(".account-scroll-box").forEach(b => b.classList.add("hidden"));
    document.getElementById(`account-${tab.dataset.side}`)?.classList.remove("hidden");
  });
});

document.addEventListener("click", async e => {
  const btn = e.target.closest("[data-copy]");
  if (!btn) return;
  try {
    await navigator.clipboard.writeText(btn.dataset.copy);
    toast("✓  COPIED");
  } catch { toast("수동으로 복사해 주세요"); }
});

/* ─── Gallery ────────────────────────────────────────────── */
const stageEl   = document.getElementById("gallery-stage");
const navEl     = document.getElementById("gallery-nav");
const counterEl = document.getElementById("gs-counter");
const stageLbl  = document.getElementById("gallery-stage-label");
const thumbsEl  = document.getElementById("gallery-thumbs");

let gsIdx = 0;
const stageImgs = stageEl ? Array.from(stageEl.querySelectorAll("img")) : [];

// dots
if (navEl) {
  GALLERY_IMGS.forEach((_,i) => {
    const btn = document.createElement("button");
    btn.className = "gallery-dot" + (i===0?" active":"");
    btn.setAttribute("aria-label", `사진 ${i+1}`);
    btn.addEventListener("click", () => goSlide(i));
    navEl.appendChild(btn);
  });
}

const IMG_LABELS = ["IMG_001","IMG_002","IMG_003","IMG_004","IMG_005","IMG_006","IMG_007"];

function goSlide(idx) {
  gsIdx = (idx + GALLERY_IMGS.length) % GALLERY_IMGS.length;
  stageImgs.forEach((img,i) => img.classList.toggle("active", i===gsIdx));
  navEl?.querySelectorAll(".gallery-dot").forEach((d,i) => d.classList.toggle("active", i===gsIdx));
  if (counterEl) counterEl.textContent = `${pad(gsIdx+1)} / ${pad(GALLERY_IMGS.length)}`;
  if (stageLbl) stageLbl.textContent = IMG_LABELS[gsIdx] || `IMG_${pad(gsIdx+1)}`;
  thumbsEl?.querySelectorAll(".gallery-thumb").forEach((t,i) => t.classList.toggle("active", i===gsIdx));
  updateLikeUI();
}

document.getElementById("gs-prev")?.addEventListener("click", () => goSlide(gsIdx-1));
document.getElementById("gs-next")?.addEventListener("click", () => goSlide(gsIdx+1));

// swipe
if (stageEl) {
  let tx=0;
  stageEl.addEventListener("touchstart", e => { tx=e.changedTouches[0].clientX; }, {passive:true});
  stageEl.addEventListener("touchend",   e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx)>40) goSlide(gsIdx+(dx<0?1:-1));
  }, {passive:true});
  stageEl.addEventListener("click", e => {
    if (!e.target.closest(".gallery-nav-dots")) openLb(gsIdx);
  });
}

thumbsEl?.querySelectorAll(".gallery-thumb").forEach(th => {
  th.addEventListener("click", () => goSlide(parseInt(th.dataset.idx)));
});

// gallery likes
const GL_KEY = "gal-likes-v2";
function getGalLikes() { try{return JSON.parse(localStorage.getItem(GL_KEY)||"{}");}catch{return{};} }
function updateLikeUI() {
  const likes = getGalLikes();
  const btn   = document.getElementById("gallery-like-btn");
  const cnt   = document.getElementById("gallery-like-count");
  if (!btn||!cnt) return;
  const liked = !!likes[gsIdx];
  btn.textContent = liked ? "♥" : "♡";
  btn.classList.toggle("liked", liked);
  cnt.textContent = Object.values(likes).filter(Boolean).length;
}
document.getElementById("gallery-like-btn")?.addEventListener("click", () => {
  const likes = getGalLikes();
  likes[gsIdx] = !likes[gsIdx];
  localStorage.setItem(GL_KEY, JSON.stringify(likes));
  updateLikeUI();
  const btn = document.getElementById("gallery-like-btn");
  btn.classList.remove("liked"); void btn.offsetWidth; if(likes[gsIdx]) btn.classList.add("liked");
});
updateLikeUI();

/* ─── Lightbox ───────────────────────────────────────────── */
const lb    = document.getElementById("lightbox");
const lbImg = document.getElementById("lightbox-img");
const lbCnt = document.getElementById("lightbox-counter");
let lbIdx=0;

function openLb(idx) {
  lbIdx=idx; showLb();
  lb.classList.add("open");
  document.body.style.overflow="hidden";
}
function closeLb() { lb.classList.remove("open"); document.body.style.overflow=""; }
function showLb() {
  lbImg.src = GALLERY_IMGS[lbIdx];
  if(lbCnt) lbCnt.textContent=`${lbIdx+1} / ${GALLERY_IMGS.length}`;
}
function lbGo(d) { lbIdx=(lbIdx+d+GALLERY_IMGS.length)%GALLERY_IMGS.length; showLb(); }

document.getElementById("lightbox-close")?.addEventListener("click", closeLb);
document.getElementById("lightbox-prev")?.addEventListener("click", ()=>lbGo(-1));
document.getElementById("lightbox-next")?.addEventListener("click", ()=>lbGo(1));
lb?.addEventListener("click", e=>{ if(e.target===lb) closeLb(); });
document.addEventListener("keydown", e=>{
  if(!lb?.classList.contains("open")) return;
  if(e.key==="Escape") closeLb();
  if(e.key==="ArrowLeft") lbGo(-1);
  if(e.key==="ArrowRight") lbGo(1);
});

/* ─── Kakao Map ──────────────────────────────────────────── */
function initKakaoMap() {
  const key = WD?.kakaoMapKey;
  const container = document.getElementById("kakao-map-container");
  if (!key||!container) return;
  const script = document.createElement("script");
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`;
  script.onload = () => {
    window.kakao.maps.load(()=>{
      container.style.display="block";
      const sl = document.getElementById("map-static-link");
      if(sl) sl.style.display="none";
      const lat=WD?.wedding?.lat??37.4589, lng=WD?.wedding?.lng??126.9525;
      const map = new kakao.maps.Map(container,{center:new kakao.maps.LatLng(lat,lng),level:3});
      const marker = new kakao.maps.Marker({position:new kakao.maps.LatLng(lat,lng)});
      marker.setMap(map);
      new kakao.maps.InfoWindow({
        content:`<div style="padding:5px 10px;font-size:13px">${WD?.wedding?.venueName||"서울대학교 이라운지"}</div>`
      }).open(map,marker);
    });
  };
  document.head.appendChild(script);
}

/* ─── Guestbook ──────────────────────────────────────────── */
const GB_LS  = "wedding-gb-v2";
const GB_LBL = "방명록";
const GH_API = "https://api.github.com";
const gbForm   = document.getElementById("guestbook-form");
const gbList   = document.getElementById("guestbook-list");
const gbStatus = document.getElementById("form-status");
const gbSubmit = document.getElementById("guestbook-submit");

const ghH = () => ({
  "Accept":"application/vnd.github+json",
  "Authorization":`Bearer ${GH_CONFIG.token}`,
  "X-GitHub-Api-Version":"2022-11-28",
});

async function ghFetch() {
  const url=`${GH_API}/repos/${GH_CONFIG.repo}/issues?labels=${encodeURIComponent(GB_LBL)}&state=open&per_page=30&sort=created&direction=desc`;
  const res=await fetch(url,{headers:ghH()});
  if(!res.ok) throw new Error(res.status);
  const issues=await res.json();
  return issues.map(i=>({id:i.number,name:i.title,message:i.body||"",createdAt:i.created_at}));
}

async function ghPost(name,message) {
  const res=await fetch(`${GH_API}/repos/${GH_CONFIG.repo}/issues`,{
    method:"POST",
    headers:{...ghH(),"Content-Type":"application/json"},
    body:JSON.stringify({title:name,body:message,labels:[GB_LBL]}),
  });
  if(!res.ok) throw new Error(res.status);
}

function lsEntries(){try{return JSON.parse(localStorage.getItem(GB_LS)||"[]");}catch{return[];}}
function lsSave(e){const a=lsEntries();a.unshift(e);localStorage.setItem(GB_LS,JSON.stringify(a));}

const LIKE_KEY="gb-likes-v2";
function getEntryLikes(){try{return JSON.parse(localStorage.getItem(LIKE_KEY)||"{}");}catch{return{};}}

function renderEntry(e) {
  const li=document.createElement("li");
  li.className="guestbook-entry";
  const dt=new Date(e.createdAt);
  const ds=`${dt.getFullYear()}.${pad(dt.getMonth()+1)}.${pad(dt.getDate())}`;
  const id=String(e.id);
  const likes=getEntryLikes();
  const liked=!!likes[id];
  li.innerHTML=`
    <div class="entry-body">
      <div class="entry-name">${esc(e.name)}</div>
      <div class="entry-msg">${esc(e.message)}</div>
      <time class="entry-date" datetime="${e.createdAt}">${ds}</time>
    </div>
    <div class="entry-like">
      <button class="like-btn" data-entry="${id}" aria-label="좋아요">${liked?"♥":"♡"}</button>
    </div>`;
  li.querySelector(".like-btn").addEventListener("click", ev=>{
    const btn=ev.currentTarget;
    const lk=getEntryLikes();
    lk[id]=!lk[id];
    localStorage.setItem(LIKE_KEY,JSON.stringify(lk));
    btn.textContent=lk[id]?"♥":"♡";
    btn.classList.remove("liked"); void btn.offsetWidth; if(lk[id]) btn.classList.add("liked");
  });
  return li;
}

async function loadGuestbook() {
  gbList.innerHTML=`<li class="guestbook-loading">// loading...</li>`;
  try {
    const entries = GH_CONFIG.enabled ? await ghFetch() : lsEntries();
    gbList.innerHTML="";
    if(!entries.length){
      gbList.innerHTML=`<li class="guestbook-loading">// 첫 번째 메시지를 남겨주세요</li>`;
      return;
    }
    entries.forEach(e=>gbList.appendChild(renderEntry(e)));
  } catch {
    gbList.innerHTML=`<li class="guestbook-loading">// failed to load</li>`;
  }
}

gbForm?.addEventListener("submit", async e=>{
  e.preventDefault();
  const fd=new FormData(gbForm);
  const name=String(fd.get("name")||"").trim();
  const msg=String(fd.get("message")||"").trim();
  if(!name||!msg) return;
  gbSubmit.disabled=true;
  gbSubmit.textContent="LOADING...";
  gbStatus.textContent="";
  try {
    if(GH_CONFIG.enabled){ await ghPost(name,msg); }
    else { lsSave({id:Date.now(),name,message:msg,createdAt:new Date().toISOString()}); }
    gbForm.reset();
    toast("✓  REGISTERED");
    await loadGuestbook();
  } catch {
    gbStatus.textContent="// ERROR — 잠시 후 다시 시도해 주세요";
  } finally {
    gbSubmit.disabled=false;
    gbSubmit.textContent="SUBMIT →";
  }
});

/* ─── Scroll Reveal ──────────────────────────────────────── */
const obs = new IntersectionObserver(entries=>{
  entries.forEach(en=>{
    if(en.isIntersecting){ en.target.classList.add("in"); obs.unobserve(en.target); }
  });
},{threshold:0.07, rootMargin:"0px 0px -24px 0px"});

document.querySelectorAll(".reveal").forEach((el,i)=>{
  el.style.transitionDelay=`${i*0.04}s`;
  obs.observe(el);
});

/* ─── Init ───────────────────────────────────────────────── */
renderAccounts();
initKakaoMap();
loadGuestbook();
