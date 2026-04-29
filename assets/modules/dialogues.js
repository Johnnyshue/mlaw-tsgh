// 💬 值班最危險的 5 種對話 — 真實值班會遇到的對話腳本練習
// 每個情境給「錯誤回應」「正確回應」「為什麼」「法源」

const DIALOGUES = [
  {
    id: 'angry_family',
    icon: '😡',
    title: '家屬情緒失控：「都你害死我爸的！」',
    setup: '你剛從手術房出來，70 歲術後病人因 cardiogenic shock 死亡。家屬衝過來抓你領子，全病房都在看。',
    options: [
      {
        type: 'bad',
        line: '「我跟你說過手術有風險的，你自己簽同意書的。」',
        why: '把責任丟回病人 = 火上加油。同意書 ≠ 免責盾牌（醫療法 §82 仍要看是否盡注意義務）。家屬這時候要的是被聽到，不是法律辯論。'
      },
      {
        type: 'bad',
        line: '「你冷靜一點！再這樣我叫保全！」',
        why: '對抗姿態。即使你叫保全合法，也會被剪片成「醫師面對家屬不耐煩」的證據。家屬律師最愛這個。'
      },
      {
        type: 'good',
        line: '「我能理解您現在的感受，這個結果不是我們希望的。我先請院方關懷小組過來陪您，我們可以坐下來談。」',
        why: '【道歉條款】醫療事故預防及爭議處理法 §7 保護「遺憾、道歉」的話 — 不會被當證據用。**「不是我們希望的結果」≠ 承認過失**，這是黃金句型。然後把場域交給院方關懷小組（§6），不要單獨硬扛。'
      },
      {
        type: 'good',
        line: '「我先確認家屬的安全和情緒，請護理師協助先到家屬休息室。我隨後會請科主任和關懷小組過來說明。」',
        why: '建立物理隔離 + 升級到院方專業流程。你不是 crisis communication 專業，主任 + 關懷小組才是。'
      }
    ],
    keypoint: '「不是我們希望的結果」是道歉條款保護的黃金句。承認過失（「我們疏失了」「都是我的錯」）不在保護範圍內。',
    laws: ['醫療事故預防及爭議處理法 §6 §7', '醫療法 §107（重大事故通報）']
  },
  {
    id: 'leave_against_advice',
    icon: '🚪',
    title: '高風險病人堅持要走：「我自己負責，讓我走啦！」',
    setup: '凌晨 3 點，55 歲男性胸痛來急診。EKG 早期 ACS 變化，TnI 0h 上升。你說要 admit CCU，他說「我等等還要上班，給我藥就好我要回家」。',
    options: [
      {
        type: 'bad',
        line: '「你要走我也沒辦法，自己保重。」',
        why: '無作為 = 違反醫師法 §21。即使病人簽 AAD，醫師仍有「充分告知 + 勸阻 + 提供替代方案」義務。出事家屬會告。'
      },
      {
        type: 'bad',
        line: '「你不簽 AAD 我不讓你走。」',
        why: '限制人身自由 = 妨害自由（刑法 §302）。AAD 是病人的權利不是你的工具。應該是「請你簽 AAD 同時記錄我的勸告」。'
      },
      {
        type: 'good',
        line: '「我很擔心你的安全。你的心電圖和抽血顯示心臟病發作中，現在離開有突然死亡的風險，3 小時內可能就走不出醫院門。我會請夜班總醫師再來跟你說明。如果你最後還是決定離開，我必須請你簽自動出院書，並完整記錄我們今天的對話。」',
        why: '【三段式】① 表達擔心（建立關係）② 具體風險量化（不是「會很嚴重」這種空話）③ 升級會診 + AAD 程序。每一步都記錄在病歷裡 = 將來最強自保。'
      },
      {
        type: 'good',
        line: '「我了解你急著回家。我們有沒有可能折衷？例如先讓你再多觀察 4 小時、抽第二次血，如果指數穩定，至少我能放心一點，你也不會因小失大。」',
        why: '討價還價（bargaining）— 不是放走，是讓病人**自己同意延後離開**。比硬碰硬有效，且病歷會寫「病人最後同意觀察」更安全。'
      }
    ],
    keypoint: 'AAD 不是放手不管，是「我已盡全力勸阻 + 病人自願承擔 + 一切記錄在案」三件套。',
    laws: ['醫師法 §21（危急病人不得拒絕）', '醫療法 §63（同意原則）', '刑法 §302（妨害自由 — 反向警惕）']
  },
  {
    id: 'change_cause_of_death',
    icon: '📝',
    title: '家屬要求改死因：「醫師你寫『心臟衰竭』就好啦，要不然保險不賠」',
    setup: '60 歲女性肝癌末期病人剛過世。實際死因為 hepatorenal syndrome 合併 sepsis。家屬說保險如果寫「癌症相關」要走長流程，問你能不能寫「心衰竭」就好。',
    options: [
      {
        type: 'bad',
        line: '「好啦那我就寫 heart failure，反正最後都是心跳停止嘛。」',
        why: '🚨【刑法 §215】業務上文書登載不實罪，**3 年以下有期徒刑**。死亡證明不實 = 立刻有刑事前科 + 可能被廢醫師執照（醫師法 §28）。不論家屬多可憐，這條線絕對不能跨。'
      },
      {
        type: 'bad',
        line: '「我寫 cardiopulmonary failure 算不算心臟？」',
        why: '所有人都死於 cardiopulmonary arrest（心肺功能停止），這是**死亡的機制**不是**原因**。死因要寫**根本死因**（underlying cause）。如果原因是肝癌，寫「心肺衰竭」就是規避真實死因 = 一樣登載不實。'
      },
      {
        type: 'good',
        line: '「我完全理解保險的麻煩，但死亡證明書是法律文件，我寫不實會立刻有刑責 — 我自己會出問題，這個我真的沒辦法。我可以幫您兩件事：第一，我把直接死因（即時造成死亡的原因）寫清楚，您拿著去問保險業務員，很多保單對 hepatorenal syndrome 是另算的；第二，我幫您聯繫醫院社工，他們有處理保險爭議的經驗。」',
        why: '【拒絕但給出路】不只說「不行」，還提供**替代方案**。家屬常常不是真要你犯法，是不知道怎麼辦才急著找你。把問題轉介給專業幫手，自己守住底線。'
      },
      {
        type: 'good',
        line: '「您的擔心我聽到了。死亡證明的寫法是法律規範的，醫師如果寫不實，可能要坐牢且失去執照。我建議您先別放棄保險 — 很多保單對「猝發性器官衰竭」也有給付，建議直接打電話到保險公司客服，或找醫院社工協助釐清。」',
        why: '把「我不能違法」說成「我會被抓」，從**對抗位置**轉成**同盟位置**（我們一起面對保險問題）。'
      }
    ],
    keypoint: '死亡證明書 = 法律文件。同情家屬 ≠ 違法協助。「直接死因 vs 根本死因」要分開寫，不是把根本死因藏起來。',
    laws: ['刑法 §215（業務上登載不實，3 年以下）', '醫師法 §17（死亡證明）', '醫師法 §28（廢照）']
  },
  {
    id: 'attending_unreachable',
    icon: '📵',
    title: '主治不接 line 但病人快不行了',
    setup: '凌晨 2:40。你是 PGY 2，照顧的病人突然血壓掉到 70/40，意識變差。Line 主治醫師三次未讀，電話兩次轉語音信箱。',
    options: [
      {
        type: 'bad',
        line: '「主治不接，那我先觀察看看好了，半小時後再 call 一次。」',
        why: '【醫師法 §21】危急病人不得無故拖延。「等主治回」= 不作為 = 過失。病人死了會寫「住院醫師發現病情惡化卻未積極處置」鑑定報告。'
      },
      {
        type: 'bad',
        line: '「我自己給 levophed 算了，反正之前主治都這樣下。」',
        why: '可能逾越執業範圍（看你是 PGY 1 還 R5 處境不同）。更重要：**沒有人 backup 你的決策**。出事 = 你獨自承擔。'
      },
      {
        type: 'good',
        line: '【行動順序】先依 ABC + ACLS 處置（fluid resuscitation、O2、call code 視情況）→ 同時請護理師打給總值班醫師（總醫師有院內責任制）→ 護理師再打主治家中電話（聯絡單上有）→ 全部時間點記錄在病歷',
        why: '【金字塔升級】(1) 即時臨床穩定 (2) 院內 backup（總值班）(3) 院外 backup（主治家裡）(4) 全部記錄。**「我已盡力聯繫，且依規範同步處置」= 最強自保**。'
      },
      {
        type: 'good',
        line: '「我先依 sepsis bundle 處置（fluid 30 mL/kg、抽 BC、給廣效抗生素），同時請護理師持續嘗試聯繫主治和總值班，每次嘗試的時間我都記在病歷上。如果 30 分鐘內主治仍無法聯繫，我會直接 call 加護病房值班醫師會診升級照護。」',
        why: '即使主治真的失聯，你有 (1) 即時依 SOP 處置 (2) 平行升級資源 (3) 完整書面證據。鑑定看到這份病歷會幫你說話。'
      }
    ],
    keypoint: '主治失聯 ≠ 你免責。主治失聯 = 你必須啟動院內 backup（總值班、會診、自己依 SOP 處置）。記錄每個時間點。',
    laws: ['醫師法 §21（危急救治）', '醫師法 §22（會診轉診）', '醫療法 §82（合理裁量考慮工作條件）']
  },
  {
    id: 'colleague_suggests_alter_record',
    icon: '✏️',
    title: '同事悄悄建議：「病歷你補一下吧，反正沒人會發現」',
    setup: '今天值班發現 3 天前你開的病人有用藥疏失（漏一個重要藥），現在病人已穩定但你越想越焦慮。學長拍你肩膀說「電子病歷你登進去 amend 一下啦，反正系統可以改，沒人會發現」。',
    options: [
      {
        type: 'bad',
        line: '「對齁，我先補上去再說。」',
        why: '🚨🚨🚨【刑法 §215 + §210】業務文書登載不實 + 偽造私文書。電子病歷有 audit trail，**修改紀錄全部留痕跡**。發生糾紛時鑑定第一件事就是調 log。**事後補寫 = 自認有罪**，舉證責任直接轉換到你身上。從「可能無事」變成「必有罪」。'
      },
      {
        type: 'bad',
        line: '「我先打給資訊室問能不能改原始紀錄。」',
        why: '資訊人員不能、也不會幫你改。但這通電話本身已經留下「我有意圖竄改」的證據（通話紀錄 + 資訊室工單）。**意圖 + 行動 = 偽造文書未遂**。'
      },
      {
        type: 'good',
        line: '「謝謝學長關心，但我打算用合法的『事後補記』格式。我現在去打開那份病歷，**保留原文不動**，在末尾加註：『XX/XX 補記：經值班時 review，發現 XX/XX 漏處方 X 藥物，本次值班已補處方並追蹤，補記人 PGY 王XX，補記時間 XX/XX XX:XX』。然後跟主治報告這件事。」',
        why: '【合法補記格式】醫療法 §68 II 容許補記，但要**保留原文 + 註明補記時間 + 簽名**。透明 > 隱藏。把錯誤公開化反而是最強自保 — 因為「事後發現並追蹤」本身就符合醫療常規（系統有 self-check 機制）。'
      },
      {
        type: 'good',
        line: '「我先去現場確認病人現在 stable，再打給主治報告今天 review 才發現 3 天前漏藥。這是 incident report 該寫的事，不是病歷修改的事。」',
        why: '事故通報（醫療法 §107）+ 透明溝通 = 院方會 backup 你。隱匿 = 你獨自承擔。**主動報告的醫師很少被告，掩蓋的醫師都被告**。'
      }
    ],
    keypoint: '電子病歷有時間戳記和修改 audit log。事後修改 = 鑑定一查就破，從民事跳刑事。**合法補記 + 主動通報** > 隱匿。',
    laws: ['刑法 §215（業務文書登載不實，3 年以下）', '刑法 §210（偽造私文書，5 年以下）', '醫療法 §68（合法修改）', '醫療法 §107（事故通報）']
  }
];

async function renderDialogues($el) {
  $el.innerHTML = `
    <h1>💬 值班最危險的 5 種對話</h1>
    <p>真實情境 + 對話腳本練習。每個情境有 4 個回應選項，**每個都會解釋為什麼**。
       這不是 quiz（沒有單一正確答案）— 而是讓你預習對話，值班遇到時口袋裡有腳本。</p>
    <div id="dlg-list"></div>
  `;
  const $list = document.getElementById('dlg-list');
  DIALOGUES.forEach((d, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'dialogue-card';
    wrap.innerHTML = `
      <div class="dlg-header">
        <span class="dlg-icon">${d.icon}</span>
        <h2>場景 ${i+1}：${MLAW.escape(d.title)}</h2>
      </div>
      <div class="dlg-setup">
        <strong>📍 情境</strong><br>
        ${MLAW.escape(d.setup)}
      </div>
      <p style="font-size:13px;color:var(--fg-2);margin-top:12px">
        👇 點下面任一個回應看「為什麼」：
      </p>
      <div class="dlg-options">
        ${d.options.map((o, oi) => `
          <button class="dlg-opt ${o.type}" data-i="${i}" data-oi="${oi}">
            <span class="opt-tag">${o.type === 'good' ? '✅' : '❌'}</span>
            <span class="opt-line">${MLAW.escape(o.line)}</span>
          </button>
          <div class="dlg-why" id="why-${i}-${oi}">
            <strong>為什麼：</strong> ${o.why}
          </div>
        `).join('')}
      </div>
      <div class="dlg-keypoint">
        <strong>🔑 關鍵心法</strong><br>
        ${MLAW.escape(d.keypoint)}
      </div>
      <div class="dlg-laws">
        <strong>📚 法源</strong>: ${d.laws.map(l => `<span class="law-pill">${MLAW.escape(l)}</span>`).join(' ')}
      </div>
    `;
    $list.appendChild(wrap);
  });

  $list.addEventListener('click', e => {
    const btn = e.target.closest('.dlg-opt');
    if (!btn) return;
    const i = btn.dataset.i, oi = btn.dataset.oi;
    const $why = document.getElementById(`why-${i}-${oi}`);
    $why.classList.toggle('show');
  });

  // 注入樣式
  if (!document.getElementById('dlg-style')) {
    const s = document.createElement('style');
    s.id = 'dlg-style';
    s.textContent = `
      .dialogue-card{
        background:var(--panel);border:1px solid var(--border);border-radius:10px;
        padding:18px 20px;margin:18px 0;
      }
      .dlg-header{display:flex;align-items:center;gap:10px;margin-bottom:8px}
      .dlg-header h2{margin:0;font-size:18px;color:var(--accent)}
      .dlg-icon{font-size:24px}
      .dlg-setup{
        background:var(--panel-2);border-left:3px solid var(--accent-2);
        padding:10px 14px;border-radius:4px;margin:10px 0;font-size:14px;line-height:1.7;
      }
      .dlg-options{margin-top:8px}
      .dlg-opt{
        display:flex;width:100%;padding:10px 14px;margin:6px 0;
        background:var(--panel-2);border:1px solid var(--border);color:var(--fg);
        border-radius:6px;cursor:pointer;text-align:left;font-size:14px;line-height:1.7;
        gap:8px;align-items:flex-start;
      }
      .dlg-opt:hover{border-color:var(--accent)}
      .dlg-opt.good{border-left:3px solid var(--good)}
      .dlg-opt.bad{border-left:3px solid var(--bad)}
      .opt-tag{font-size:16px;flex-shrink:0}
      .opt-line{flex:1}
      .dlg-why{
        display:none;background:#1c232c;border-radius:4px;
        padding:10px 14px;margin:0 0 8px 14px;font-size:13px;line-height:1.7;color:var(--fg-2);
      }
      .dlg-why.show{display:block}
      .dlg-keypoint{
        background:#3b2a0a;border:1px solid var(--warn);border-radius:6px;
        padding:10px 14px;margin-top:14px;font-size:14px;line-height:1.7;
      }
      .dlg-laws{margin-top:10px;font-size:12px;color:var(--fg-2)}
      .law-pill{
        display:inline-block;background:var(--panel-2);border:1px solid var(--border);
        padding:2px 8px;border-radius:10px;margin:2px;font-size:11px;
      }
    `;
    document.head.appendChild(s);
  }
}
registerRoute('dialogues', renderDialogues);
