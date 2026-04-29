// SPA 主程式：路由 + 章節載入 + 互動模組
// routes 與 registerRoute 已在 _common.js 預先建立
const routes = window.__routes__;

const $content = document.getElementById('content');
const $sidebar = document.getElementById('sidebar');
const $overlay = document.getElementById('sidebar-overlay');
const $toggle = document.getElementById('menu-toggle');

$toggle?.addEventListener('click', ()=> {
  $sidebar.classList.toggle('open');
  $overlay.classList.toggle('show');
});
$overlay?.addEventListener('click', ()=> {
  $sidebar.classList.remove('open');
  $overlay.classList.remove('show');
});

async function loadChapter(id) {
  const url = `content/${id}.md`;
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(r.status);
    const md = await r.text();
    $content.innerHTML = marked.parse(md);
  } catch (e) {
    $content.innerHTML = `<div class="card bad"><h2>無法載入</h2><p>${url}</p><p>${e.message}</p></div>`;
  }
}

async function renderAbout() {
  $content.innerHTML = `
    <h1>⚖️ 關於本網站</h1>
    <div class="card">
      <h3>製作者</h3>
      <p>徐嘉佑｜三軍總醫院 PGY 不分科住院醫師</p>
      <h3>目的</h3>
      <p>「不想當愛心醫生還被告」— 用法官視角學醫療法律。</p>
      <h3>資料來源</h3>
      <ul>
        <li>法條：<a href="https://law.moj.gov.tw" target="_blank">全國法規資料庫</a>（爬蟲取得）</li>
        <li>判決：<a href="https://judgment.judicial.gov.tw" target="_blank">司法院裁判書系統</a>（連結至原始）</li>
        <li>統計：<a href="https://www.thrf.org.tw/dispute" target="_blank">醫改會醫療爭議統計</a></li>
        <li>章節內容：基於上述真實法條與公開資料整理</li>
      </ul>
      <h3>禁止造假原則</h3>
      <p>本站每個法條編號、條文內容皆來自全國法規資料庫；
        每個外部連結都可點開驗證；找不到的事就標明「請至原始資料庫查詢」，不編造案號或判決細節。</p>
    </div>
    <div class="card warn">
      <h3>⚠️ 免責</h3>
      <p>本網站為個人學習筆記，不構成法律意見。具體法律問題應諮詢律師或醫師公會。</p>
    </div>
  `;
}

async function dispatch() {
  const hash = location.hash.slice(1) || 'ch00_mindset';
  document.querySelectorAll('#sidebar a').forEach(a => a.classList.remove('active'));
  const link = document.querySelector(`#sidebar a[href="#${hash}"]`);
  link?.classList.add('active');

  if (hash === 'about') return renderAbout();

  // 互動模組
  if (routes[hash]) return routes[hash]($content);

  // 章節
  await loadChapter(hash);
  // 自動關閉 mobile 選單
  $sidebar.classList.remove('open');
  $overlay.classList.remove('show');
}

window.addEventListener('hashchange', dispatch);

async function init() {
  // 載入章節清單
  try {
    const r = await fetch('content/manifest.json');
    const m = await r.json();
    const $list = document.getElementById('chapter-list');
    m.chapters.forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="#${c.id}" data-route="${c.id}">${c.emoji||''} ${c.title}</a>`;
      $list.appendChild(li);
    });
  } catch (e) { console.error('chapter list:', e); }

  // 載入案例清單（cases/ 目錄下的 .md，由 researcher agent 產生）
  try {
    const r = await fetch('cases/_index.json');
    if (r.ok) {
      const idx = await r.json();
      const $list = document.getElementById('case-list');
      $list.innerHTML = '';
      idx.forEach(c => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#case_${c.id}" data-route="case_${c.id}">${c.emoji||'⚖️'} ${c.title}</a>`;
        $list.appendChild(li);
        registerRoute(`case_${c.id}`, async ($el)=>{
          const r2 = await fetch(`cases/${c.id}.md`);
          if (r2.ok) $el.innerHTML = marked.parse(await r2.text());
          else $el.innerHTML = `<p>找不到案例 ${c.id}</p>`;
        });
      });
    } else {
      document.getElementById('case-list').innerHTML = '<li class="loading">案例尚未生成</li>';
    }
  } catch (e) {
    document.getElementById('case-list').innerHTML = '<li class="loading">案例尚未生成</li>';
  }

  // 載入延伸資源
  try {
    const r = await fetch('extra/manifest.json');
    if (r.ok) {
      const m = await r.json();
      const $list = document.getElementById('extra-list');
      $list.innerHTML = '';
      m.items.forEach(item => {
        const li = document.createElement('li');
        if (item.url) {
          li.innerHTML = `<a href="${item.url}" target="_blank">🔗 ${item.title}</a>`;
        } else {
          li.innerHTML = `<a href="#${item.id}">📄 ${item.title}</a>`;
        }
        $list.appendChild(li);
      });
    } else {
      document.getElementById('extra-list').innerHTML = '<li class="loading">尚無</li>';
    }
  } catch (e) {
    document.getElementById('extra-list').innerHTML = '<li class="loading">尚無</li>';
  }

  // 更新日期
  document.getElementById('update-date').textContent = new Date().toISOString().slice(0,10);

  await dispatch();
}

window.__mlawInit = init;
if (!window.__mlawWaitAuth) init();
