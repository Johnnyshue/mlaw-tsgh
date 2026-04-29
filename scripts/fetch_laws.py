#!/usr/bin/env python3
"""
從全國法規資料庫 (law.moj.gov.tw) 爬下醫療相關法條。
資料來源：法務部「全國法規資料庫」公開網頁。
"""

import json
import time
import subprocess
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
LAWS_DIR = ROOT / "laws"
LAWS_DIR.mkdir(exist_ok=True)

# pcode 來自全國法規資料庫
LAWS = [
    {"pcode": "L0020021", "name": "醫療法", "tag": "核心"},
    {"pcode": "L0020001", "name": "醫師法", "tag": "核心"},
    {"pcode": "L0020023", "name": "醫療法施行細則", "tag": "核心"},
    {"pcode": "L0020227", "name": "醫療事故預防及爭議處理法", "tag": "核心"},
    {"pcode": "L0020189", "name": "病人自主權利法", "tag": "核心"},
    {"pcode": "L0020066", "name": "安寧緩和醫療條例", "tag": "核心"},
    {"pcode": "L0020045", "name": "緊急醫療救護法", "tag": "核心"},
    {"pcode": "L0020166", "name": "護理人員法", "tag": "醫事"},
    {"pcode": "C0000001", "name": "中華民國刑法", "tag": "刑事"},
    {"pcode": "B0000001", "name": "民法", "tag": "民事"},
    {"pcode": "I0050021", "name": "個人資料保護法", "tag": "資訊"},
    {"pcode": "L0020176", "name": "人體研究法", "tag": "研究"},
    {"pcode": "L0020024", "name": "人體器官移植條例", "tag": "特殊"},
    {"pcode": "L0020030", "name": "精神衛生法", "tag": "特殊"},
    {"pcode": "L0050001", "name": "傳染病防治法", "tag": "公衛"},
    {"pcode": "L0060001", "name": "全民健康保險法", "tag": "健保"},
]

# 去重
seen = set()
LAWS = [x for x in LAWS if not (x["pcode"] in seen or seen.add(x["pcode"]))]


def fetch_html(pcode: str) -> str:
    url = f"https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode={pcode}"
    out = subprocess.run(
        ["curl", "-sSL", "--max-time", "30", "-A", "Mozilla/5.0", url],
        capture_output=True,
        text=True,
        timeout=40,
    )
    return out.stdout


def parse_law(html: str, name: str) -> dict:
    soup = BeautifulSoup(html, "html.parser")
    # 標題：從 <title> 拿，例如「醫療法-全國法規資料庫」
    title = name
    if soup.title:
        t = soup.title.get_text(strip=True)
        if "-" in t:
            title = t.split("-")[0].strip()
    # 修正日期
    date_text = ""
    for td in soup.select("table.table tbody td"):
        t = td.get_text(strip=True)
        if "修正" in t or "民國" in t:
            date_text = t
            break

    articles = []
    rows = soup.select("div.law-reg-content .row")
    for r in rows:
        no_el = r.select_one(".col-no")
        data_el = r.select_one(".col-data")
        if not (no_el and data_el):
            continue
        no = no_el.get_text(strip=True)
        # 結構：.col-data > .law-article > div × N（每項一個 div）
        article_wrap = data_el.select_one(".law-article") or data_el
        item_divs = [d for d in article_wrap.find_all("div", recursive=False)]
        lines = []
        if item_divs:
            for d in item_divs:
                txt = d.get_text(" ", strip=True)
                if txt:
                    lines.append(txt)
        else:
            txt = article_wrap.get_text(" ", strip=True)
            if txt:
                lines.append(txt)
        articles.append({"no": no, "text": "\n".join(lines)})

    # 找章節（編、章、節）
    chapters = []
    for el in soup.select("div.law-reg-content h3, div.law-reg-content .h3"):
        chapters.append(el.get_text(strip=True))

    return {
        "title": title,
        "date": date_text,
        "article_count": len(articles),
        "chapters": chapters,
        "articles": articles,
    }


def main():
    index = []
    for law in LAWS:
        out_path = LAWS_DIR / f"{law['pcode']}.json"
        print(f"抓 {law['name']} ({law['pcode']}) ...", end=" ", flush=True)
        try:
            html = fetch_html(law["pcode"])
            data = parse_law(html, law["name"])
            data["pcode"] = law["pcode"]
            data["tag"] = law["tag"]
            data["source"] = (
                f"https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode={law['pcode']}"
            )
            out_path.write_text(
                json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
            )
            print(f"OK {data['article_count']} 條")
            index.append(
                {
                    "pcode": law["pcode"],
                    "name": law["name"],
                    "tag": law["tag"],
                    "article_count": data["article_count"],
                    "date": data["date"],
                    "source": data["source"],
                    "file": f"{law['pcode']}.json",
                }
            )
        except Exception as e:
            print(f"FAIL {e}")
        time.sleep(0.6)

    (LAWS_DIR / "_index.json").write_text(
        json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"\n=== 完成 {len(index)}/{len(LAWS)} 部法律 ===")


if __name__ == "__main__":
    main()
