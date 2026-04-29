// 📝 知情同意檢查
const CONSENT = [
  {key:'when', t:'手術前至少數小時或前一日告知（不是進手術房才簽）', sub:'醫療法 §63 — 同意要有「合理思考時間」'},
  {key:'who', t:'告知對象正確（病人本人；無能力時依法定順位：法定代理人 → 配偶 → 親屬）', sub:'醫療法 §63 II'},
  {key:'oral', t:'已口頭講解（不是只簽字）', sub:'醫療法 §63 + §81'},
  {key:'written', t:'病人/家屬已簽手術同意書 + 麻醉同意書', sub:'醫療法 §63 III'},
  {key:'why', t:'告知手術原因與必要性', sub:'醫療法 §63 I'},
  {key:'rate', t:'告知手術成功率與失敗風險', sub:'醫療法 §63 I'},
  {key:'risk', t:'告知主要併發症（含發生率）', sub:'醫療法 §63 I'},
  {key:'alt', t:'告知替代方案（含「不治療」的後果）', sub:'醫療法 §81 隱含'},
  {key:'questions', t:'給病人/家屬問問題的時間', sub:'實務必要'},
  {key:'record', t:'病歷紀錄當下溝通內容（含對方反應）', sub:'醫療法 §67 §68'},
  {key:'invasive', t:'若是侵入性檢查或治療，另簽侵入性檢查同意書', sub:'醫療法 §64'},
  {key:'minor', t:'病人未成年 → 法定代理人簽（同意書 II 項）', sub:'醫療法 §63 II'},
];

async function renderConsent($el) {
  $el.innerHTML = `
    <h1>📝 知情同意檢查</h1>
    <p>每次手術 / 侵入性檢查前，逐一勾選。所有項目都打勾 = 法律要求基本完成。</p>
    <div id="consent-list"></div>
    <div class="checklist-summary" id="consent-sum"></div>
    <div class="card warn" style="margin-top:14px">
      <h3>⚠️ 即使全部勾選，也要記得</h3>
      <ul>
        <li>同意書 ≠ 免責萬靈丹（過失仍負責）</li>
        <li>未告知的風險發生 = 仍可能負民事</li>
        <li>同意書內容要與病歷紀錄相符</li>
      </ul>
    </div>
  `;
  const $list = document.getElementById('consent-list');
  CONSENT.forEach(item => {
    const div = document.createElement('div');
    div.className = 'checklist-item';
    div.innerHTML = `
      <input type="checkbox" id="c-${item.key}">
      <label for="c-${item.key}">${MLAW.escape(item.t)}<small>📚 ${MLAW.escape(item.sub)}</small></label>
    `;
    $list.appendChild(div);
  });
  function update() {
    const total = CONSENT.length;
    const done = CONSENT.filter(i => document.getElementById(`c-${i.key}`).checked).length;
    const $sum = document.getElementById('consent-sum');
    const pct = Math.round(done/total*100);
    let level, color;
    if (pct === 100) { level='✅ 完整'; color='var(--good)'; }
    else if (pct >= 80) { level='🟡 大致完整，補完剩下幾項'; color='var(--warn)'; }
    else { level='🚨 缺漏太多，不要進手術房'; color='var(--bad)'; }
    $sum.innerHTML = `<b style="color:${color}">${level}</b><br>已完成 ${done} / ${total} （${pct}%）`;
  }
  $list.addEventListener('change', update);
  update();
}
registerRoute('consent', renderConsent);
