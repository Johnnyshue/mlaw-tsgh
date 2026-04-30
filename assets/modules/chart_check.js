// 📝 病歷檢查器 — 貼一段病歷，自動找漏洞
// 規則為簡化版啟發式檢查，不能取代真實鑑定，僅提示常見漏掉項
const RULES = [
  { key:'time_stamp', re:/(\d{1,2}:\d{2}|\d{1,2}\/\d{1,2})/, tip:'有時間戳記', warn:'缺時間戳記（法庭最重視時序）'},
  { key:'vital_sign', re:/(BP|血壓|HR|心跳|RR|呼吸|SpO|體溫|溫度|GCS)/i, tip:'有 vital sign / GCS', warn:'缺 vital sign（急診/病房紀錄基本要求）'},
  { key:'soap_s', re:/(主訴|chief complaint|cc:|S:|症狀)/i, tip:'有主訴（S）', warn:'缺主訴／病史描述'},
  { key:'soap_o', re:/(理學|身體檢查|PE:|O:|檢查|exam|EKG|X.{0,3}光|超音波|CT|MRI|抽血|血液|lab)/i, tip:'有理學/檢查（O）', warn:'缺理學檢查或檢查結果（O）'},
  { key:'soap_a', re:/(評估|診斷|impression|A:|DDx|rule.{0,3}out|r\/o|疑似)/i, tip:'有評估／鑑別診斷（A）', warn:'缺評估／鑑別診斷（A）— 法官會問「你想了什麼」'},
  { key:'soap_p', re:/(處置|處方|計畫|plan|P:|追蹤|f\/u|admit|出院|轉診|觀察)/i, tip:'有處置／計畫（P）', warn:'缺處置／計畫（P）— 法官會問「你做了什麼」'},
  { key:'inform', re:/(告知|說明|同意|簽署|consent|了解|理解|衛教)/i, tip:'有告知／衛教紀錄', warn:'缺告知／衛教紀錄（醫療法 §63 §81）'},
  { key:'family_response', re:/(家屬|配偶|父母|簽名|代理|表示|同意|拒絕|猶豫)/i, tip:'有家屬／病人反應紀錄', warn:'缺家屬／病人反應（可選，但建議寫）'},
  { key:'follow_up', re:/(回診|f\/u|follow|追蹤|預約|約診|出院後|24.{0,3}小時|發燒.{0,5}回|紅旗)/i, tip:'有追蹤計畫', warn:'缺追蹤計畫（特別是出院/離院前）'},
  { key:'red_flag', re:/(立刻|立即|馬上|急診|119|嚴重|惡化|加劇|危急)/i, tip:'有紅旗症狀說明', warn:'未提及紅旗症狀（出院前必寫）'},
  { key:'reason', re:/(因為|根據|依照|guideline|指引|原因|考量|評估後)/i, tip:'有判斷理由（依據）', warn:'缺判斷依據／理由（合理裁量需要根據）'},
  { key:'signature', re:/(簽名|sign|王|陳|林|張|李|黃|劉|蔡|楊|徐|郭|許|主治|主任|住院醫師|PGY|R[1-5]|醫師)/i, tip:'有醫師署名', warn:'缺醫師署名／日期'},
];

const RED_FLAGS = [
  { key:'no_correct', re:/(立可白|塗黑|撕|刪除|抹掉)/, msg:'🚨 病歷塗改方式違法（醫療法 §68 II 禁止塗銷）' },
  { key:'emotion', re:/(很煩|難搞|難纏|不配合|機車|找麻煩|笨|蠢|沒水準)/, msg:'🚨 情緒化用語（病人會看到病歷，法官也會）' },
  { key:'guarantee', re:/(保證|絕對不會|一定不會|100%|百分之百|沒問題)/, msg:'🚨 醫療絕對保證 = 訴訟自殺' },
  { key:'pure_ok', re:/^(stable|OK|好|正常|無異常|f\/u)$/im, msg:'🚨 過於模糊（鑑定看不到判斷依據）' },
];

async function renderChartCheck($el) {
  $el.innerHTML = `
    <h1>📝 病歷檢查器</h1>
    <p>把你寫的病歷段落貼進來，自動列出**可能缺的部分**。</p>
    <p style="color:var(--fg-2);font-size:13px">⚠️ 這只是啟發式檢查，不能取代法律或臨床判斷。輸出的內容**只儲存在你瀏覽器**，不會上傳。</p>
    <textarea id="chart-input" rows="12" placeholder="例：&#10;[2026-04-30 03:25 急診]&#10;S: 70 y/o 男性，胸痛 30 min&#10;O: BP 92/55, HR 110...&#10;A: STEMI&#10;P: aspirin 300mg + 送 cath lab"></textarea>
    <div style="display:flex;gap:8px;margin:10px 0">
      <button id="chart-check-btn">🔍 檢查</button>
      <button id="chart-clear-btn">🗑️ 清空</button>
      <button id="chart-sample-btn">📋 載入範例</button>
    </div>
    <div id="chart-result"></div>
  `;
  const $input = document.getElementById('chart-input');
  const $result = document.getElementById('chart-result');

  // 載入儲存的草稿
  const saved = localStorage.getItem('mlaw_chart_draft');
  if (saved) $input.value = saved;
  $input.addEventListener('input', () => localStorage.setItem('mlaw_chart_draft', $input.value));

  document.getElementById('chart-check-btn').addEventListener('click', () => doCheck($input.value));
  document.getElementById('chart-clear-btn').addEventListener('click', () => {
    $input.value = ''; localStorage.removeItem('mlaw_chart_draft'); $result.innerHTML = '';
  });
  document.getElementById('chart-sample-btn').addEventListener('click', () => {
    $input.value = `[2026-04-30 03:25 急診]
S: 70 y/o 男性，過去史 HTN、DM 10 yrs，於 30 分鐘前突發胸前壓迫痛伴出汗，疼痛輻射至左肩。
O: BP 92/55, HR 110, RR 22, SpO2 95% room air. 神清。
   EKG: ST elevation 2mm in II, III, aVF（隨附）；TnI 12.4 ng/mL。
A: Inferior wall STEMI s/p RCA suspicion (ESC 2023 STEMI guideline)
   #Cardiogenic shock concern (BP↓, HR↑)
P: 1. ABC stable; O2 supply 4L NC
   2. Aspirin 300mg + Clopidogrel 600mg PO loaded
   3. Stat consult Cardiology Dr. 王（03:30 來電同意 emergent PCI）
   4. NPO; activate cath lab; transfer at 03:50 with monitor
   5. 已向太太（簽名）說明：cath 必要性、出血/CIN/blood clot/死亡風險約 1-3%
   6. 太太同意手術，簽手術同意書及麻醉同意書
   7. F/u: post-PCI care in CCU
PGY 王XX 簽`;
  });

  function doCheck(text) {
    if (!text.trim()) { $result.innerHTML = '<p style="color:var(--fg-2)">請先貼病歷</p>'; return; }
    const passed = [], missing = [];
    for (const r of RULES) {
      if (r.re.test(text)) passed.push(r); else missing.push(r);
    }
    const flags = [];
    for (const f of RED_FLAGS) {
      if (f.re.test(text)) flags.push(f);
    }
    const score = Math.round(passed.length / RULES.length * 100);
    let level, color;
    if (score >= 90) { level = '✅ 完整'; color = 'var(--good)'; }
    else if (score >= 70) { level = '🟡 大致 OK，但有缺漏'; color = 'var(--warn)'; }
    else { level = '🚨 缺太多，補一下再下班'; color = 'var(--bad)'; }
    $result.innerHTML = `
      <div class="card" style="border-left:4px solid ${color}">
        <h3 style="margin:0;color:${color}">${level} （${passed.length}/${RULES.length}，${score}%）</h3>
      </div>
      ${flags.length ? `
        <div class="card bad">
          <h3 style="margin-top:0">🚨 嚴重警告</h3>
          ${flags.map(f => `<p>${MLAW.escape(f.msg)}</p>`).join('')}
        </div>` : ''}
      <div class="card good">
        <h3 style="margin-top:0">✅ 已涵蓋（${passed.length}）</h3>
        <ul>${passed.map(r => `<li>${MLAW.escape(r.tip)}</li>`).join('')}</ul>
      </div>
      ${missing.length ? `
        <div class="card warn">
          <h3 style="margin-top:0">⚠️ 建議補上（${missing.length}）</h3>
          <ul>${missing.map(r => `<li>${MLAW.escape(r.warn)}</li>`).join('')}</ul>
        </div>` : ''}
      <div class="card">
        <p style="font-size:12px;color:var(--fg-2);margin:0">
          📚 參考：醫療法 §67 §68 §81、醫師法 §12、master_yang_kun_ren.md（病歷觀點）
        </p>
      </div>
    `;
  }

  if (!document.getElementById('chart-style')) {
    const s = document.createElement('style');
    s.id = 'chart-style';
    s.textContent = `
      #chart-input{
        width:100%;padding:12px;background:var(--panel-2);border:1px solid var(--border);
        color:var(--fg);border-radius:6px;font-family:'Menlo',monospace;font-size:13px;
        line-height:1.7;resize:vertical;
      }
      #chart-result button, #chart-check-btn, #chart-clear-btn, #chart-sample-btn{
        background:var(--panel-2);border:1px solid var(--border);color:var(--fg);
        padding:8px 14px;border-radius:6px;cursor:pointer;font-size:13px;
      }
      #chart-check-btn{background:var(--accent);color:#000;border-color:var(--accent)}
      #chart-check-btn:hover{background:#ea580c}
      #chart-clear-btn:hover, #chart-sample-btn:hover{border-color:var(--accent)}
    `;
    document.head.appendChild(s);
  }
}
registerRoute('chart-check', renderChartCheck);
