interface TransferAccount {
  role: string;
  bank: string;
  account: string;
  holder: string;
}

interface GalleryState {
  likes: number;
  comments: string[];
}

const APP_CONFIG = {
  transfer: [
    { role: "신부측", bank: "신한", account: "000-000-000000", holder: "김주은" },
    { role: "신랑측", bank: "국민", account: "000000-00-000000", holder: "권찬혁" },
  ] as TransferAccount[],
};

const accountList = document.getElementById("account-list") as HTMLDivElement | null;
const statusNode = document.getElementById("form-status") as HTMLParagraphElement | null;
const guestbookForm = document.getElementById("guestbook-form") as HTMLFormElement | null;
const guestbookList = document.getElementById("guestbook-list") as HTMLUListElement | null;

if (!accountList || !statusNode || !guestbookForm || !guestbookList) {
  throw new Error("필수 DOM 노드를 찾지 못했습니다.");
}

const renderAccounts = (): void => {
  accountList.innerHTML = APP_CONFIG.transfer
    .map(
      ({ role, bank, account, holder }) => `
      <article class="account-item">
        <div>
          <strong>${role}</strong>
          <p>${bank} ${account} (${holder})</p>
        </div>
        <button type="button" data-copy="${bank} ${account}">복사</button>
      </article>
    `,
    )
    .join("");
};

const galleryCards = Array.from(document.querySelectorAll<HTMLElement>(".gallery-card"));

const storageKey = (id: string): string => `gallery:${id}`;

const readGalleryState = (id: string): GalleryState => {
  const raw = localStorage.getItem(storageKey(id));
  if (!raw) return { likes: 0, comments: [] };

  try {
    return JSON.parse(raw) as GalleryState;
  } catch {
    return { likes: 0, comments: [] };
  }
};

const writeGalleryState = (id: string, state: GalleryState): void => {
  localStorage.setItem(storageKey(id), JSON.stringify(state));
};

const renderGalleryCard = (card: HTMLElement): void => {
  const id = card.dataset.photoId;
  if (!id) return;

  const state = readGalleryState(id);
  const likeCount = card.querySelector<HTMLElement>(".like-count");
  const commentList = card.querySelector<HTMLUListElement>(".comment-list");

  if (likeCount) likeCount.textContent = String(state.likes);
  if (commentList) {
    commentList.innerHTML = state.comments.map((comment) => `<li>${comment}</li>`).join("");
  }
};

const renderAllGallery = (): void => {
  galleryCards.forEach(renderGalleryCard);
};

const addGuestbookEntry = (name: string, message: string): void => {
  const item = document.createElement("li");
  item.innerHTML = `<strong>${name}</strong><p>${message}</p>`;
  guestbookList.prepend(item);
};

document.addEventListener("click", async (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const copyValue = target.dataset.copy;
  if (copyValue) {
    await navigator.clipboard.writeText(copyValue);
    statusNode.textContent = "계좌번호가 복사되었습니다.";
    return;
  }

  const likeButton = target.closest(".like-btn") as HTMLButtonElement | null;
  if (!likeButton) return;

  const card = likeButton.closest(".gallery-card") as HTMLElement | null;
  const id = card?.dataset.photoId;
  if (!id) return;

  const state = readGalleryState(id);
  state.likes += 1;
  writeGalleryState(id, state);
  renderGalleryCard(card);
});

document.addEventListener("submit", (event: Event) => {
  const target = event.target;

  if (target === guestbookForm) {
    event.preventDefault();
    const formData = new FormData(guestbookForm);
    const name = String(formData.get("name") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !message) return;

    addGuestbookEntry(name, message);
    statusNode.textContent = "방명록이 등록되었습니다. 감사합니다!";
    guestbookForm.reset();
    return;
  }

  const commentForm = (target as HTMLElement).closest(".comment-form") as HTMLFormElement | null;
  if (!commentForm) return;

  event.preventDefault();
  const card = commentForm.closest(".gallery-card") as HTMLElement | null;
  const id = card?.dataset.photoId;
  if (!id) return;

  const formData = new FormData(commentForm);
  const comment = String(formData.get("comment") ?? "").trim();
  if (!comment) return;

  const state = readGalleryState(id);
  state.comments.unshift(comment);
  writeGalleryState(id, state);
  commentForm.reset();
  renderGalleryCard(card);
});

renderAccounts();
renderAllGallery();
