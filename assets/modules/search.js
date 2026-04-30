// search.js — 全站搜尋（簡化版）
(function () {
  var _idx = null;

  function escRe(s) {
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if ('.+*?^$()|{}/'.indexOf(c) >= 0) out += '\\';
      else if (c === '\\' || c === '[' || c === ']' || c === '-') out += '\\';
      out += c;
    }
    return out;
  }

  function highlight(text, q) {
    if (!q) return MLAW.escape(text);
    var safe = MLAW.escape(text);
    var re;
    try { re = new RegExp(escRe(q), 'gi'); } catch (e) { return safe; }
    return safe.replace(re, function (m) { return '<mark>' + m + '</mark>'; });
  }

  function snippet(text, q) {
    var lower = text.toLowerCase();
    var idx = lower.indexOf(q.toLowerCase());
    if (idx < 0) return text.slice(0, 120) + '…';
    var s = Math.max(0, idx - 40);
    var e = Math.min(text.length, idx + q.length + 80);
    return (s > 0 ? '…' : '') + text.slice(s, e) + (e < text.length ? '…' : '');
  }

  async function buildIndex() {
    if (_idx) return _idx;
    var idx = [];
    try {
      var m = await (await fetch('content/manifest.json')).json();
      for (var i = 0; i < m.chapters.length; i++) {
        var c = m.chapters[i];
        try {
          var md = await (await fetch('content/' + c.id + '.md')).text();
          idx.push({ type: 'chapter', title: c.title, body: md, route: '#' + c.id, tag: '章節' });
        } catch (e) {}
      }
    } catch (e) {}

    try {
      var arr = await (await fetch('cases/_index.json')).json();
      for (var i = 0; i < arr.length; i++) {
        var c = arr[i];
        try {
          var md = await (await fetch('cases/' + c.id + '.md')).text();
          idx.push({ type: 'case', title: c.title, body: md, route: '#case_' + c.id, tag: c.tag || '案例' });
        } catch (e) {}
      }
    } catch (e) {}

    try {
      var laws = await (await fetch('laws/_index.json')).json();
      for (var i = 0; i < laws.length; i++) {
        var l = laws[i];
        try {
          var data = await (await fetch('laws/' + l.file)).json();
          for (var j = 0; j < data.articles.length; j++) {
            var a = data.articles[j];
            idx.push({ type: 'article', title: data.title + ' ' + a.no, body: a.text, route: '#laws/' + l.pcode, tag: l.tag });
          }
        } catch (e) {}
      }
    } catch (e) {}

    _idx = idx;
    return idx;
  }

  async function renderSearch($el) {
    $el.innerHTML =
      '<h1>🔍 全站搜尋</h1>' +
      '<p>輸入關鍵字（如「告知」、「§82」、「胸痛」），會搜尋所有章節 + 案例 + 法條。</p>' +
      '<input class="law-search" id="search-input" placeholder="搜尋… (中英文皆可)" autofocus>' +
      '<div id="search-stats" style="font-size:13px;color:var(--fg-2);margin:8px 0"></div>' +
      '<div id="search-results"></div>';

    var $input = document.getElementById('search-input');
    var $stats = document.getElementById('search-stats');
    var $results = document.getElementById('search-results');

    $stats.textContent = '建立索引中…';
    var idx = await buildIndex();
    var nC = idx.filter(function (x) { return x.type === 'chapter'; }).length;
    var nCa = idx.filter(function (x) { return x.type === 'case'; }).length;
    var nA = idx.filter(function (x) { return x.type === 'article'; }).length;
    $stats.textContent = '已索引 ' + idx.length + ' 筆內容（' + nC + ' 章節 / ' + nCa + ' 案例 / ' + nA + ' 法條）';

    var timer = null;
    $input.addEventListener('input', function (e) {
      clearTimeout(timer);
      timer = setTimeout(function () { doSearch(e.target.value.trim()); }, 200);
    });

    function doSearch(q) {
      if (!q) { $results.innerHTML = ''; return; }
      var qL = q.toLowerCase();
      var matches = idx.filter(function (x) {
        return x.title.toLowerCase().indexOf(qL) >= 0 || x.body.toLowerCase().indexOf(qL) >= 0;
      });
      matches.sort(function (a, b) {
        var ta = a.title.toLowerCase().indexOf(qL) >= 0 ? 0 : 1;
        var tb = b.title.toLowerCase().indexOf(qL) >= 0 ? 0 : 1;
        return ta - tb;
      });
      if (!matches.length) {
        $results.innerHTML = '<p style="color:var(--fg-2)">沒有結果</p>';
        return;
      }
      var html = '<p style="color:var(--fg-2);font-size:13px">找到 ' + matches.length + ' 筆</p>';
      matches.slice(0, 50).forEach(function (m) {
        var icon = m.type === 'chapter' ? '📘' : (m.type === 'article' ? '📜' : '⚖️');
        html += '<a class="search-result" href="' + m.route + '">' +
          '<div class="sr-tag">' + icon + ' ' + MLAW.escape(m.tag || '') + '</div>' +
          '<div class="sr-title">' + highlight(m.title, q) + '</div>' +
          '<div class="sr-snippet">' + highlight(snippet(m.body, q), q) + '</div>' +
          '</a>';
      });
      if (matches.length > 50) html += '<p style="color:var(--fg-2);font-size:13px">（顯示前 50 筆，請縮小關鍵字）</p>';
      $results.innerHTML = html;
    }

    if (!document.getElementById('search-style')) {
      var s = document.createElement('style');
      s.id = 'search-style';
      s.textContent =
        '.search-result{display:block;background:var(--panel);border:1px solid var(--border);' +
        'border-radius:6px;padding:10px 14px;margin:8px 0;text-decoration:none;color:var(--fg);}' +
        '.search-result:hover{border-color:var(--accent);text-decoration:none}' +
        '.sr-tag{font-size:11px;color:var(--fg-2);margin-bottom:4px}' +
        '.sr-title{font-size:14px;font-weight:600;margin-bottom:4px}' +
        '.sr-snippet{font-size:12px;color:var(--fg-2);line-height:1.7}' +
        'mark{background:#fde047;color:#000;padding:0 2px;border-radius:2px}';
      document.head.appendChild(s);
    }
  }

  registerRoute('search', renderSearch);
})();
