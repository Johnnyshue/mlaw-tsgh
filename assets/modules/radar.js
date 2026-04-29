// 📡 雷區雷達：高風險科別 / 情境
const SPECIALTIES = [
  {name:'急診', level:'high', tips:[
    '胸痛漏 STEMI / dissection',
    '頭痛漏 SAH / meningitis',
    '腹痛漏 mesenteric ischemia / AAA',
    '抗凝者頭部外傷漏 ICH',
    '嬰幼兒發燒漏 sepsis / meningitis'
  ], src:'文獻一致：急診是醫療糾紛前三高'},
  {name:'外科', level:'high', tips:[
    '手術同意書不充分（替代方案、併發症發生率）',
    '手術中異物殘留（紗布、器械）',
    '錯側手術（wrong side surgery）',
    '術後出血未及時處理'
  ], src:'醫療法 §63 + 醫療常規 + 院內 SOP'},
  {name:'婦產科', level:'high', tips:[
    '肩難產：產程中需詳實紀錄',
    '產後出血：及時診斷與處置',
    '新生兒缺氧（cord prolapse, abruption）',
    '剖腹產適應症的告知不充分'
  ], src:'婦產科鑑定報告高頻 keyword'},
  {name:'美容/整形', level:'high', tips:[
    '療效不如預期（保證性語言陷阱）',
    '同意書內容與實際差距',
    '術前術後照差異訴訟常見'
  ], src:'消保法 + 醫療法 §63 §81'},
  {name:'內科', level:'mid', tips:[
    '藥物過敏未充分問診（penicillin, NSAID）',
    '抗生素抗藥性處理',
    '糖尿病併發症告知',
    '慢性病追蹤計畫不明確'
  ], src:'醫療法 §81 + 慢性病常規'},
  {name:'兒科', level:'mid', tips:[
    '嬰幼兒發燒處理',
    '腦膜炎漏診',
    '腸套疊漏診',
    '川崎症診斷遲緩'
  ], src:'兒科鑑定常見'},
  {name:'麻醉科', level:'mid', tips:[
    '麻醉同意書內容',
    '麻醉中監控',
    '麻醉清醒過程意外',
    '惡性高熱應變'
  ], src:'醫療法 §63（麻醉同意書）'},
  {name:'精神科', level:'mid', tips:[
    '自殺風險評估',
    '強制住院程序（精神衛生法）',
    '保密 vs 通報義務（傷害他人威脅）'
  ], src:'精神衛生法、刑法'},
  {name:'家醫科', level:'low', tips:[
    '慢性病管理疏失',
    '藥物交互作用',
    '轉診不及時'
  ], src:'家醫實務'},
  {name:'放射科 / 影像', level:'low', tips:[
    '影像判讀漏診',
    '對比劑過敏告知',
    '輻射劑量告知（兒童）'
  ], src:'放射科常見'},
  {name:'病理科', level:'low', tips:[
    '檢體標示錯誤',
    '判讀錯誤',
    '結果通報延誤'
  ], src:'病理常見'},
  {name:'復健科', level:'low', tips:[
    '電療、針灸併發症告知',
    '長者跌倒風險',
    '療程設計問題'
  ], src:'復健科常規'},
];

const SCENARIOS = [
  {scene:'值班 36 小時連續中',  level:'high', why:'疲勞 → 錯誤率 ↑。但醫療法 §82 IV 工作條件可作為合理裁量考量。'},
  {scene:'會診不到主治',          level:'high', why:'PGY 自行決定可能逾越執業範圍。盡量留會診紀錄。'},
  {scene:'家屬已開始錄音',        level:'high', why:'立刻通報院方，避免單獨對話。表達遺憾依 §7 不會被採證。'},
  {scene:'病人態度激動',          level:'mid',  why:'即使家屬先罵你，回罵 = 訴訟加分。請社工或主治介入。'},
  {scene:'病人/家屬要求改病歷',   level:'high', why:'絕不行。違反醫療法 §68 + 刑法 §215。'},
  {scene:'病人問「有沒有後遺症」', level:'mid',  why:'誠實說明統計數字 + 病歷紀錄。不保證 100%。'},
  {scene:'發現自己用錯藥',        level:'high', why:'立刻通報院方，給病人最佳處置。事後寫病歷補救與通報。'},
  {scene:'病人是熟人',            level:'mid',  why:'仍須走標準流程（同意書、病歷）。熟人糾紛常更難收場。'},
];

async function renderRadar($el) {
  $el.innerHTML = `
    <h1>📡 雷區雷達</h1>
    <p>哪些科別與情境最容易踩雷？資料整理自醫療糾紛文獻與鑑定常見論述。</p>
    <h2>科別風險地圖</h2>
    <div class="radar-grid" id="spec-grid"></div>
    <h2>情境風險地圖</h2>
    <div class="radar-grid" id="scene-grid"></div>
  `;
  const $sg = document.getElementById('spec-grid');
  const lvlMap = {high:'🔴 高風險', mid:'🟡 中風險', low:'🟢 低風險'};
  SPECIALTIES.forEach(s => {
    const div = document.createElement('div');
    div.className = 'radar-card';
    div.innerHTML = `
      <span class="level ${s.level}">${lvlMap[s.level]}</span>
      <h4>${MLAW.escape(s.name)}</h4>
      <ul style="font-size:13px;padding-left:20px;margin:6px 0">
        ${s.tips.map(t=>`<li>${MLAW.escape(t)}</li>`).join('')}
      </ul>
      <div class="stat">📚 ${MLAW.escape(s.src)}</div>
    `;
    $sg.appendChild(div);
  });
  const $cg = document.getElementById('scene-grid');
  SCENARIOS.forEach(s => {
    const div = document.createElement('div');
    div.className = 'radar-card';
    div.innerHTML = `
      <span class="level ${s.level}">${lvlMap[s.level]}</span>
      <h4>${MLAW.escape(s.scene)}</h4>
      <p class="stat" style="font-size:13px">${MLAW.escape(s.why)}</p>
    `;
    $cg.appendChild(div);
  });
}
registerRoute('radar', renderRadar);
