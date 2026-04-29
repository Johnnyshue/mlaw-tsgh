# 醫療法律自學專案 — Claude 工作規則

> 這是徐嘉佑（TSGH PGY）的醫療法律自學網站主庫。
> **未來所有醫療法律相關知識，都要更新到這個 repo。**
> 部署：https://johnnyshue.github.io/mlaw-tsgh/

## 觸發更新的情境

用戶說以下任一句 → 立刻把內容整理進這個 repo：

- 「我今天學到 [XX 法律 / 判決 / 條文]」
- 「值班遇到 [醫糾相關]」
- 「reviewer 提到 [法律觀點]」
- 「老師說 [法律知識]」
- 「最近有個新判決 [...]」
- 「[XX 法] 修法了」
- 「以後遇到 [醫療法律相關] 都記下來」

## 更新分類對照表

| 用戶提到什麼 | 該更新哪裡 | 步驟 |
|---|---|---|
| **新判決/案例** | `cases/caseXX_*.md` + `cases/_index.json` | 寫 .md（用既有格式：來源/事實/爭點/結果/教訓/法條）+ index 加條目 |
| **新法條/法律修法** | `scripts/fetch_laws.py` 的 LAWS 加 pcode → 跑 `./update.sh laws` | 自動爬下來 |
| **新章節想法** | `content/chXX_*.md` + `content/manifest.json` | 標題簡短（手機 sidebar） |
| **DO/DON'T 心得** | `assets/modules/dosdonts.js` 的 `DOSDONTS` 陣列 | `{cat, do, dont, src}` 格式 |
| **Quiz 情境** | `assets/modules/quiz.js` 的 `QUIZ` 陣列 | 4 選 1 + 解釋 + 法源 |
| **法律分析/長文** | `cases/lawXX_*.md` 或 `cases/guideXX_*.md` | 用「法律分析」或「防身指南」前綴 |
| **統計數據** | `cases/statsXX_*.md` | 附原始來源 URL |
| **延伸資源網址** | `extra/manifest.json` | 加 `{title, url}` |

## 案例 .md 格式（必須遵守）

```markdown
# Case XX | 科別：標題（醫院, 年份）

## 來源
- 主要來源：<URL or 裁判字號>
- 信心等級：高/中/低

## 裁判字號（可選）
| 審級 | 字號 | 日期 | 結果 |

## 事實
（簡述）

## 爭點
（重點）

## 結果
（民/刑事判決，賠償金額或刑度）

## 醫師教訓（DO/DON'T）
- ✅ DO: ...
- ❌ DON'T: ...

## 引用法條
- 醫療法 §XX
- 刑法 §XX

## 法官說理重點
（一段精華）
```

## 🔴 第一鐵則：禁止造假（永久）

每次更新前必須：
1. **裁判字號**：必須真實可查（司法院裁判書系統）。沒查到就標「中」信心 + 寫「字號未在公開資料中找到」。
2. **法條編號**：必須真實。從 `laws/*.json` 確認。
3. **新聞來源**：必須附 URL，可點擊驗證。
4. **找不到 = 寫「找不到」**，不要編。

## 部署流程（標準 SOP）

```bash
cd ~/claude_projects/醫療法律

# 編輯內容（依上表）

git add -A
git commit -m "簡述更新內容"
git push

# Pages 自動部署，1-2 分鐘後線上更新
# 驗證：curl -I https://johnnyshue.github.io/mlaw-tsgh/
```

## 結構速查

```
醫療法律/
├── content/         11 章學習內容（基礎課程）
├── cases/           22+ 真實案例（隨時間擴充）
├── laws/            16 部法律全條文 JSON
├── extra/           延伸資源
├── assets/
│   └── modules/     5 個互動工具（laws/dosdonts/quiz/consent/radar）
└── scripts/
    └── fetch_laws.py  爬全國法規資料庫
```

## 注意事項

- **公開 repo**：repo 名 `mlaw-tsgh`，已是 GitHub Pages public（無密碼）。
- **不要寫病人個資**：所有案例都從公開新聞/判決取，去識別化。
- **Sidebar 標題保持短**：手機看才不會擠（章節 title 控制在 ~10 字內）。
- **每次更新 commit message** 要寫清楚，方便日後查歷史。

## 範例：用戶說「我今天學到一個新案例」

我應該：
1. 問用戶：來源（新聞/judgment/口述）
2. 用上面的案例格式寫 `cases/caseNN_*.md`
3. 在 `cases/_index.json` 加一行（標題短）
4. 如果牽涉新法條 → 也加進 quiz/dosdonts/章節
5. `git add -A; git commit -m "新增 caseNN: ..."; git push`
6. 告訴用戶 1-2 分鐘後線上會更新
