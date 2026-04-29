// 📜 法條速查
let _lawsIndex = null;
let _currentLaw = null;

async function loadIndex() {
  if (!_lawsIndex) _lawsIndex = await MLAW.fetchJSON('laws/_index.json');
  return _lawsIndex;
}

function lawCardHTML(l) {
  return `<div class="law-card" data-pcode="${l.pcode}">
    <h3>${MLAW.escape(l.name)}</h3>
    <p class="meta">
      <span class="tag ${l.tag==='核心'?'core':l.tag==='刑事'?'crim':l.tag==='民事'?'civil':'info'}">${l.tag}</span>
      ${l.article_count} 條
    </p>
    <p class="meta">${MLAW.escape(l.date||'')}</p>
  </div>`;
}

async function renderLawList($el) {
  const idx = await loadIndex();
  const sorted = [...idx].sort((a,b)=>{
    const ord = {'核心':0,'刑事':1,'民事':2,'醫事':3,'資訊':4,'研究':5,'特殊':6,'公衛':7,'健保':8};
    return (ord[a.tag]??99)-(ord[b.tag]??99);
  });
  $el.innerHTML = `
    <h1>📜 法條速查</h1>
    <p>16 部醫療法律相關法條，全部來自 <a href="https://law.moj.gov.tw" target="_blank">全國法規資料庫</a>。</p>
    <input class="law-search" id="law-grid-search" placeholder="搜尋法律名稱（例：醫療法、刑法、知情同意…）">
    <div class="law-grid" id="law-grid"></div>
  `;
  const $grid = document.getElementById('law-grid');
  $grid.innerHTML = sorted.map(lawCardHTML).join('');
  $grid.addEventListener('click', e => {
    const card = e.target.closest('.law-card');
    if (!card) return;
    location.hash = `laws/${card.dataset.pcode}`;
  });
  document.getElementById('law-grid-search').addEventListener('input', e=>{
    const q = e.target.value.toLowerCase();
    $grid.innerHTML = sorted.filter(l => l.name.toLowerCase().includes(q)).map(lawCardHTML).join('');
  });
}

async function renderLawDetail($el, pcode) {
  const idx = await loadIndex();
  const meta = idx.find(l=>l.pcode===pcode);
  if (!meta) { $el.innerHTML = `<p>找不到 ${pcode}</p>`; return; }
  const law = await MLAW.fetchJSON(`laws/${pcode}.json`);
  _currentLaw = law;

  $el.innerHTML = `
    <h1>📜 ${MLAW.escape(law.title)}</h1>
    <p>共 ${law.article_count} 條 ｜ ${MLAW.escape(law.date||'')} ｜
       <a href="${law.source}" target="_blank">原始來源</a> ｜
       <a href="#laws">← 返回清單</a></p>
    <input class="law-search" id="law-detail-search" placeholder="在此法律中搜尋條文（例：手術、同意書、過失）">
    <div id="law-articles"></div>
  `;
  const $arts = document.getElementById('law-articles');
  function paint(q) {
    const filtered = q
      ? law.articles.filter(a => a.text.includes(q) || a.no.includes(q))
      : law.articles;
    if (!filtered.length) { $arts.innerHTML = '<p>沒有符合條文</p>'; return; }
    $arts.innerHTML = filtered.map(a => `
      <div class="article">
        <div class="no">${MLAW.escape(a.no)}</div>
        <div class="text">${MLAW.highlight(a.text, q)}</div>
      </div>
    `).join('');
  }
  paint('');
  document.getElementById('law-detail-search').addEventListener('input', e => paint(e.target.value));
}

registerRoute('laws', renderLawList);
// 動態 sub-route：laws/{pcode}
window.addEventListener('hashchange', () => {
  const h = location.hash.slice(1);
  if (h.startsWith('laws/')) {
    const pcode = h.slice('laws/'.length);
    renderLawDetail(document.getElementById('content'), pcode);
  }
});
