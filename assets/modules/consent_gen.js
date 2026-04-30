// 📋 同意書產生器 — 選手術 → 自動產出該寫的告知項目
const SURGERY_TEMPLATES = [
  { id:'lap_chole', name:'腹腔鏡膽囊切除（lap chole）', risks:[
      '出血需轉開腹（< 1%）',
      '膽管損傷（0.3-0.5%）',
      '手術部位感染（2-3%）',
      '腸道穿孔',
      '麻醉相關（< 0.1%）',
      '需再次手術',
      '心血管事件（依年齡與基礎疾病）'
    ], alts:['保守治療（飲食控制）','症狀加劇時再手術','介入性放射（罕用）'], notreat:'反覆膽囊炎、膽管炎、急性胰臟炎、膽囊穿孔風險' },
  { id:'appendectomy', name:'闌尾切除（appendectomy）', risks:[
      '出血',
      '感染（2-5%）',
      '腸沾黏',
      '需開腹手術',
      '麻醉相關'
    ], alts:['抗生素治療（特定條件）'], notreat:'闌尾穿孔、腹膜炎、敗血症' },
  { id:'csection', name:'剖腹產（C-section）', risks:[
      '出血需輸血（1-2%）',
      '子宮切除（< 1%）',
      '膀胱、腸道損傷',
      '感染（< 5%）',
      '麻醉相關',
      '對未來生產影響（VBAC limits）',
      '深部靜脈血栓 / 肺栓塞'
    ], alts:['VBAC（前次剖腹再嘗試陰道產）','繼續陰道產試產'], notreat:'視適應症而定（cord prolapse / fetal distress 直接威脅生命）' },
  { id:'tha', name:'人工髖關節置換（THA）', risks:[
      '感染',
      '脫位（dislocation）',
      '深部靜脈血栓 / 肺栓塞',
      '神經損傷（坐骨神經、股神經）',
      '骨折',
      '長度差異',
      '需翻修手術（10-15 年）',
      '麻醉相關'
    ], alts:['保守治療（藥物、復健）','關節注射','截骨術'], notreat:'關節炎進展、行動受限、生活品質下降' },
  { id:'cabg', name:'冠狀動脈繞道手術（CABG）', risks:[
      '中風（1-3%）',
      '心肌梗塞',
      '出血需再開刀',
      '感染（傷口、縱隔炎）',
      '腎衰竭',
      '心律不整',
      'graft 失敗 / 再狹窄',
      '死亡（依風險評分 1-5%）'
    ], alts:['PCI 心導管','藥物治療'], notreat:'心肌梗塞、心衰竭、猝死風險' },
  { id:'cataract', name:'白內障手術（cataract surgery）', risks:[
      '感染（0.05%）',
      '眼壓升高（短暫或長期）',
      '視網膜剝離（< 1%）',
      '黃斑部水腫',
      '後囊膜混濁（10-30%，可雷射處理）',
      '視力短暫下降（術後一週內）',
      '眼鏡度數變化'
    ], alts:['暫不手術觀察','使用其他眼鏡 / 助視器'], notreat:'視力進行性下降、影響生活' },
  { id:'colonoscopy', name:'大腸鏡檢查 / 切除（colonoscopy ± polypectomy）', risks:[
      '腸穿孔（< 0.1%，切除息肉時 ↑）',
      '出血',
      '麻醉相關',
      '腹脹、暫時性腹痛',
      '心律不整（鎮靜時）'
    ], alts:['Sigmoidoscopy','糞便潛血','CT colonography'], notreat:'大腸癌篩檢延誤、息肉惡化' },
  { id:'cardiac_cath', name:'心導管檢查 / PCI', risks:[
      '出血、血腫（穿刺處）',
      '對比劑腎病變（CIN）',
      '對比劑過敏',
      '血管損傷、血栓',
      '中風（0.5%）',
      '心律不整',
      '緊急 CABG（< 1%）',
      '死亡（< 0.5%，依適應症與病況）'
    ], alts:['藥物治療','非侵入性檢查（CT angio、stress test）'], notreat:'心肌梗塞風險未排除、心絞痛持續' }
];

async function renderConsentGen($el) {
  $el.innerHTML = `
    <h1>📋 同意書產生器</h1>
    <p>選一個手術，自動產出**手術同意書應包含的告知項目**（醫療法 §63）。
       貼進病歷或同意書時，記得**個別化**（依病人情況加註特殊風險）。</p>
    <select id="cg-select">
      <option value="">— 選擇手術 —</option>
      ${SURGERY_TEMPLATES.map(s=>`<option value="${s.id}">${MLAW.escape(s.name)}</option>`).join('')}
      <option value="custom">📝 自訂手術名稱</option>
    </select>
    <input id="cg-custom" type="text" placeholder="自訂手術名稱" style="display:none">
    <div id="cg-extra" style="margin-top:14px"></div>
    <div id="cg-output"></div>
  `;
  const $sel = document.getElementById('cg-select');
  const $custom = document.getElementById('cg-custom');
  const $output = document.getElementById('cg-output');
  const $extra = document.getElementById('cg-extra');

  $sel.addEventListener('change', e => {
    if (e.target.value === 'custom') {
      $custom.style.display = 'block';
      $output.innerHTML = '';
    } else if (e.target.value) {
      $custom.style.display = 'none';
      const t = SURGERY_TEMPLATES.find(s => s.id === e.target.value);
      $extra.innerHTML = `
        <h3 style="margin-bottom:6px">🧑 病人個別化資訊（選填，會加進同意書）</h3>
        <input id="cg-age" type="text" placeholder="病人年齡（例：65）" style="margin:4px 0">
        <input id="cg-cond" type="text" placeholder="病人特殊狀況（例：HTN, DM, GFR 45, 抗凝中）" style="margin:4px 0">
        <button id="cg-render">📄 產生同意書內容</button>
      `;
      document.getElementById('cg-render').addEventListener('click', () => render(t));
      $output.innerHTML = '';
    } else {
      $extra.innerHTML = '';
      $output.innerHTML = '';
    }
  });

  function render(t) {
    const age = document.getElementById('cg-age')?.value.trim();
    const cond = document.getElementById('cg-cond')?.value.trim();
    const date = new Date().toISOString().slice(0,10);
    const text = `
=== 手術同意書（${t.name}）告知項目 ===
日期：${date}

【手術原因】
（請依病人診斷填寫，例：症狀性膽結石反覆膽絞痛影響生活）

【手術方式】
${t.name}

【成功率】
> 95%（具體數字需依病人風險與術者經驗調整）

【主要風險與併發症】
${t.risks.map((r,i)=>`${i+1}. ${r}`).join('\n')}

${age || cond ? `
【針對本病人的個別化風險】
${age ? `- 年齡 ${age} 歲：心血管事件風險、術後復原時間` : ''}
${cond ? `- 特殊狀況：${cond}` : ''}
（請補充對此病人的具體影響）
` : ''}

【替代方案】
${t.alts.map((a,i)=>`${i+1}. ${a}`).join('\n')}

【不治療的後果】
${t.notreat}

【病人 / 家屬簽名】
病人：__________________ 簽名 / 日期
法定代理人 / 配偶 / 親屬：__________________ 簽名 / 日期
醫師：__________________ 簽名 / 日期

【醫師同步登錄病歷的範本】
\`\`\`
已向病人 ${age ? `（${age} 歲）` : ''}及家屬詳細說明：
1. 手術原因與必要性
2. 手術方式：${t.name}
3. 成功率與替代方案（${t.alts.join('、')}）
4. 主要風險：${t.risks.slice(0,3).join('、')}等${t.risks.length} 項
5. 不治療的後果：${t.notreat}
${cond ? `6. 針對病人特殊狀況（${cond}）已個別化說明` : ''}
病人/家屬表示理解並同意，已簽具手術同意書及麻醉同意書。
給予 24 小時思考時間。
\`\`\`

📚 法源：醫療法 §63、§81；最高法院 94 台上 2676（具體可預見風險）
📚 對應大師：楊秀儀（告知時機）、楊坤仁（告知是判賠第一名原因）、黃清濱（個別化）
`.trim();

    $output.innerHTML = `
      <div class="card">
        <pre id="cg-text" style="white-space:pre-wrap;background:var(--panel-2);padding:14px;border-radius:6px;font-size:12px;line-height:1.7"></pre>
        <button id="cg-copy" style="margin-top:8px">📋 複製到剪貼簿</button>
      </div>
    `;
    document.getElementById('cg-text').textContent = text;
    document.getElementById('cg-copy').addEventListener('click', () => {
      navigator.clipboard.writeText(text);
      const b = document.getElementById('cg-copy');
      b.textContent = '✅ 已複製';
      setTimeout(()=>b.textContent='📋 複製到剪貼簿', 2000);
    });
  }

  if (!document.getElementById('cg-style')) {
    const s = document.createElement('style');
    s.id='cg-style';
    s.textContent = `
      #cg-select, #cg-custom, #cg-age, #cg-cond {
        width:100%;padding:10px 14px;background:var(--panel);border:1px solid var(--border);
        color:var(--fg);border-radius:6px;font-size:14px;
      }
      #cg-render, #cg-copy{
        background:var(--accent);color:#000;border:0;padding:8px 14px;border-radius:6px;
        cursor:pointer;font-size:13px;
      }
      #cg-render:hover, #cg-copy:hover{background:#ea580c}
    `;
    document.head.appendChild(s);
  }
}
registerRoute('consent-gen', renderConsentGen);
