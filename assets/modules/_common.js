// 共用工具 + 路由註冊（必須在 modules 之前載入）
window.__routes__ = window.__routes__ || {};
window.registerRoute = function(name, fn){ window.__routes__[name] = fn; };

window.MLAW = {
  async fetchJSON(path) {
    const r = await fetch(path);
    if (!r.ok) throw new Error(`fetch ${path} failed: ${r.status}`);
    return r.json();
  },
  escape(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  },
  highlight(text, q) {
    if (!q) return this.escape(text);
    const safe = this.escape(text);
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'gi');
    return safe.replace(re, m=>`<mark>${m}</mark>`);
  }
};
