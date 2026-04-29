// 🚦 DO/DON'T 卡片
const DOSDONTS = [
  // 1. 知情同意
  {cat:'知情同意', do:'手術前至少數小時，口頭講解 + 簽同意書 + 病歷紀錄 (三合一)', dont:'進手術房才簽同意書 / 空白同意書讓家屬「先簽再說」', src:'醫療法 §63'},
  {cat:'知情同意', do:'告知「不治療的後果」與「替代方案」', dont:'只講你建議的方案，沒講替代', src:'醫療法 §81'},
  {cat:'知情同意', do:'病人有意識能力 → 病人本人簽', dont:'病人意識清楚卻讓家屬代簽', src:'醫療法 §63 II'},
  {cat:'知情同意', do:'病人意識不清 → 法定順位簽（法定代理人 > 配偶 > 親屬）', dont:'急症情況拖延簽署延誤救治', src:'醫療法 §63 但書'},

  // 2. 病歷
  {cat:'病歷', do:'親自記載 + 簽名 + 日期', dont:'別人代寫沒檢查就簽名', src:'醫療法 §68 I'},
  {cat:'病歷', do:'修改用畫線保留原文 + 簽名 + 註明修改時間', dont:'用塗黑 / 立可白 / 撕掉重寫', src:'醫療法 §68 II'},
  {cat:'病歷', do:'急診口頭醫囑 → 24 小時內補書面', dont:'事後補登不註明補登時間', src:'醫療法 §68 III'},
  {cat:'病歷', do:'寫具體：時間、項目、判斷依據', dont:'用「stable」「OK」「f/u」作為病歷內容', src:'醫療法 §67'},
  {cat:'病歷', do:'寫追蹤計畫（24h / 出院前 / 回診）', dont:'寫情緒化評論（「病人很煩」「家屬難搞」）', src:'醫療法 §67 §68'},

  // 3. 急診
  {cat:'急診', do:'30 歲以上胸痛 → 10 分鐘內 EKG', dont:'「年輕人不會 MI」就先觀察', src:'臨床常規（鑑定常引）'},
  {cat:'急診', do:'抗凝者頭部外傷 → CT', dont:'「沒症狀就觀察」省 CT', src:'NICE / Canadian CT Head Rule'},
  {cat:'急診', do:'離院前寫衛教（紅旗症狀清單 + 何時回診）', dont:'病人說沒事就讓他走，沒寫衛教', src:'醫療法 §81'},
  {cat:'急診', do:'病人堅持出院 → 簽 AAD + 詳細病歷紀錄勸告與風險', dont:'病人說要走就讓他走，沒簽 AAD', src:'醫療法 §63 §68'},

  // 4. 醫病溝通
  {cat:'溝通', do:'不確定時用「我們會持續觀察」', dont:'保證 100% 不會有問題', src:'實務法則'},
  {cat:'溝通', do:'真不知道時誠實說「目前無法確認」', dont:'瞎掰原因讓病人安心', src:'醫師法 §12-1'},
  {cat:'溝通', do:'家屬激動時請社工或主治介入', dont:'單獨與激動家屬硬碰硬', src:'院方危機處理 SOP'},

  // 5. 醫糾發生
  {cat:'醫糾發生', do:'立刻通報院方', dont:'自己處理，希望病人就此忘記', src:'醫療法 §107'},
  {cat:'醫糾發生', do:'表達遺憾（不會被當證據）', dont:'承認過失 / 承諾賠償', src:'醫療事故法 §7'},
  {cat:'醫糾發生', do:'保留所有紀錄（病歷、影像、line）', dont:'刪除 line / 通訊紀錄', src:'刑法 §165 湮滅證據'},
  {cat:'醫糾發生', do:'通知個人保險公司', dont:'私下和解，沒走保險', src:'醫責險條款'},

  // 6. 跨科 / 轉診
  {cat:'轉診', do:'能力之外立刻會診或轉診', dont:'跨科自己硬處理', src:'醫師法 §22'},
  {cat:'轉診', do:'轉診附完整摘要', dont:'轉診只一張紙摘要敷衍', src:'醫療法 §74'},

  // 7. 危急
  {cat:'急救', do:'危急病人立即依專業救治', dont:'「我不是專科」拒收急救', src:'醫師法 §21'},
  {cat:'急救', do:'急症先救命，事後補同意書', dont:'急症硬等家屬簽同意書', src:'醫療法 §63 但書'},

  // 8. 個資
  {cat:'個資', do:'討論 case 看周遭沒有其他病人', dont:'公共電梯、餐廳討論病人 case', src:'個資法 §6 + 醫師法 §23'},
  {cat:'個資', do:'臉書 / IG 不發 case 任何資訊', dont:'匿名發 case 在社群', src:'個資法 §41'},
  {cat:'個資', do:'病人複本要求依法核發', dont:'拒絕病人取得病歷', src:'醫療法 §74'},

  // 9. 健保 / 文書
  {cat:'文書', do:'死亡證明書如實填寫', dont:'家屬要求改死因為「自然死」', src:'醫師法 §17 / 刑法 §215'},
  {cat:'文書', do:'健保申報如實', dont:'浮報、虛報', src:'健保法 §81'},

  // 10. 利益衝突
  {cat:'利益', do:'與廠商有利害關係先 disclose', dont:'隱匿股東身份推薦自家產品', src:'醫師法 §28-1'},
  {cat:'利益', do:'高價贈禮告知院方倫理委員會', dont:'私下收取病人現金紅包', src:'院方倫理規範'},
];

async function renderDosDonts($el) {
  const cats = [...new Set(DOSDONTS.map(d=>d.cat))];
  $el.innerHTML = `
    <h1>🚦 DO / DON'T 卡片</h1>
    <p>${DOSDONTS.length} 張防身卡片，每張掛真實法源。可篩選分類。</p>
    <div style="margin:14px 0">
      <button class="filter-btn active" data-cat="all">全部</button>
      ${cats.map(c=>`<button class="filter-btn" data-cat="${c}">${c}</button>`).join('')}
    </div>
    <div id="dod-grid"></div>
  `;
  const $grid = document.getElementById('dod-grid');
  function paint(cat) {
    const items = cat==='all' ? DOSDONTS : DOSDONTS.filter(d=>d.cat===cat);
    $grid.innerHTML = `<div class="dosdonts-grid">` + items.map(d => `
      <div class="dod-card do">
        <span class="tag">${d.cat}</span>
        <h4>✅ DO</h4>
        <p>${MLAW.escape(d.do)}</p>
        <div class="src">📚 ${MLAW.escape(d.src)}</div>
      </div>
      <div class="dod-card dont">
        <span class="tag">${d.cat}</span>
        <h4>❌ DON'T</h4>
        <p>${MLAW.escape(d.dont)}</p>
        <div class="src">📚 ${MLAW.escape(d.src)}</div>
      </div>
    `).join('') + `</div>`;
  }
  paint('all');
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      paint(btn.dataset.cat);
    });
  });
  // 加 button 樣式 inline
  if (!document.getElementById('dod-style')) {
    const s = document.createElement('style');
    s.id='dod-style';
    s.textContent = `
      .filter-btn{background:var(--panel);border:1px solid var(--border);color:var(--fg);
        padding:5px 12px;margin:2px;border-radius:14px;font-size:12px;cursor:pointer}
      .filter-btn.active{background:var(--accent);color:#000;border-color:var(--accent)}
    `;
    document.head.appendChild(s);
  }
}
registerRoute('dosdonts', renderDosDonts);
