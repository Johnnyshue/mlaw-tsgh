// ⚡ 半夜值班 30 秒決策樹 — 遇到突發狀況的快速判斷工具
const DECISIONS = [
  {
    id: 'patient_wants_leave',
    icon: '🚪',
    trigger: '病人說「我要走」',
    flow: [
      {q: '病人有沒有意識能力？（清醒、能答話、知道自己在哪）', y: 1, n: 'no_capacity'},
      {q: '是否有立即生命威脅？（vital sign 不穩、急性 ACS、急腹症、< 3 個月嬰兒發燒）', y: 'high_risk', n: 'low_risk'}
    ],
    outcomes: {
      high_risk: {
        title: '🔴 高風險病人堅持離院',
        steps: [
          '1. 先勸阻：用「具體風險」勸告，不是「會很嚴重」',
          '2. 升級會診：請主治或夜班總值班再次說明',
          '3. 病人仍堅持 → 簽 AAD 同意書',
          '4. 病歷詳記：說明內容、勸告過程、家屬反應、決定理由',
          '5. 給衛教單（紅旗症狀回診條件）',
          '6. 如有家屬簽見證'
        ],
        risk: '不簽 AAD 直接放走 = 違反醫師法 §21；簽了 AAD 但病歷沒寫 = 也輸',
        law: '醫療法 §63 §81、醫師法 §21'
      },
      low_risk: {
        title: '🟢 低風險病人離院',
        steps: [
          '1. 確認衛教（症狀復發紅旗、回診時機）',
          '2. 病歷紀錄：「病人意識清楚，醫療上 stable，已衛教，自主出院」',
          '3. 給衛教單'
        ],
        risk: '低風險 ≠ 零風險。仍要寫衛教與紅旗',
        law: '醫療法 §81'
      },
      no_capacity: {
        title: '⚠️ 病人無意識能力',
        steps: [
          '1. AAD 不適用（無意識能力簽同意無效）',
          '2. 啟動院方倫理委員會 + 社工',
          '3. 家屬無法決定 / 與病人意願衝突 → 法院裁定',
          '4. 緊急情況依醫師法 §21 處置'
        ],
        risk: '讓無意識能力的病人「自願出院」 = 等於放走，責任在你',
        law: '醫療法 §63 II、醫師法 §21'
      }
    }
  },
  {
    id: 'family_demands_change_records',
    icon: '✏️',
    trigger: '家屬/同事要求改病歷',
    flow: [
      {q: '是「合法補記」還是「修改原文」？', y: 'amend_legal', n: 'modify_illegal'}
    ],
    outcomes: {
      amend_legal: {
        title: '🟢 合法補記',
        steps: [
          '1. 保留原文不動',
          '2. 在後面附記：「XX/XX 補記：發現 XX/XX 漏記 OO，補充如下：...」',
          '3. 簽名 + 補記時間',
          '4. 主動向科主任報告（不是修病歷的事，是醫療事件）'
        ],
        risk: '透明 + 留痕跡 = 法院信任',
        law: '醫療法 §68 II'
      },
      modify_illegal: {
        title: '🔴🔴 千萬不要改原文',
        steps: [
          '⛔ 立刻停止',
          '⛔ 即使「沒人會發現」也不要改',
          '⛔ 電子病歷有 audit log，所有修改全留痕跡',
          '✅ 如果發現病歷有錯，用「合法補記」格式',
          '✅ 主動通報科主任 + 院方法務'
        ],
        risk: '刑法 §215（業務文書登載不實 3 年以下）+ §210（偽造私文書 5 年以下）+ 舉證責任轉換 = 從可能無事變必有罪',
        law: '刑法 §215 §210、醫療法 §68'
      }
    }
  },
  {
    id: 'attending_unreachable',
    icon: '📵',
    trigger: '病人惡化，主治不接 line',
    flow: [
      {q: '是否危及生命？（vital sign 不穩、休克、神經學改變）', y: 'critical', n: 'urgent'}
    ],
    outcomes: {
      critical: {
        title: '🔴 危及生命',
        steps: [
          '1. ⚡ 立刻依 ABC + ACLS / sepsis bundle 處置',
          '2. 同時請護理師打總值班醫師（院內 backup）',
          '3. 護理師同時打主治家中電話（聯絡單）',
          '4. 必要時 call code（CPR team）',
          '5. **所有時間點記錄在病歷**：18:00 line 主治未讀；18:05 撥電話無人接；18:08 通知總值班...',
          '6. 升級到 ICU 會診'
        ],
        risk: '等主治回 = 違反醫師法 §21（無故拖延）= 過失',
        law: '醫師法 §21、醫療法 §82（合理裁量考慮工作條件）'
      },
      urgent: {
        title: '🟡 急但非危及生命',
        steps: [
          '1. 病人 stable 後，再嘗試聯繫',
          '2. 嘗試 line / 電話 / 簡訊多管齊下',
          '3. 同時找科內其他主治（共同主治制度）',
          '4. 30 分鐘內聯絡不到 → 通知總值班',
          '5. 全部紀錄時間點'
        ],
        risk: '雖非立即危險，仍要有「升級嘗試」的紀錄',
        law: '醫師法 §22'
      }
    }
  },
  {
    id: 'family_aggressive',
    icon: '😡',
    trigger: '家屬情緒失控 / 威脅',
    flow: [
      {q: '是否有肢體威脅或人身安全疑慮？', y: 'physical_threat', n: 'verbal_only'}
    ],
    outcomes: {
      physical_threat: {
        title: '🚨 人身威脅',
        steps: [
          '1. 立刻保持安全距離，不要硬碰',
          '2. 通知保全 / 警衛 / 護理長',
          '3. 必要時報警',
          '4. **不要單獨留在現場**',
          '5. 事後寫「事件報告書」（incident report）',
          '6. 如有受傷或威脅錄音 → 保存證據'
        ],
        risk: '醫療事故法 §8、§19 保護醫療人員不受暴力',
        law: '醫療事故預防及爭議處理法 §8 §19、醫療法相關'
      },
      verbal_only: {
        title: '🟡 言語衝突',
        steps: [
          '1. 不要對抗，不要回罵',
          '2. 「我能理解您現在的感受，這個結果不是我們希望的」（道歉條款保護的話）',
          '3. 通知院方關懷小組（醫預法 §6）',
          '4. 安排到家屬休息室',
          '5. 由科主任 + 關懷小組統一說明',
          '6. **不要單獨見家屬**'
        ],
        risk: '單獨對話可能被錄音剪輯成「醫師承認過失」',
        law: '醫療事故預防及爭議處理法 §6 §7（道歉條款）'
      }
    }
  },
  {
    id: 'medication_error',
    icon: '💊',
    trigger: '發現自己給錯藥',
    flow: [
      {q: '病人是否已出現副作用？', y: 'reaction', n: 'no_reaction'}
    ],
    outcomes: {
      reaction: {
        title: '🚨 已有副作用',
        steps: [
          '1. ⚡ 立刻停藥 + 對症處置（過敏 → epinephrine、過量 → antidote）',
          '2. 通知主治 + 病房護理長',
          '3. 啟動院方藥物事件報告（incident report）',
          '4. 病歷詳記事件經過 + 處置（時間戳記）',
          '5. **告知病人/家屬**事件經過（按醫預法）',
          '6. 通知個人責任險公司'
        ],
        risk: '隱匿不報 = 後續訴訟證據不利；主動通報 = 院方 backup 你',
        law: '醫療法 §107（事故通報）、醫預法 §6'
      },
      no_reaction: {
        title: '🟢 尚未發生副作用',
        steps: [
          '1. 立刻檢查實際給藥情況（劑量？時間？）',
          '2. 評估病人需 monitor 多久',
          '3. 通知主治 + 護理長',
          '4. 病歷紀錄事件經過 + 預防措施',
          '5. 啟動 incident report（即使無副作用也要）',
          '6. 告知病人發生了什麼'
        ],
        risk: '即使沒副作用，掩蓋仍違法。透明處理才能保護自己',
        law: '醫療法 §68 §107、醫預法 §6'
      }
    }
  }
];

async function renderDecision($el) {
  $el.innerHTML = `
    <h1>⚡ 半夜值班 30 秒決策樹</h1>
    <p>遇到突發狀況時，照流程跳幾下就有方向。每個情境的最後都告訴你：怎麼做、為什麼、踩雷的後果、法源。</p>
    <p style="color:var(--fg-2);font-size:13px">💡 點下面任一個情境開始：</p>
    <div id="dec-list"></div>
  `;
  const $list = document.getElementById('dec-list');
  DECISIONS.forEach((d, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'dec-card';
    wrap.innerHTML = `
      <div class="dec-trigger" data-i="${i}">
        <span class="dec-icon">${d.icon}</span>
        <span class="dec-title">${MLAW.escape(d.trigger)}</span>
        <span class="dec-arrow">▼</span>
      </div>
      <div class="dec-body" id="body-${i}"></div>
    `;
    $list.appendChild(wrap);
  });

  $list.addEventListener('click', e => {
    const trigger = e.target.closest('.dec-trigger');
    if (trigger) {
      const i = +trigger.dataset.i;
      const body = document.getElementById(`body-${i}`);
      if (body.classList.contains('open')) {
        body.classList.remove('open');
        body.innerHTML = '';
      } else {
        body.classList.add('open');
        renderFlow(body, DECISIONS[i], 0);
      }
      return;
    }
    const ans = e.target.closest('.dec-ans');
    if (ans) {
      const card = ans.closest('.dec-body');
      const decId = +ans.dataset.dec;
      const stepIdx = +ans.dataset.step;
      const choice = ans.dataset.choice; // 'y' or 'n'
      const d = DECISIONS[decId];
      const next = d.flow[stepIdx][choice];
      if (typeof next === 'number') {
        renderFlow(card, d, next);
      } else {
        renderOutcome(card, d.outcomes[next]);
      }
    }
    const reset = e.target.closest('.dec-reset');
    if (reset) {
      const card = reset.closest('.dec-body');
      const decId = +reset.dataset.dec;
      renderFlow(card, DECISIONS[decId], 0);
    }
  });

  if (!document.getElementById('dec-style')) {
    const s = document.createElement('style');
    s.id = 'dec-style';
    s.textContent = `
      .dec-card{
        background:var(--panel);border:1px solid var(--border);border-radius:8px;
        margin:12px 0;overflow:hidden;
      }
      .dec-trigger{
        display:flex;align-items:center;gap:10px;padding:14px 16px;
        cursor:pointer;background:var(--panel-2);
      }
      .dec-trigger:hover{background:#1c232c}
      .dec-icon{font-size:22px}
      .dec-title{flex:1;font-size:15px;font-weight:600}
      .dec-arrow{color:var(--fg-2)}
      .dec-body{display:none;padding:0}
      .dec-body.open{display:block}
      .dec-step{padding:14px 18px;border-top:1px solid var(--border)}
      .dec-q{font-size:14px;margin-bottom:10px;line-height:1.7}
      .dec-yn{display:flex;gap:10px}
      .dec-ans{
        flex:1;padding:10px 14px;border:1px solid var(--border);
        background:var(--panel-2);color:var(--fg);border-radius:6px;
        cursor:pointer;font-size:14px;
      }
      .dec-ans:hover{border-color:var(--accent)}
      .dec-outcome{padding:14px 18px;border-top:1px solid var(--border)}
      .dec-outcome h3{margin:0 0 12px;font-size:16px}
      .dec-outcome ol{padding-left:20px;font-size:14px;line-height:1.8}
      .dec-outcome ol li{margin:4px 0}
      .dec-outcome .risk{
        background:#3b1818;border-left:3px solid var(--bad);
        padding:8px 12px;margin-top:10px;border-radius:4px;font-size:13px;
      }
      .dec-outcome .law{
        font-size:11px;color:var(--fg-2);margin-top:8px;
      }
      .dec-reset{
        margin-top:10px;background:var(--panel-2);border:1px solid var(--border);
        color:var(--fg);padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;
      }
      .dec-reset:hover{border-color:var(--accent-2)}
    `;
    document.head.appendChild(s);
  }
}

function renderFlow($el, d, stepIdx) {
  const step = d.flow[stepIdx];
  $el.innerHTML = `
    <div class="dec-step">
      <div class="dec-q">❓ ${MLAW.escape(step.q)}</div>
      <div class="dec-yn">
        <button class="dec-ans" data-dec="${DECISIONS.indexOf(d)}" data-step="${stepIdx}" data-choice="y">是</button>
        <button class="dec-ans" data-dec="${DECISIONS.indexOf(d)}" data-step="${stepIdx}" data-choice="n">否</button>
      </div>
    </div>
  `;
}

function renderOutcome($el, outcome) {
  const decIdx = DECISIONS.findIndex(d => Object.values(d.outcomes).includes(outcome));
  $el.innerHTML = `
    <div class="dec-outcome">
      <h3>${outcome.title}</h3>
      <ol>${outcome.steps.map(s => `<li>${MLAW.escape(s)}</li>`).join('')}</ol>
      <div class="risk"><strong>⚠️ 踩雷後果：</strong> ${MLAW.escape(outcome.risk)}</div>
      <div class="law">📚 法源：${MLAW.escape(outcome.law)}</div>
      <button class="dec-reset" data-dec="${decIdx}">↻ 重新走流程</button>
    </div>
  `;
}

registerRoute('decision', renderDecision);
