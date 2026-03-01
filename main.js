"use strict";
const APP_CONFIG = {
    api: {
        baseUrl: "https://api.example.com",
        rsvpEndpoint: "/api/v1/invitations/rsvp",
    },
    transfer: [
        { role: "신랑측", bank: "국민", account: "000000-00-000000", holder: "김준" },
        { role: "신부측", bank: "신한", account: "000-000-000000", holder: "최채" },
    ],
};
const accountList = document.getElementById("account-list");
const statusNode = document.getElementById("form-status");
const rsvpForm = document.getElementById("rsvp-form");
if (!accountList || !statusNode || !rsvpForm) {
    throw new Error("필수 DOM 노드를 찾지 못했습니다.");
}
const renderAccounts = () => {
    accountList.innerHTML = APP_CONFIG.transfer
        .map(({ role, bank, account, holder }) => `
      <article class="account-item">
        <div>
          <strong>${role}</strong>
          <p>${bank} ${account} (${holder})</p>
        </div>
        <button type="button" data-copy="${bank} ${account}">복사</button>
      </article>
    `)
        .join("");
};
const sendRsvp = async (payload) => {
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
document.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement))
        return;
    const copyValue = target.dataset.copy;
    if (!copyValue)
        return;
    await navigator.clipboard.writeText(copyValue);
    statusNode.textContent = "계좌번호가 복사되었습니다.";
});
rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    statusNode.textContent = "전송 중...";
    const formData = new FormData(rsvpForm);
    const payload = {
        name: formData.get("name") ?? "",
        guests: formData.get("guests") ?? "1",
        phone: formData.get("phone") ?? "",
        memo: formData.get("memo") ?? "",
    };
    try {
        await sendRsvp(payload);
        statusNode.textContent = "참석 정보가 전달되었습니다. 감사합니다!";
        rsvpForm.reset();
    }
    catch {
        statusNode.textContent = "테스트 모드입니다. API 값을 설정하면 실제 전송됩니다.";
    }
});
renderAccounts();
