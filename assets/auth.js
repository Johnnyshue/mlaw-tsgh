// 簡單密碼門 — 擋一般訪客（不是高強度安全；任何前端密碼都不能擋住技術人員）
// 預設密碼：tsgh-2026（要換 → 改 PASSWORD_HASH，用 https://emn178.github.io/online-tools/sha256.html 算 SHA256）
const PASSWORD_HASH = "2a769494e34a160367bed5064c83482134fab59eee31c5a7a25cd909d13cdb4f";
const STORAGE_KEY = "mlaw_authed_v1";

async function sha256Hex(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function buildGate() {
  const gate = document.createElement("div");
  gate.id = "auth-gate";
  gate.innerHTML = `
    <style>
      #auth-gate{
        position:fixed;inset:0;z-index:9999;background:#0e1117;color:#e6edf3;
        display:flex;align-items:center;justify-content:center;
        font-family:-apple-system,"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif;
        padding:20px;
      }
      #auth-gate .box{
        background:#161b22;border:1px solid #30363d;border-radius:12px;
        padding:32px;max-width:400px;width:100%;text-align:center;
      }
      #auth-gate h1{margin:0 0 8px;font-size:24px}
      #auth-gate p{color:#9aa6b2;margin:0 0 20px;font-size:14px;line-height:1.7}
      #auth-gate input{
        width:100%;padding:12px 14px;background:#1c232c;border:1px solid #30363d;
        color:#e6edf3;border-radius:6px;font-size:16px;margin-bottom:12px;box-sizing:border-box;
      }
      #auth-gate button{
        width:100%;padding:12px;background:#f97316;color:#000;border:0;
        border-radius:6px;font-size:16px;font-weight:600;cursor:pointer;
      }
      #auth-gate button:hover{background:#ea580c}
      #auth-gate .err{color:#ef4444;font-size:13px;margin-top:8px;min-height:18px}
      #auth-gate .hint{color:#9aa6b2;font-size:11px;margin-top:14px}
    </style>
    <div class="box">
      <h1>⚖️ 醫療法律自學</h1>
      <p>此網站僅供徐嘉佑與授權的朋友存取。<br>請輸入密碼。</p>
      <input id="pw" type="password" placeholder="密碼" autocomplete="current-password">
      <button id="go">進入</button>
      <div class="err" id="err"></div>
      <div class="hint">不知道密碼？請聯絡網站擁有者。</div>
    </div>
  `;
  document.body.appendChild(gate);
  const $pw = gate.querySelector("#pw");
  const $err = gate.querySelector("#err");
  const $go = gate.querySelector("#go");
  $pw.focus();

  async function tryAuth() {
    const v = $pw.value.trim();
    if (!v) { $err.textContent = "請輸入密碼"; return; }
    const h = await sha256Hex(v);
    if (h === PASSWORD_HASH) {
      localStorage.setItem(STORAGE_KEY, "1");
      gate.remove();
      // 解鎖後觸發 app 載入
      if (typeof window.__mlawInit === "function") window.__mlawInit();
    } else {
      $err.textContent = "密碼錯誤";
      $pw.select();
    }
  }
  $go.addEventListener("click", tryAuth);
  $pw.addEventListener("keydown", e => { if (e.key === "Enter") tryAuth(); });
}

(function () {
  if (localStorage.getItem(STORAGE_KEY) === "1") return;  // 已驗證過
  // 阻止 main app 啟動，先掛 gate
  window.__mlawWaitAuth = true;
  document.addEventListener("DOMContentLoaded", buildGate);
  if (document.readyState !== "loading") buildGate();
})();
