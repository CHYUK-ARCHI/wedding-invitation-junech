interface ApiConfig {
  baseUrl: string;
  rsvpEndpoint: string;
}

interface TransferAccount {
  role: string;
  bank: string;
  account: string;
  holder: string;
}

interface AppConfig {
  api: ApiConfig;
  transfer: TransferAccount[];
}

interface RsvpPayload {
  name: FormDataEntryValue;
  guests: FormDataEntryValue;
  phone: FormDataEntryValue;
  memo?: FormDataEntryValue;
}

const APP_CONFIG: AppConfig = {
  api: {
    baseUrl: "https://api.example.com",
    rsvpEndpoint: "/api/v1/invitations/rsvp",
  },
  transfer: [
    { role: "신랑측", bank: "국민", account: "000000-00-000000", holder: "김준" },
    { role: "신부측", bank: "신한", account: "000-000-000000", holder: "최채" },
  ],
};

const accountList = document.getElementById("account-list") as HTMLDivElement | null;
const statusNode = document.getElementById("form-status") as HTMLParagraphElement | null;
const rsvpForm = document.getElementById("rsvp-form") as HTMLFormElement | null;

if (!accountList || !statusNode || !rsvpForm) {
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

const sendRsvp = async (payload: RsvpPayload): Promise<void> => {
  const { baseUrl, rsvpEndpoint } = APP_CONFIG.api;
  const response = await fetch(`${baseUrl}${rsvpEndpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("참석 정보 전송에 실패했습니다.");
  }
};

document.addEventListener("click", async (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const copyValue = target.dataset.copy;
  if (!copyValue) return;

  await navigator.clipboard.writeText(copyValue);
  statusNode.textContent = "계좌번호가 복사되었습니다.";
});

rsvpForm.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();
  statusNode.textContent = "전송 중...";

  const formData = new FormData(rsvpForm);
  const payload: RsvpPayload = {
    name: formData.get("name") ?? "",
    guests: formData.get("guests") ?? "1",
    phone: formData.get("phone") ?? "",
    memo: formData.get("memo") ?? "",
  };

  try {
    await sendRsvp(payload);
    statusNode.textContent = "참석 정보가 전달되었습니다. 감사합니다!";
    rsvpForm.reset();
  } catch {
    statusNode.textContent = "테스트 모드입니다. API 값을 설정하면 실제 전송됩니다.";
  }
});

renderAccounts();
