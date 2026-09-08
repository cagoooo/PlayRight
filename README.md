# Playwright × Webwright — AI Agent 的 Web 技能雙引擎 🐿️

> 一頁讀懂 **Playwright** 與 **Webwright** —— 讓你的 AI Agent 看得懂、做得到、任務完成有回報！

> 📌 **建置版本：2026.06.04-1**（依據 `version.json`）

一個用純 HTML / CSS / JavaScript 製作的單頁互動式介紹網站，整理了這兩個常在 AI Agent 社群看到的關鍵字，並收錄阿凱老師用 Playwright + `profile.json` 自動填寫 Google 表單的真實實作日記。

## 🌐 線上看

👉 **https://cagoooo.github.io/PlayRight/**

## 內容章節

1. **常見疑問** — 這兩個關鍵字到底是什麼？一句話先講清楚
2. **雙引擎對照** — `01 Playwright`（控制瀏覽器的自動化工具）vs `02 Webwright`（AI 驅動的任務代理框架）
3. **VS 對決** — 「你操作我執行」 vs 「你說需求，AI 幫你完成」
4. **五大應用情境** — 電商分析、表單自動化、資料擷取、研究與測試、企業流程
5. **AI Agent 網頁任務流程** — 接收任務 → 分析頁面 → 生成程式碼 → 執行操作 → 回傳結果
6. **實作日記** — Playwright + 可擴充 `profile.json` 自動填表初體驗
7. **下一關** — 把長官已決行的電子公文交給 Agent 自動歸檔的願望

## 一句話分清楚

| | Playwright | Webwright |
|---|---|---|
| 定位 | 控制瀏覽器的自動化工具 | AI 驅動的瀏覽器任務代理框架 |
| 出身 | Microsoft 開源框架 | Microsoft Research 提出 |
| 互動方式 | **你操作，我執行**（給步驟與選擇器） | **你說需求，AI 幫你完成**（自然語言） |
| 角色 | 動手操作網頁 | 動腦規劃任務 |

## 關於 `profile.json`（自動填表設定檔）

每個欄位用 `keys` 陣列列出可能的標題關鍵字，命中就自動填入對應 `value`。
想多填一個欄位？再加一組就好——**不用改程式，只改設定檔**。

```json
{
  "姓名": { "keys": ["姓名", "name"], "value": "王小明" },
  "信箱": { "keys": ["信箱", "email", "電子郵件"], "value": "xiaoming@example.com" }
}
```

## 技術

- 純靜態：HTML + CSS + Vanilla JS，**零外部框架依賴**
- 捲動進場動畫採 `IntersectionObserver`
- 部署於 GitHub Pages

## 開發 / 本機預覽

直接用瀏覽器開 `index.html` 即可；或起一個簡單的本機伺服器：

```bash
python -m http.server 8000
# 開啟 http://localhost:8000
```

---

Made with ❤️ by [阿凱老師](https://www.smes.tyc.edu.tw/modules/school/index.php?department_id=2&zone_id=0&page_id=2&content_id=11&type=news&from_op=all_news#a5)　·　桃園市龍潭區石門國民小學

---

<!-- BEGIN:PROJECT_GUIDE -->
## 專案導覽

Playwright × Webwright — AI Agent 的 Web 技能雙引擎｜一頁讀懂兩大網頁自動化關鍵字 🐿️

- 專案定位：實用工具／自動化原型
- Repository：`cagoooo/PlayRight`
- 可見性：公開
- 主要技術：CSS
- 線上入口：<https://cagoooo.github.io/PlayRight/>

### 可以怎麼應用

- 解決特定工作流程中的重複操作或資訊整理需求
- 作為相近工具的功能原型與程式碼參考
- 串接新的資料來源、服務或介面後延伸到其他情境

這些是依目前專案定位整理的延伸方向，不代表所有情境都已內建完成；實作前請先確認現有功能與資料格式。

### 技術與專案結構

- `README.md`
- `apple-touch-icon.png`
- `index.html`
- `scripts`

檔案結構會隨版本演進；若本節與程式碼不一致，以目前預設分支的原始碼為準。

### 本機執行

這是可直接由瀏覽器載入的靜態網站。可用任一靜態檔案伺服器預覽，例如：
```bash
python -m http.server 8000
```
接著開啟 `http://localhost:8000`。請避免直接以 `file://` 測試需要模組、請求或 Service Worker 的功能。

### 給 AI Agent 的接手指南

1. 先閱讀本 README、`AGENTS.md`（若有）、套件腳本與部署設定。
2. 先從入口檔、設定檔與資料流確認真實行為，不要只依 repo 名稱推測。
3. 修改前檢查環境變數、外部服務、檔案格式與失敗處理。
4. 完成後執行既有檢查，並以最小可重現案例驗證主要流程。
5. 不要捏造尚未存在的功能；README 與實作有落差時，應同時更新文件。
6. 提交前只納入本次任務檔案，並記錄實際執行過的驗證。

### 安全與資料注意事項

- 不要提交 `.env`、服務帳號、API 金鑰、token、學生個資或正式環境匯出資料。
- 使用 Firebase、Supabase、Google API 或其他雲端服務時，請建立自己的測試專案並套用最小權限。
- 若要公開衍生作品，請先確認程式碼、圖片、音訊、字型與教材內容的授權。

### 貢獻與客製化

歡迎依教學現場、活動或工作流程需求進行 fork／客製化。建議在變更說明中交代使用情境、主要修改、測試方式，以及是否影響資料格式或部署設定。
<!-- END:PROJECT_GUIDE -->
