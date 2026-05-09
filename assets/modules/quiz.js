// 🎯 法律情境 Quiz
const QUIZ = [
  {
    scenario: '【2026 新法】你在地區醫院當值班 PGY，大夜班 1 個護理師顧 18 床（衛福部標準是 1:15）。護理長要求你幫忙打 IV、抽血、推急救車。你怎麼辦？',
    options: [
      {text:'拒絕做任何護理工作，只做醫師業務', ok:false, why:'生硬拒絕可能影響病人安全。重點不是「能不能做」，而是「做了要留紀錄」。'},
      {text:'幫忙做但不寫病歷，事後當沒事', ok:false, why:'最危險選項。護病比違規 + 醫師越界 + 出事無書面證據可主張系統性原因。'},
      {text:'必要時協助，並在病歷紀錄「因護理人力暫缺，由醫師執行 OOO」+ 通報院方', ok:true, why:'正確。書面紀錄是醫師的護身符。醫療法 §12（2026 新法）規定護病比，違規責任在醫院，但醫師個人仍要留紀錄保護自己。'},
      {text:'拍照存證護病比違規後上社群媒體爆料', ok:false, why:'病房內拍照可能違反個資法 §6（病人特種個資）+ 醫師法 §23 保密義務。應走院內申訴管道或衛福部檢舉。'}
    ],
    src:'醫療法 §12 §102-1（2026/05/08 三讀）、醫師法 §28、個資法 §6'
  },
  {
    scenario: '【2026 新法】你的醫院違反三班護病比被罰 100 萬，醫院要求醫師加班「補位」護理工作。法律上對醫師的責任有何影響？',
    options: [
      {text:'醫師越界做護理工作出包，責任完全在醫院', ok:false, why:'錯。醫師個人仍負業務範圍責任。系統性原因可分擔但不能免責（最高法院 102 台上 3161 等見解）。'},
      {text:'護病比違規責任在醫院（罰鍰、停業），但醫師個人仍要管自己的執業行為與病歷紀錄', ok:true, why:'正確。醫療法 §102-1（新增）罰的是醫療機構（醫院）；醫師個人責任仍依醫療法 §82 + 醫師法 §28 判斷。'},
      {text:'護病比立法後醫師完全不必擔心人力不足的責任', ok:false, why:'錯。即使有立法保護，醫師仍要善盡監督與紀錄義務。'},
      {text:'醫師可拒絕一切加班', ok:false, why:'勞動契約問題另論。法律重點是醫療業務界線與書面紀錄。'}
    ],
    src:'醫療法 §82、§102-1（2026）、醫師法 §28'
  },
  {
    scenario: '你是急診醫師，70 歲女性 BP 80/50，胸痛冒冷汗。EKG 明顯下壁 STEMI。你要簽手術同意書才能送 cath lab，但家屬都還沒到。',
    options: [
      {text:'拒絕送 cath lab，等家屬到', ok:false, why:'病人危急時可以先處置，事後補簽（醫療法 §63 但書）。延誤會違反醫師法 §21。'},
      {text:'立刻送 cath lab，事後補簽 + 病歷詳實紀錄', ok:true, why:'正確。緊急情況可不簽同意書，但病歷務必寫明判斷與緊急性。'},
      {text:'自己代家屬簽', ok:false, why:'絕對不行。即使是緊急情況也是依法不需簽，不是替別人簽。'},
      {text:'勉強請護理長代簽', ok:false, why:'護理長無權代簽，可能構成偽造文書。'}
    ],
    src:'醫療法 §63 但書、醫師法 §21'
  },
  {
    scenario: '你看門診時，發現之前寫的病歷有錯字想修改。',
    options: [
      {text:'用立可白塗掉重寫', ok:false, why:'醫療法 §68 II 禁止塗銷。可能構成刑法 §215 業務文書登載不實。'},
      {text:'撕掉那頁重新寫', ok:false, why:'更嚴重。屬於毀損公文書（電子病歷雖無紙頁，但邏輯相同）。'},
      {text:'畫線保留原文 + 註明修改 + 簽名 + 日期', ok:true, why:'這是合法格式。原文可讀 + 修改透明 = 法庭信任。'},
      {text:'先打電話跟病人解釋再修改', ok:false, why:'與是否合法無關。修改格式才是重點。'}
    ],
    src:'醫療法 §68 II、刑法 §215'
  },
  {
    scenario: '你是值班醫師，40 歲男性胸痛 1 小時，EKG normal。病人說「我要回家睡」。你怎麼辦？',
    options: [
      {text:'病人意願優先，讓他走', ok:false, why:'EKG normal 不代表沒事。需要 TnI + 觀察 + 重複 EKG。直接讓走可能違反醫師法 §21。'},
      {text:'勸觀察，他堅持就簽 AAD + 病歷詳細寫風險告知與勸告內容', ok:true, why:'正確流程。AAD + 病歷紀錄是急診醫師護身符。記得寫紅旗症狀回急診條件。'},
      {text:'幫他打 sedation 留住', ok:false, why:'未經同意限制人身自由 = 妨害自由（刑法 §302）+ 妨害醫療法 §63 同意原則。'},
      {text:'拒絕讓他走、拒絕簽 AAD', ok:false, why:'病人有自主權。應提供 AAD 同意書 + 風險告知。'}
    ],
    src:'醫療法 §63、醫師法 §21'
  },
  {
    scenario: '一個爭議手術案，你是主刀醫師。家屬怒氣沖沖要求看病歷與「給個說法」。',
    options: [
      {text:'單獨見家屬，當面說明', ok:false, why:'單獨見家屬有風險：被錄音剪輯、承認過失。應由院方關懷小組陪同。'},
      {text:'先通報院方關懷小組，由院方統一說明', ok:true, why:'醫療事故預防及爭議處理法 §6 規定醫療機構應組成關懷小組。'},
      {text:'立刻說「對不起，是我錯」息事寧人', ok:false, why:'雖然 §7 道歉條款保護「遺憾/讓步」，但承認過失不在保護範圍，會影響日後訴訟。'},
      {text:'承諾賠錢和解', ok:false, why:'未經院方法務或保險公司同意私下承諾，可能無保險覆蓋。'}
    ],
    src:'醫療事故預防及爭議處理法 §6 §7、醫療法 §107'
  },
  {
    scenario: '一個手術後出血併發症的病人家屬告民事，醫審會鑑定報告寫「處置符合醫療常規」。',
    options: [
      {text:'醫師仍可能負民事責任', ok:true, why:'醫療法 §82 II 醫師個人雖以「違反義務+逾越裁量」為限負責，但醫療機構（§82 V）只要「過失」就負責，且因果關係仍可能成立。鑑定不必然 = 勝訴。'},
      {text:'符合常規 = 100% 不會被告', ok:false, why:'符合常規大幅減低風險，但並非絕對免責。例如告知不充分仍可能負責。'},
      {text:'這份鑑定對醫師沒幫助', ok:false, why:'錯。鑑定符合常規是醫師最強護身符之一。'},
      {text:'只要鑑定通過，民事不用打了', ok:false, why:'鑑定 ≠ 判決。法官仍會綜合判斷因果關係與賠償。'}
    ],
    src:'醫療法 §82、民法 §184 §188'
  },
  {
    scenario: '你的學弟在 IG 限動發了一個有趣的 case（沒寫病人姓名，但有照片）。',
    options: [
      {text:'沒寫姓名所以沒事', ok:false, why:'病歷照片可能含可識別資訊（病房號、年齡、診斷）= 仍違反個資法 §6 特種個資。'},
      {text:'匿名 case 就算分享教學也可以', ok:false, why:'未經病人同意不得公開使用其資料，即使匿名。可能違反個資法 §41 + 醫師法 §23（保密義務）。'},
      {text:'立刻提醒學弟撤下，並私下找他討論個資', ok:true, why:'正確。個資法 §6 病歷屬特種個資，最高刑責 5 年以下。'},
      {text:'按讚支持', ok:false, why:'按讚可能被認為共同散布，建議避免。'}
    ],
    src:'個人資料保護法 §6 §41、醫師法 §23'
  },
  {
    scenario: '一名獨居 80 歲老人車禍送來，意識昏迷，急需手術。沒有任何家屬聯繫得到。',
    options: [
      {text:'等家屬到才能手術', ok:false, why:'醫療法 §63 但書「情況緊急者不在此限」。延誤可能違反醫師法 §21。'},
      {text:'立刻手術救命，病歷詳細記錄緊急性與聯繫家屬未果', ok:true, why:'正確。緊急狀況依法可不簽同意書，事後病歷紀錄是關鍵。'},
      {text:'先聯繫鄉里長代簽', ok:false, why:'里長不在親屬法定順位。緊急情況不需任何人簽。'},
      {text:'拒絕手術，怕被告', ok:false, why:'不救可能反被告 = 醫師法 §21 違反緊急救治義務。'}
    ],
    src:'醫療法 §63、醫師法 §21'
  },
  {
    scenario: '你在急診值班，一個 75 歲老人腹痛 6 小時。腹軟壓痛但無 peritoneal sign。你打算給止痛劑後讓他回家。',
    options: [
      {text:'先 CT 排除 mesenteric ischemia / AAA / 闌尾炎', ok:true, why:'老人腹痛紅旗。許多敗訴案是漏掉 mesenteric ischemia（pain disproportionate to exam）或 AAA。'},
      {text:'給止痛劑就讓他走', ok:false, why:'老人腹痛漏診是急診常見被告情境。止痛掩蓋症狀更危險。'},
      {text:'安排隔天回診', ok:false, why:'8-24 小時對 mesenteric ischemia 已可能 bowel necrosis。'},
      {text:'會診外科 + CT', ok:true, why:'這是更穩的做法。即使 CT 陰性也可會診外科一起評估。'}
    ],
    src:'醫療法 §82（合理裁量）、醫師法 §22（轉診/會診）'
  },
  {
    scenario: '你做完急診 CT，下班交班後 2 小時放射科 report 出來：早期闌尾炎。你已經回家。',
    options: [
      {text:'這不是我的責任了，下一班醫師會看', ok:false, why:'桃園醫院真實案例就是這樣輸的。法院認定「短時間內有生命危險」時，原處置醫師仍有後繼通知義務。'},
      {text:'立刻打電話通知病人 + 通知接班醫師 + 病歷紀錄通話', ok:true, why:'正確。後繼義務 + 文件留證據。即使你下班，影像 review 是你責任。'},
      {text:'明早再處理就好', ok:false, why:'闌尾炎可能 24 小時內穿孔。延遲 = 違反注意義務。'},
      {text:'發 line 給病人就好，不打電話', ok:false, why:'line 病人可能沒看到。電話 + 病歷紀錄通話內容才有證據力。'}
    ],
    src:'醫療法 §82、Case 03 桃園醫院闌尾炎案'
  },
  {
    scenario: '一個 50 歲女性簽字同意做白內障手術，術後出現短暫視力模糊（已恢復），家屬很生氣要告。',
    options: [
      {text:'同意書有寫「失明風險」就免責', ok:false, why:'法院（最高法院 94 台上 2676）要求告知「具體可預見的風險」，不只最嚴重的。短暫視力模糊也要說。'},
      {text:'只要病歷有「已說明風險」幾個字就 OK', ok:false, why:'空泛字眼鑑定不會買單。要寫具體風險項目（哪些併發症、發生率）。'},
      {text:'同意書 + 病歷詳列具體風險（含發生率）+ 病人簽名後留時間思考', ok:true, why:'這是「實質告知」三件套。最強防護。'},
      {text:'術前一晚讓護理師說明就好', ok:false, why:'說明應由醫師親自進行（醫療法 §63 §81）。'}
    ],
    src:'醫療法 §63 §81、最高法院 94 台上 2676'
  },
  {
    scenario: '你發現自己上週寫的病歷有臨床判斷的疏漏想補強。',
    options: [
      {text:'覆寫成更完整的版本，沒人會發現', ok:false, why:'電子病歷有時間戳記與修改紀錄。竄改 = 刑法 §215（業務文書登載不實，3 年以下）+ 舉證責任轉換。'},
      {text:'用「事後補記」格式：保留原文 + 在後面附記「補記說明：原評估不夠完整，補充如下…」+ 日期', ok:true, why:'這是合法的補記。透明 + 留痕跡 = 法院信任。'},
      {text:'打電話給資訊室請他們刪掉舊版', ok:false, why:'構成偽造文書（刑法 §210）+ 你和資訊人員都可能被告。'},
      {text:'先觀望看會不會被告再決定', ok:false, why:'被告後才補 = 一定被認為竄改。要補就現在補（合法格式）。'}
    ],
    src:'醫療法 §68、刑法 §215 §210'
  },
  {
    scenario: '一個 65 歲男性手術前同意書要簽。家屬問「會不會有併發症？」',
    options: [
      {text:'「不會啦，這個手術很安全」', ok:false, why:'保證療效是醫師最大地雷。一旦出事，「你說不會啦」會被視為告知不充分。'},
      {text:'「依文獻發生率：A 風險 X%，B 風險 Y%。我們會盡量降低，但不能保證 0%」', ok:true, why:'告知具體風險 + 不保證 = 醫療法 §81 標準操作。'},
      {text:'「這要看你體質」（含糊帶過）', ok:false, why:'未盡告知義務。法院會認定告知不充分。'},
      {text:'「文獻是這樣寫，但我從沒遇過」', ok:false, why:'雖然語氣親切，但暗示「不會發生」可能被認為告知不真實。'}
    ],
    src:'醫療法 §81、最高法院 94 台上 2676'
  },
  {
    scenario: '一個 30 歲女性主訴「最嚴重的頭痛」。神經學檢查 normal。你想說年輕人應該不會有事。',
    options: [
      {text:'給止痛藥觀察就好', ok:false, why:'「最嚴重的頭痛 (worst headache of my life)」是 SAH 紅旗。漏診 SAH 是急診經典敗訴情境。'},
      {text:'立刻 CT，CT 陰性再考慮 LP', ok:true, why:'正確。SAH 在 6 小時內 CT 敏感度高，但 12 小時後降；CT 陰性 + 仍懷疑 → LP 找 xanthochromia。'},
      {text:'年輕人不會 SAH，回家觀察', ok:false, why:'動脈瘤性 SAH 任何年齡都可能。30-60 歲為高峰。'},
      {text:'先打止痛，痛不停再 CT', ok:false, why:'止痛掩蓋症狀 + 延誤診斷 = 兩個過失。'}
    ],
    src:'醫療法 §82、Canadian SAH Rule'
  },
  {
    scenario: '一個 60 歲糖尿病患胸痛 2 小時。EKG 看起來 normal。你想說症狀不典型 + 心電圖正常 = 應該不是 ACS。',
    options: [
      {text:'EKG normal 就排除 ACS，給 PPI 觀察', ok:false, why:'15-20% 急性 MI 初次 EKG 正常。糖尿病患更常無痛性或非典型表現。'},
      {text:'EKG + TnI 0h、+ 重複 EKG/TnI 在 3-6h、+ HEART score 評估', ok:true, why:'正確。ACS 排除標準流程。糖尿病患是「非典型」最大族群。'},
      {text:'打止痛回家', ok:false, why:'急診漏診 ACS 是經典敗訴情境。臨床經驗 < SOP。'},
      {text:'會診心臟內科', ok:true, why:'更穩的做法。但仍要先把基本檢查做完（EKG、TnI）。'}
    ],
    src:'醫療法 §82、Case 04（漏診原則）'
  },
  {
    scenario: '一個 80 歲老人在病房不慎跌倒撞到頭。GCS 15，沒明顯外傷。家屬希望「看看就好」不要做檢查。',
    options: [
      {text:'家屬同意觀察就觀察，不做 CT', ok:false, why:'老人 + 抗凝可能性 + 跌倒 = 強烈建議 CT。家屬同意 ≠ 免醫師責任（醫師仍有專業判斷義務）。'},
      {text:'勸服家屬做 CT，並病歷紀錄勸告內容 + 家屬決定', ok:true, why:'即使家屬決定觀察，醫師有義務充分告知 + 紀錄。後續惡化才有證據自保。'},
      {text:'家屬簽 AAD 拒絕檢查就好', ok:false, why:'AAD 是病人自願出院的程序，不是「拒絕檢查」的免責。住院病人拒絕檢查也要紀錄為「家屬拒絕 + 已告知風險 + 持續觀察 GCS」。'},
      {text:'安排觀察 + 每 2 小時 GCS + 記錄完整', ok:true, why:'這是核心保護。即使後續 CT 才做，每次 GCS 紀錄是醫師的證據。'}
    ],
    src:'醫療法 §81、Case 04 台大頭部外傷案'
  },
  {
    scenario: '你是值班 PGY，深夜病人突然心律不整且血壓不穩。你 line 主治醫師沒回。',
    options: [
      {text:'等主治回 line 再處理', ok:false, why:'危急病人不得無故拖延（醫師法 §21）。延誤可能構成業務過失。'},
      {text:'先依 ACLS 處置 + 通知值班醫師（會診）+ 連絡主治第二次', ok:true, why:'正確流程。先處置，並有「已盡力通知主治」紀錄。'},
      {text:'打 119 把病人轉走', ok:false, why:'院內病人有院內處置義務。119 是針對外院/居家。'},
      {text:'寫護理人員「已 line 醫師待回」就交班', ok:false, why:'PGY 是醫師，有獨立判斷義務。光等主治會被認為「不作為」。'}
    ],
    src:'醫師法 §21、醫療法 §82（緊急迫切情境）'
  },
  {
    scenario: '一個 8 歲小朋友發燒 39°C 三天，活力好，沒其他症狀。家屬要求自費抗生素。',
    options: [
      {text:'家屬要求就開', ok:false, why:'抗生素應依臨床指徵。家屬要求不是醫療指徵。可能違反健保規範 + 抗藥性問題。'},
      {text:'解釋為何不需要，建議觀察 24 小時，告知紅旗症狀（嗜睡、頸部僵硬、持續高燒不退）+ 病歷紀錄', ok:true, why:'這是負責任的醫療。即使最後病情變差，你有完整紀錄保護自己。'},
      {text:'拒絕並趕家屬走', ok:false, why:'醫病關係要維持。態度不佳 = 訴訟加分。'},
      {text:'隨便開個 amoxicillin 安撫家屬', ok:false, why:'未依指徵用藥可能違反醫師法 §28（藥事規範）。'}
    ],
    src:'醫師法 §28、醫療法 §81'
  }
];

const QUIZ_KEY = 'mlaw_quiz_progress_v1';
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(QUIZ_KEY) || '{}'); }
  catch(e) { return {}; }
}
function saveProgress(p) { localStorage.setItem(QUIZ_KEY, JSON.stringify(p)); }

async function renderQuiz($el) {
  const progress = loadProgress();
  const wrongIds = Object.keys(progress).filter(k => progress[k] === 'wrong');

  $el.innerHTML = `
    <h1>🎯 法律情境 Quiz</h1>
    <p>${QUIZ.length} 道題目，每題挑戰你的法律直覺。每題後會解釋法源。</p>
    <div class="quiz-controls" style="display:flex;gap:8px;margin:12px 0;align-items:center">
      <button id="quiz-mode-all" class="active">全部題目</button>
      <button id="quiz-mode-wrong" ${wrongIds.length ? '' : 'disabled'}>只看錯題（${wrongIds.length}）</button>
      <button id="quiz-mode-unseen">只看沒做過</button>
      <button id="quiz-reset" style="margin-left:auto">🗑️ 重置記分</button>
    </div>
    <div id="quiz-stats"></div>
    <div id="quiz-list"></div>
    <div id="quiz-score" style="margin-top:20px;font-size:16px;color:var(--accent);"></div>
  `;
  const $list = document.getElementById('quiz-list');
  const $stats = document.getElementById('quiz-stats');

  let mode = 'all';

  function showStats() {
    const p = loadProgress();
    const done = Object.keys(p).length;
    const correct = Object.values(p).filter(v => v === 'correct').length;
    const wrong = Object.values(p).filter(v => v === 'wrong').length;
    const pct = done ? Math.round(correct / done * 100) : 0;
    $stats.innerHTML = `
      <div style="background:var(--panel-2);padding:10px 14px;border-radius:6px;font-size:13px">
        📊 已做：${done}/${QUIZ.length}　✅ 正確：${correct}　❌ 錯：${wrong}
        ${done ? `正確率：${pct}%` : ''}
      </div>
    `;
  }

  function renderQuestions() {
    const p = loadProgress();
    let questions;
    if (mode === 'wrong') {
      questions = QUIZ.map((q, i) => ({q, i})).filter(({i}) => p[i] === 'wrong');
    } else if (mode === 'unseen') {
      questions = QUIZ.map((q, i) => ({q, i})).filter(({i}) => !p[i]);
    } else {
      questions = QUIZ.map((q, i) => ({q, i}));
    }

    if (!questions.length) {
      $list.innerHTML = `<p style="color:var(--fg-2);padding:20px;text-align:center">${mode==='wrong'?'目前沒有錯題':'你已完成全部題目'}</p>`;
      return;
    }

    $list.innerHTML = '';
    questions.forEach(({q, i}) => {
      const wrap = document.createElement('div');
      wrap.className = 'quiz-q';
      const past = p[i];
      wrap.innerHTML = `
        <div class="scenario"><b>Q${i+1}.</b> ${MLAW.escape(q.scenario)} ${past?`<span style="font-size:11px;color:${past==='correct'?'var(--good)':'var(--bad)'};margin-left:6px">${past==='correct'?'✓ 之前答對':'✗ 之前答錯'}</span>`:''}</div>
        <div class="quiz-options">
          ${q.options.map((o, j) => `<button data-i="${i}" data-j="${j}">${MLAW.escape(o.text)}</button>`).join('')}
        </div>
        <div class="quiz-explain" id="exp-${i}"></div>
        <div style="font-size:11px;color:var(--fg-2);margin-top:8px">📚 ${MLAW.escape(q.src)}</div>
      `;
      $list.appendChild(wrap);
    });
  }

  $list.addEventListener('click', e => {
    const btn = e.target.closest('button[data-i]');
    if (!btn) return;
    const i = +btn.dataset.i, j = +btn.dataset.j;
    const q = QUIZ[i];
    const opt = q.options[j];
    const $exp = document.getElementById(`exp-${i}`);
    if ($exp.classList.contains('show')) return;
    btn.parentElement.querySelectorAll('button').forEach(b=>{
      const oj = +b.dataset.j;
      b.classList.add(q.options[oj].ok ? 'correct' : 'wrong');
      b.disabled = true;
    });
    $exp.innerHTML = `<b>${opt.ok?'✅ 正確':'❌ 不對'}</b> — ${MLAW.escape(opt.why)}`;
    $exp.classList.add('show');
    const p = loadProgress();
    p[i] = opt.ok ? 'correct' : 'wrong';
    saveProgress(p);
    showStats();
  });

  document.getElementById('quiz-mode-all').addEventListener('click', () => {
    mode = 'all';
    document.querySelectorAll('.quiz-controls button').forEach(b=>b.classList.remove('active'));
    document.getElementById('quiz-mode-all').classList.add('active');
    renderQuestions();
  });
  document.getElementById('quiz-mode-wrong').addEventListener('click', () => {
    mode = 'wrong';
    document.querySelectorAll('.quiz-controls button').forEach(b=>b.classList.remove('active'));
    document.getElementById('quiz-mode-wrong').classList.add('active');
    renderQuestions();
  });
  document.getElementById('quiz-mode-unseen').addEventListener('click', () => {
    mode = 'unseen';
    document.querySelectorAll('.quiz-controls button').forEach(b=>b.classList.remove('active'));
    document.getElementById('quiz-mode-unseen').classList.add('active');
    renderQuestions();
  });
  document.getElementById('quiz-reset').addEventListener('click', () => {
    if (confirm('確定要清除所有 quiz 記分？')) {
      localStorage.removeItem(QUIZ_KEY);
      showStats();
      renderQuestions();
    }
  });

  if (!document.getElementById('quiz-ctrl-style')) {
    const s = document.createElement('style');
    s.id = 'quiz-ctrl-style';
    s.textContent = `
      .quiz-controls button{
        background:var(--panel-2);border:1px solid var(--border);color:var(--fg);
        padding:6px 12px;border-radius:14px;font-size:12px;cursor:pointer;
      }
      .quiz-controls button.active{background:var(--accent);color:#000;border-color:var(--accent)}
      .quiz-controls button:disabled{opacity:.5;cursor:not-allowed}
    `;
    document.head.appendChild(s);
  }

  showStats();
  renderQuestions();
}
registerRoute('quiz', renderQuiz);
