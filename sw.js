/* =========================================================================
   Playwright × Webwright — Service Worker
   策略：HTML network-first（永遠拿最新頁面）、靜態資源 cache-first + 背景更新、
        version.json 永遠取網路最新。
   更新模式：prompt-to-refresh（install 不 skipWaiting，等使用者在通知列點才套用）。
   每次部署：改 BUILD_VERSION（或跑 scripts/bump-version.ps1），sw.js byte 必變 →
            瀏覽器才會偵測為新版 → install → 進 waiting → 頁面跳「重新整理載入」。
   ========================================================================= */
const BUILD_VERSION = "2026.06.04-1";
const CACHE = "playright-" + BUILD_VERSION;
const PRECACHE = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/main.js",
  "./profile.json",
  "./favicon.svg",
  "./apple-touch-icon.png",
  "./manifest.webmanifest",
  "./og-preview.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png"
];

self.addEventListener("install", (e) => {
  // 關鍵：不自動 skipWaiting → 保留 waiting 狀態供通知列提示
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.allSettled(PRECACHE.map((u) => c.add(u).catch(() => {})))
    )
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((k) => k.startsWith("playright-") && k !== CACHE).map((k) => caches.delete(k))
    );
    await self.clients.claim();
    const clients = await self.clients.matchAll({ type: "window" });
    clients.forEach((c) => c.postMessage({ type: "SW_ACTIVATED", version: BUILD_VERSION }));
  })());
});

self.addEventListener("message", (e) => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  let url;
  try { url = new URL(req.url); } catch { return; }
  if (url.origin !== self.location.origin) return;   // 跨域（Google Fonts 等）不攔

  // version.json：永遠取網路最新
  if (url.pathname.endsWith("version.json")) {
    e.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  // HTML / 導覽：network-first（確保拿到新版頁面）
  if (req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html")) {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((r) => r || caches.match("./index.html")))
    );
    return;
  }

  // 其他資源：cache-first + 背景更新
  e.respondWith(
    caches.match(req).then((cached) => {
      const net = fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
