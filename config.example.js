/* ====================================================================
   Wedding Config (방명록 GitHub Issues API 연동 설정)
   ====================================================================

   사용 방법:
   1. 이 파일을 복사해서 config.js 로 저장하세요.
   2. 아래 값들을 실제 값으로 채워넣으세요.
   3. config.js 는 .gitignore 에 추가되어 있으므로 git에 올라가지 않습니다.

   GitHub PAT 발급: https://github.com/settings/tokens/new
   - 필요한 권한: repo (또는 public_repo)
   ==================================================================== */

window.WEDDING_CONFIG = {
  // GitHub 저장소 (owner/repo 형식)
  repo: "CHYUK-ARCHI/wedding-invitation-junech",

  // GitHub Personal Access Token (Fine-grained 권장 – issues: read/write)
  // 주의: 이 파일은 브라우저에서 누구나 읽을 수 있습니다.
  //       issues:write 권한만 허용한 Fine-grained PAT를 사용하세요.
  token: "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN_HERE",
};
