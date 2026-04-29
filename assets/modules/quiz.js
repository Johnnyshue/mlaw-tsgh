// 🎯 法律情境 Quiz
const QUIZ = [
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
];

async function renderQuiz($el) {
  $el.innerHTML = `
    <h1>🎯 法律情境 Quiz</h1>
    <p>${QUIZ.length} 道題目，每題挑戰你的法律直覺。每題後會解釋法源。</p>
    <div id="quiz-list"></div>
    <div id="quiz-score" style="margin-top:20px;font-size:16px;color:var(--accent);"></div>
  `;
  const $list = document.getElementById('quiz-list');
  let answered = 0, correct = 0;
  QUIZ.forEach((q, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'quiz-q';
    wrap.innerHTML = `
      <div class="scenario"><b>Q${i+1}.</b> ${MLAW.escape(q.scenario)}</div>
      <div class="quiz-options">
        ${q.options.map((o, j) => `<button data-i="${i}" data-j="${j}">${MLAW.escape(o.text)}</button>`).join('')}
      </div>
      <div class="quiz-explain" id="exp-${i}"></div>
      <div style="font-size:11px;color:var(--fg-2);margin-top:8px">📚 ${MLAW.escape(q.src)}</div>
    `;
    $list.appendChild(wrap);
  });
  $list.addEventListener('click', e => {
    const btn = e.target.closest('button[data-i]');
    if (!btn) return;
    const i = +btn.dataset.i, j = +btn.dataset.j;
    const q = QUIZ[i];
    const opt = q.options[j];
    const $exp = document.getElementById(`exp-${i}`);
    if ($exp.classList.contains('show')) return; // 已答
    btn.parentElement.querySelectorAll('button').forEach(b=>{
      const oj = +b.dataset.j;
      b.classList.add(q.options[oj].ok ? 'correct' : 'wrong');
      b.disabled = true;
    });
    $exp.innerHTML = `<b>${opt.ok?'✅ 正確':'❌ 不對'}</b> — ${MLAW.escape(opt.why)}`;
    $exp.classList.add('show');
    answered++;
    if (opt.ok) correct++;
    document.getElementById('quiz-score').textContent =
      `已答：${answered}/${QUIZ.length}　正確：${correct}　正確率：${Math.round(correct/answered*100)}%`;
  });
}
registerRoute('quiz', renderQuiz);
