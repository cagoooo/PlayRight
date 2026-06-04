# Playwright × Webwright — AI Agent 的 Web 技能雙引擎 🐿️

> 一頁讀懂 **Playwright** 與 **Webwright** —— 讓你的 AI Agent 看得懂、做得到、任務完成有回報！

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

Made with ❤️ by [阿凱老師](https://www.smes.tyc.edu.tw/modules/tadnews/page.php?ncsn=11&nsn=16#a5)　·　桃園市龍潭區石門國民小學
