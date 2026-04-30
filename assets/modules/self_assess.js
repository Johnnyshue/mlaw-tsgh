// 🎯 自我評估測驗 — 10 題診斷你的法律警覺度
const ASSESS = [
  { q:'你寫病歷時習慣寫「stable」「OK」「f/u」這類短字嗎？', yes:0, no:10, expl:'用模糊字 = 鑑定看不到判斷依據，重大瑕疵風險高（case04 教訓）' },
  { q:'你看完門診/急診後，會記下「為什麼這樣處置」的判斷依據（如 guideline、檢查值）嗎？', yes:10, no:0, expl:'有判斷依據的紀錄 = 醫療法 §82 合理裁量的最強書面證據' },
  { q:'手術前你會親自跟病人說明風險嗎？（不只請護理師拿同意書）', yes:10, no:0, expl:'護理師代簽 = 告知義務未盡，民事訴訟最常敗訴原因（占 23%）' },
  { q:'你個人有投保「醫師責任險」嗎？', yes:10, no:0, expl:'PGY 也會被告。沒保險訴訟費 50-100 萬+ 自己扛' },
  { q:'同事或主管曾建議你「補一下病歷沒人會發現」，你會跟著做嗎？', yes:0, no:10, expl:'電子病歷 audit log 留痕跡 = 刑法 §215 業務文書登載不實 3 年以下' },
  { q:'病人堅持要走但情況危急，你會直接讓他走嗎？', yes:0, no:10, expl:'危急病人不得無故拖延（醫師法 §21）。應 AAD + 病歷詳記勸告' },
  { q:'家屬問你「醫師你抱歉嗎」，你會說「都是我的錯」嗎？', yes:0, no:10, expl:'§7 道歉條款保護「遺憾」「對不起讓您經歷這些」，但**不保護承認過失**' },
  { q:'你知道醫療法 §82 對醫師個人刑事責任有「兩個 AND 條件」嗎？', yes:10, no:0, expl:'必須同時違反注意義務 + 逾越合理裁量。這是你的護身符' },
  { q:'發生醫療事故時，你會單獨見家屬「澄清」嗎？', yes:0, no:10, expl:'單獨對話可能被錄音剪輯成承認過失。應由院方關懷小組（§6）統一說明' },
  { q:'你會在 IG / 限動 / Dcard 發 case（即使匿名）嗎？', yes:0, no:10, expl:'個資法 §41 散布特種個資 = 5 年以下；醫師法 §23 保密義務' },
];

async function renderAssess($el) {
  $el.innerHTML = `
    <h1>🎯 自我評估測驗</h1>
    <p>10 題簡單題，幫你診斷自己的「法律警覺度」。
       答完看分數 + 弱點分析。<strong>3 分鐘內完成</strong>。</p>
    <div id="assess-list"></div>
    <button id="assess-submit" style="margin-top:14px">📊 看結果</button>
    <div id="assess-result" style="margin-top:18px"></div>
  `;

  const $list = document.getElementById('assess-list');
  ASSESS.forEach((q, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'assess-q';
    wrap.innerHTML = `
      <div class="assess-text"><b>${i+1}.</b> ${MLAW.escape(q.q)}</div>
      <div class="assess-yn">
        <button class="assess-btn" data-i="${i}" data-v="yes">是 / 會</button>
        <button class="assess-btn" data-i="${i}" data-v="no">否 / 不會</button>
      </div>
    `;
    $list.appendChild(wrap);
  });

  const answers = {};
  $list.addEventListener('click', e => {
    const btn = e.target.closest('.assess-btn');
    if (!btn) return;
    const i = +btn.dataset.i;
    const v = btn.dataset.v;
    answers[i] = v;
    btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });

  document.getElementById('assess-submit').addEventListener('click', () => {
    if (Object.keys(answers).length < ASSESS.length) {
      alert('請完成所有題目（' + Object.keys(answers).length + '/' + ASSESS.length + '）');
      return;
    }
    let score = 0;
    const weaknesses = [];
    ASSESS.forEach((q, i) => {
      const v = answers[i];
      const pts = v === 'yes' ? q.yes : q.no;
      score += pts;
      if (pts === 0) weaknesses.push({i, q: q.q, expl: q.expl});
    });
    let level, color, msg;
    if (score >= 90) { level='🏆 A 級：法律警覺度高'; color='var(--good)';
      msg='你已經具備保護自己的基本素養。繼續維持，並補強少數弱點。'; }
    else if (score >= 70) { level='🟢 B 級：基本及格'; color='var(--accent-2)';
      msg='大致 OK，但有幾個弱點需要立刻補強。'; }
    else if (score >= 50) { level='🟡 C 級：有風險'; color='var(--warn)';
      msg='你的法律警覺度不足。建議完整看過 master_summary_for_pgy.md（PGY 必背 20 條）。'; }
    else { level='🚨 D 級：高風險'; color='var(--bad)';
      msg='你目前的習慣有訴訟風險。請立刻看 sop_when_sued.md + insurance_guide.md，並改變病歷與溝通習慣。'; }

    const $result = document.getElementById('assess-result');
    $result.innerHTML = `
      <div class="card" style="border-left:4px solid ${color}">
        <h2 style="margin:0;color:${color}">${level}</h2>
        <p style="font-size:18px">分數：${score} / ${ASSESS.length * 10}</p>
        <p>${MLAW.escape(msg)}</p>
      </div>
      ${weaknesses.length ? `
        <div class="card warn">
          <h3 style="margin-top:0">⚠️ 你的弱點（${weaknesses.length} 個）</h3>
          ${weaknesses.map(w => `
            <div style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--border)">
              <div><b>第 ${w.i+1} 題</b>：${MLAW.escape(w.q)}</div>
              <div style="color:var(--fg-2);font-size:13px;margin-top:4px">📚 ${MLAW.escape(w.expl)}</div>
            </div>
          `).join('')}
        </div>` : ''}
      <div class="card good">
        <h3 style="margin-top:0">📚 建議閱讀（依分數）</h3>
        <ul>
          <li><a href="#case_master_summary_for_pgy">⭐ PGY 必背 20 條</a></li>
          <li><a href="#case_pocket_card">📟 速查口袋卡</a></li>
          <li><a href="#case_sop_when_sued">🆘 被告 SOP</a></li>
          <li><a href="#case_insurance_guide">💼 保險與救濟</a></li>
          <li><a href="#case_qa_responses">💬 病人/家屬 Q&A 回應庫</a></li>
        </ul>
      </div>
      <button id="assess-retry" style="margin-top:10px">↻ 重做</button>
    `;
    document.getElementById('assess-retry').addEventListener('click', () => renderAssess($el));
  });

  if (!document.getElementById('assess-style')) {
    const s = document.createElement('style');
    s.id = 'assess-style';
    s.textContent = `
      .assess-q{
        background:var(--panel);border:1px solid var(--border);border-radius:8px;
        padding:14px 18px;margin:10px 0;
      }
      .assess-text{font-size:15px;margin-bottom:10px;line-height:1.7}
      .assess-yn{display:flex;gap:8px}
      .assess-btn{
        flex:1;padding:8px 14px;background:var(--panel-2);border:1px solid var(--border);
        color:var(--fg);border-radius:6px;cursor:pointer;font-size:14px;
      }
      .assess-btn:hover{border-color:var(--accent-2)}
      .assess-btn.selected{background:var(--accent-2);color:#fff;border-color:var(--accent-2)}
      #assess-submit, #assess-retry{
        background:var(--accent);color:#000;border:0;padding:10px 18px;border-radius:6px;
        cursor:pointer;font-size:14px;font-weight:600;
      }
      #assess-submit:hover, #assess-retry:hover{background:#ea580c}
    `;
    document.head.appendChild(s);
  }
}
registerRoute('self-assess', renderAssess);
