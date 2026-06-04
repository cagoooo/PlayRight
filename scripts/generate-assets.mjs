#!/usr/bin/env node
/* =========================================================================
   PlayRight 視覺資產一次性生成器
   - favicon.ico (16/32/48 合成) / favicon.svg / apple-touch-icon.png
   - assets/icon-192/512.png + 192/512-maskable.png
   - og-preview.png（1200×630 社群分享圖）
   技術：@napi-rs/canvas + 本機微軟正黑體（產物為點陣 PNG，部署後不依賴字型 → 中文零方框）
   ========================================================================= */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import pngToIco from "png-to-ico";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ASSETS = resolve(ROOT, "assets");
if (!existsSync(ASSETS)) mkdirSync(ASSETS, { recursive: true });

/* ---- 註冊本機中文字型 ---- */
const JH_BOLD = "C:/Windows/Fonts/msjhbd.ttc";
const JH = "C:/Windows/Fonts/msjh.ttc";
if (existsSync(JH_BOLD)) GlobalFonts.registerFromPath(JH_BOLD, "JhengHeiBold");
if (existsSync(JH)) GlobalFonts.registerFromPath(JH, "JhengHei");
const FB = "JhengHeiBold";   // 主要字型
const FR = "JhengHei";

/* ---- 主題色 ---- */
const GREEN = "#22c55e", GREEN_D = "#16a34a";
const BLUE = "#3b82f6", BLUE_D = "#2563eb";
const GOLD = "#fbbf24";
const NIGHT1 = "#161a2e", NIGHT2 = "#1f2547", NIGHT3 = "#2a1d4a";

/* ---- 小工具 ---- */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* =========================================================================
   1) 圖示繪製：漸層圓角方塊 + 粗體「×」（Playwright × Webwright 的核心符號）
   ========================================================================= */
function drawIcon(size, { maskable = false } = {}) {
  const c = createCanvas(size, size);
  const ctx = c.getContext("2d");

  // 背景漸層（綠 → 藍 斜向）
  const g = ctx.createLinearGradient(0, 0, size, size);
  g.addColorStop(0, GREEN);
  g.addColorStop(1, BLUE_D);

  if (maskable) {
    // maskable：填滿整個畫布，主視覺縮進 safe zone
    ctx.fillStyle = NIGHT2;
    ctx.fillRect(0, 0, size, size);
    const pad = size * 0.10;
    ctx.fillStyle = g;
    roundRect(ctx, pad, pad, size - pad * 2, size - pad * 2, size * 0.18);
    ctx.fill();
  } else {
    ctx.fillStyle = g;
    roundRect(ctx, 0, 0, size, size, size * 0.225);
    ctx.fill();
  }

  // 中央「×」：金色暈光底 + 白色主體
  const span = size * (maskable ? 0.30 : 0.34);
  const cx = size / 2, cy = size / 2;
  const stroke = size * (maskable ? 0.11 : 0.125);
  ctx.lineCap = "round";

  // 金色暈光
  ctx.strokeStyle = GOLD;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = stroke * 1.45;
  drawX(ctx, cx, cy, span);
  // 白色主體
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = stroke;
  drawX(ctx, cx, cy, span);

  return c.toBuffer("image/png");
}
function drawX(ctx, cx, cy, span) {
  ctx.beginPath();
  ctx.moveTo(cx - span, cy - span);
  ctx.lineTo(cx + span, cy + span);
  ctx.moveTo(cx + span, cy - span);
  ctx.lineTo(cx - span, cy + span);
  ctx.stroke();
}

/* =========================================================================
   2) OG 社群分享圖 1200×630
   ========================================================================= */
function drawOG() {
  const W = 1200, H = 630;
  const c = createCanvas(W, H);
  const ctx = c.getContext("2d");

  // 夜空漸層背景
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, NIGHT3);
  bg.addColorStop(0.5, NIGHT2);
  bg.addColorStop(1, NIGHT1);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 裝飾光球（綠 / 藍）
  softOrb(ctx, 120, 90, 360, GREEN, 0.28);
  softOrb(ctx, W - 90, H - 60, 420, BLUE, 0.30);
  softOrb(ctx, W - 230, 120, 220, GOLD, 0.16);

  const PAD = 84;

  // Eyebrow
  ctx.font = `28px ${FR}`;
  ctx.fillStyle = "#cdd6ff";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("AI Agent 的 Web 技能雙引擎", PAD, 132);

  // 主標題（多色：綠 Playwright × 金 Webwright 藍）
  const titleY = 252;
  ctx.font = `92px ${FB}`;
  let x = PAD;
  x = drawGradWord(ctx, "Playwright", x, titleY, GREEN, "#7ef0a3");
  ctx.fillStyle = GOLD;
  const times = "  ×  ";
  ctx.fillText(times, x, titleY);
  x += ctx.measureText(times).width;
  drawGradWord(ctx, "Webwright", x, titleY, "#9cc2ff", BLUE_D);

  // 標語
  ctx.font = `34px ${FB}`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText("讓你的 AI Agent 看得懂、做得到、任務完成有回報！", PAD, 332);

  // 兩顆引擎膠囊
  pill(ctx, PAD, 386, "控制瀏覽器的自動化工具", GREEN);
  const p1w = pillWidth(ctx, "控制瀏覽器的自動化工具");
  pill(ctx, PAD + p1w + 20, 386, "AI 驅動的任務代理框架", BLUE);

  // 底部網址膠囊
  ctx.font = `26px ${FB}`;
  const urlText = "cagoooo.github.io/PlayRight  →";
  const uw = ctx.measureText(urlText).width + 56;
  const ug = ctx.createLinearGradient(PAD, 0, PAD + uw, 0);
  ug.addColorStop(0, GREEN_D);
  ug.addColorStop(1, BLUE_D);
  ctx.fillStyle = ug;
  roundRect(ctx, PAD, H - 96, uw, 56, 28);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.fillText(urlText, PAD + 28, H - 58);

  // 署名（右下）
  ctx.font = `24px ${FR}`;
  ctx.fillStyle = "#aeb6d4";
  ctx.textAlign = "right";
  ctx.fillText("桃園市龍潭區石門國民小學 · 阿凱老師", W - PAD, H - 56);
  ctx.textAlign = "left";

  return c.toBuffer("image/png");
}

function drawGradWord(ctx, text, x, y, c1, c2) {
  const w = ctx.measureText(text).width;
  const g = ctx.createLinearGradient(x, y - 70, x + w, y);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  ctx.fillStyle = g;
  ctx.fillText(text, x, y);
  return x + w;
}

function softOrb(ctx, x, y, r, color, alpha) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, hexA(color, alpha));
  g.addColorStop(1, hexA(color, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}

function pillWidth(ctx, label) {
  ctx.font = `26px ${FB}`;
  return ctx.measureText(label).width + 30 + 28 + 16; // dot + text + paddings
}
function pill(ctx, x, y, label, dotColor) {
  ctx.font = `26px ${FB}`;
  const tw = ctx.measureText(label).width;
  const w = 30 + tw + 28 + 16;
  const h = 52;
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1.5;
  roundRect(ctx, x, y, w, h, h / 2);
  ctx.fill();
  ctx.stroke();
  // dot
  ctx.fillStyle = dotColor;
  ctx.beginPath();
  ctx.arc(x + 28, y + h / 2, 9, 0, Math.PI * 2);
  ctx.fill();
  // text
  ctx.fillStyle = "#eef2ff";
  ctx.fillText(label, x + 48, y + h / 2 + 9);
}

/* =========================================================================
   3) favicon.svg（向量手寫，高 DPI 最清晰）
   ========================================================================= */
const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Playwright × Webwright">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${GREEN}"/>
      <stop offset="1" stop-color="${BLUE_D}"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#g)"/>
  <g stroke-linecap="round" fill="none">
    <g stroke="${GOLD}" stroke-width="16" opacity="0.55">
      <line x1="35" y1="35" x2="65" y2="65"/>
      <line x1="65" y1="35" x2="35" y2="65"/>
    </g>
    <g stroke="#ffffff" stroke-width="11">
      <line x1="35" y1="35" x2="65" y2="65"/>
      <line x1="65" y1="35" x2="35" y2="65"/>
    </g>
  </g>
</svg>
`;

/* =========================================================================
   執行
   ========================================================================= */
async function main() {
  // OG
  writeFileSync(resolve(ROOT, "og-preview.png"), drawOG());
  console.log("✔ og-preview.png (1200×630)");

  // App icons
  writeFileSync(resolve(ASSETS, "icon-192.png"), drawIcon(192));
  writeFileSync(resolve(ASSETS, "icon-512.png"), drawIcon(512));
  writeFileSync(resolve(ASSETS, "icon-192-maskable.png"), drawIcon(192, { maskable: true }));
  writeFileSync(resolve(ASSETS, "icon-512-maskable.png"), drawIcon(512, { maskable: true }));
  console.log("✔ assets/icon-192/512(.maskable).png");

  // apple-touch-icon（180，建議不透明、留白由系統處理）
  writeFileSync(resolve(ROOT, "apple-touch-icon.png"), drawIcon(180));
  console.log("✔ apple-touch-icon.png (180)");

  // favicon.svg
  writeFileSync(resolve(ROOT, "favicon.svg"), FAVICON_SVG);
  console.log("✔ favicon.svg");

  // favicon.ico（16/32/48 合成）
  const ico = await pngToIco([drawIcon(16), drawIcon(32), drawIcon(48)]);
  writeFileSync(resolve(ROOT, "favicon.ico"), ico);
  console.log("✔ favicon.ico (16/32/48)");

  console.log("\n🎉 全部資產生成完成");
}
main().catch((e) => { console.error(e); process.exit(1); });
