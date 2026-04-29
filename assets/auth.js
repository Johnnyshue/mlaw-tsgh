// URL 即鑰匙（像 Google Drive 分享連結）
// 完整連結帶 #k=<token>，token 對才解鎖；解鎖後存 localStorage，下次直開短網址即可
// 換 token：改 TOKEN_HASH（用 https://emn178.github.io/online-tools/sha256.html 算 SHA256）
const TOKEN_HASH = "3720fffb0a6948fa695c4489c68c4460aaea4928b2233bd3bea6e6d8896d03c7";
const STORAGE_KEY = "mlaw_authed_v2";

async function sha256Hex(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function readTokenFromURL() {
  // 支援 #k=xxx 或 ?k=xxx
  const hash = location.hash || "";
  const m1 = hash.match(/(?:^#|&)k=([^&]+)/);
  if (m1) return decodeURIComponent(m1[1]);
  const params = new URLSearchParams(location.search);
  return params.get("k") || "";
}

function buildLockedScreen() {
  const gate = document.createElement("div");
  gate.id = "auth-gate";
  gate.innerHTML = `
    <style>
      #auth-gate{
        position:fixed;inset:0;z-index:9999;background:#0e1117;color:#e6edf3;
        display:flex;align-items:center;justify-content:center;padding:20px;
        font-family:-apple-system,"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif;
      }
      #auth-gate .box{
        background:#161b22;border:1px solid #30363d;border-radius:12px;
        padding:32px;max-width:420px;width:100%;text-align:center;
      }
      #auth-gate .icon{font-size:42px;margin-bottom:8px}
      #auth-gate h1{margin:0 0 12px;font-size:22px}
      #auth-gate p{color:#9aa6b2;margin:0 0 14px;font-size:14px;line-height:1.7}
      #auth-gate .em{color:#f97316;font-weight:600}
    </style>
    <div class="box">
      <div class="icon">🔒</div>
      <h1>需要完整邀請連結</h1>
      <p>此網站僅供徐嘉佑與獲得邀請連結的朋友存取。</p>
      <p>請使用<span class="em">完整邀請連結</span>（網址尾端帶有 <code style="background:#1c232c;padding:2px 6px;border-radius:4px">#k=…</code> 的版本）開啟本站。</p>
      <p style="font-size:12px;color:#9aa6b2;margin-top:20px">
        遺失連結？請聯絡網站擁有者（徐嘉佑）重新索取。
      </p>
    </div>
  `;
  document.body.appendChild(gate);
}

(async function main() {
  // 已驗證過 → 直接放行
  if (localStorage.getItem(STORAGE_KEY) === "1") return;

  // 從 URL 讀 token
  const token = readTokenFromURL();
  if (token) {
    const h = await sha256Hex(token);
    if (h === TOKEN_HASH) {
      localStorage.setItem(STORAGE_KEY, "1");
      // 清掉 URL 上的 token（避免被截圖、紀錄、瀏覽歷史外洩）
      try {
        const cleanUrl = location.pathname + location.search.replace(/[?&]k=[^&]+/, "");
        history.replaceState(null, "", cleanUrl);
      } catch (e) { /* 忽略 */ }
      return;
    }
  }

  // 沒 token 或 token 錯 → 鎖畫面
  window.__mlawWaitAuth = true;
  document.addEventListener("DOMContentLoaded", buildLockedScreen);
  if (document.readyState !== "loading") buildLockedScreen();
})();
