# 各科地雷 #5：麻醉科（單位風險最高）

> 麻醉科病人總數不大，但**單位風險極高**——每一個麻醉決定都可能直接影響生死。
> 史上最高賠償（4000 萬）就發生在麻醉科（case09 北聯醫植物人案）。

---

## 為什麼麻醉風險特別

| 因素 | 影響 |
|------|------|
| 直接介入 vital sign | 任何錯誤即時致命 |
| 病人意識消失 | 無法即時反映身體變化 |
| 多重藥物交互作用 | 失誤累積效應 |
| 緊急情況需秒級判斷 | 反應慢一步就出事 |

**真實案例賠償**：
- case09 北聯醫植物人：4000 萬（史上最高，子宮肌瘤切除麻醉）
- case08 葳亞娜惡性高熱：558 萬（隆鼻整形）
- case07 微笑診所：刑事入獄（密醫 + 麻醉相關）

---

## 💉 雷區 1：術前評估不完整

### 真實案例對應
- **case08 葳亞娜**：未問家族史 → 病人惡性高熱死亡

### 法律邏輯
- 術前評估是麻醉醫師的「**法定義務**」
- 沒問 = 違反注意義務（醫療法 §82）

### PGY 防身做法

**Pre-anesthesia evaluation 必問項目**：
1. **病史**：心血管、肺、肝腎、糖尿病、過敏
2. **手術/麻醉史**：之前麻醉有無問題
3. **家族史**（特別重要）：
   - **惡性高熱**（malignant hyperthermia）家族史
   - 假性膽鹼酯酶缺乏
   - Porphyria
4. **用藥**：抗凝血劑、單胺氧化酶抑制劑、類固醇
5. **NPO 狀態**：8 hr solid / 6 hr light meal / 2 hr clear liquid
6. **氣道評估**：
   - Mallampati class（I-IV）
   - 嘴張開、頸部活動
   - 假牙、鬆動牙
7. **ASA classification**（I-V）

### 病歷救命寫法
```
Pre-op assessment: 2026-04-30 09:00

Pt: 45 y/o 男性 BMI 28
Past Hx: HTN on amlodipine, otherwise unremarkable
Anesthesia Hx: appendectomy 2018 under spinal, no complications
**Family Hx: NO known malignant hyperthermia, NO sudden death during surgery**
Allergy: NKDA
Meds: amlodipine 5mg qd, last dose this AM (held)
NPO: since midnight (10 hr)
Airway: Mallampati II, mouth opening 4cm, full neck ROM, no loose teeth
ASA: II

Plan: GA with sevoflurane + fentanyl + rocuronium
**Patient and family informed about MH risk and treatment availability (dantrolene available in OR)**
Patient consent obtained
```

---

## 💉 雷區 2：術中監測不足

### 真實案例對應
- **case08 葳亞娜**：「術中未監測 EtCO₂ 和體溫」 → 惡性高熱沒及早發現
- **case09 北聯醫**：「發現狀況未馬上處理」 → 腦缺氧植物人

### PGY 防身做法

**ASA standard monitoring（最低標準）**：
- **Continuous EKG**
- **Pulse oximetry**（SpO₂）
- **Non-invasive BP**（每 5 min）
- **Capnography**（EtCO₂）— **這是最早期警示！**
- **Temperature**（特別是 > 30 min 麻醉）
- **Inspired/expired anesthetic gases**

**EtCO₂ 異常的意義**（早期警示）：
- ↑ EtCO₂ 突發 = MH、re-breathing、hypoventilation
- ↓ EtCO₂ 突發 = circuit disconnection、pulmonary embolism、cardiac arrest
- 看不到 capnography = 立刻找原因

**惡性高熱（MH）警示**：
- 早期：**EtCO₂ 突發升高**（最早！）+ tachycardia + masseter spasm
- 中期：體溫升高（**晚期才升高，等到體溫 = 太遲**）
- 處置：立刻停手術 + dantrolene + 主動降溫 + 通知 ICU
- **每個 OR 都要備 dantrolene**

---

## 💉 雷區 3：困難氣道處理失敗

### 法律邏輯
無法 ventilate / intubate → 缺氧 → 腦損傷 → 高額賠償

### PGY 防身做法

**ASA Difficult Airway Algorithm（簡化版）**：
1. **預測困難氣道** → 清醒插管或備援設備
2. **無法插管** → mask ventilation
3. **無法 ventilate** → LMA / supraglottic
4. **無法用任何方式通氣** → emergency cricothyrotomy

**關鍵時間**：
- **缺氧 4 min** → 腦損傷
- **缺氧 6-10 min** → 不可逆腦死

→ **不要遲疑**，無法通氣立即升級

**團隊溝通**：
- 「I cannot ventilate, calling for help」**大聲說出來**
- Push emergency button
- 預先 brief 助手 emergency cricothyrotomy 位置

---

## 💉 雷區 4：藥物錯誤 / 過敏反應

### 法律邏輯
- 給錯藥（wrong drug）= 客觀違反 SOP
- 已知過敏給過敏藥 = 重大過失

### PGY 防身做法

**用藥 5 確認（5 R）**：
1. Right patient
2. Right drug
3. Right dose
4. Right route
5. Right time

**麻醉常見藥物錯誤**：
- 顏色相近 vials（succinylcholine vs neostigmine）
- 濃度不同（lidocaine 1% vs 2%）
- 兒童計算錯誤（看 specialty_pediatrics.md）
- ephedrine vs epinephrine（差 10 倍劑量）

**過敏處置**：
- 立刻停藥
- IV epinephrine（mild → IM）
- IV crystalloid bolus
- diphenhydramine + steroid
- airway 保護

---

## 💉 雷區 5：醫美診所「無麻醉醫師」陷阱

### 真實案例對應
- **case07 微笑診所**：非醫師執行麻醉 → 刑事入獄（密醫罪）
- **case08 葳亞娜**：護理師執行氣管插管 → 民事 558 萬 + 刑事審理中

### 法律核心
- 醫師法 §28：未領有醫師證書執行醫療業務 = 密醫罪
- **全身麻醉 = 醫療業務**，必須由醫師執行
- 「我有醫師證」≠ 「我是麻醉專科」，但**整形醫師自行麻醉**法律上可行（無分科限制），實務上極危險

### PGY 防身做法（如果你考慮在醫美診所工作或自行開業）

**全身麻醉手術**：
- **必須由麻醉專科醫師執行**
- 不可由護理師、技術員或無相關訓練的人員操作
- 必備設備：anesthesia machine、 monitor、急救藥品（含 dantrolene、epinephrine、atropine）

**鎮靜（sedation）的法律灰色地帶**：
- Conscious sedation：可由非麻醉醫師執行，但**必須有合格 monitoring**
- Deep sedation：實質等於 GA，建議麻醉醫師
- **病人從 conscious sedation 滑入 deep sedation 是常見悲劇**

---

## 麻醉科醫師「上機前 5 個自我提問」

1. ✅ 術前評估**完整**嗎？特別是 family Hx of MH？
2. ✅ 困難氣道**預測**了嗎？備援設備在嗎？
3. ✅ Standard monitoring **全部接好**了嗎（特別 EtCO₂）？
4. ✅ 緊急藥物（dantrolene、epi、atropine）**位置我知道**嗎？
5. ✅ 我做的所有處置**有時間戳記紀錄**嗎？

---

## 「術中異常事件」病歷救命寫法

```
14:35 sevoflurane 開始 + rocuronium induction
14:38 endotracheal intubation successful, EtCO₂ 35
14:55 EtCO₂ 突發升高至 60 mmHg, HR 130
       ↓
       Suspect malignant hyperthermia
14:56 立刻通知主刀，停麻醉，改 100% O₂
14:57 dantrolene 2.5 mg/kg IV bolus 給予
14:58 主動降溫（cold IV fluid + ice packs to groin/axilla）
15:00 EtCO₂ 開始下降，HR 110
15:05 已通知 ICU 準備接收，CK + ABG 已抽
15:15 病人轉 ICU，sustained dantrolene
       已向家屬說明事件經過及後續監測
```

→ 即使後果很嚴重，**完整紀錄 = 你的辯護證據**。case08 葳亞娜輸的關鍵就是「沒有 EtCO₂ 監測」。

---

**配合閱讀**：
- case07 微笑診所
- case08 葳亞娜診所
- case09 北聯醫植物人
- master_yang_kun_ren.md（病歷）

**法源**：
- 醫療法 §63（麻醉同意書）、§82
- 醫師法 §28（密醫罪）
- ASA standards of basic anesthetic monitoring
