<#
  bump-version.ps1 — 一鍵升版（純靜態 PWA）
  同步更新四處，並保證 sw.js 的 byte 改變 → 瀏覽器偵測到新版 → 跳「重新整理載入」通知：
    1) version.json          : version 欄位
    2) sw.js                 : const BUILD_VERSION = "..."
    3) index.html            : var APP_VERSION = "..."
    4) index.html            : og-preview.png?v=...（OG 圖快取破壞，強制 FB/LINE 重抓）
  版本格式：yyyy.MM.dd-<當日序號>（自動 +1），UTF-8 無 BOM 寫回。

  用法：  powershell -ExecutionPolicy Bypass -File scripts\bump-version.ps1 -Notes "這次改了什麼"
  之後：  git add -A; git commit -m "..."; git push
#>
param([string]$Notes = "內容更新")
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$enc  = New-Object System.Text.UTF8Encoding($false)   # 無 BOM
$today = Get-Date -Format "yyyy.MM.dd"

# 依 version.json 推算當日序號
$vp = Join-Path $root "version.json"
$seq = 1
if (Test-Path $vp) {
  $old = (Get-Content $vp -Raw | ConvertFrom-Json).version
  if ($old -match "^$([regex]::Escape($today))-(\d+)$") { $seq = [int]$Matches[1] + 1 }
}
$ver = "$today-$seq"

# 1) version.json
[System.IO.File]::WriteAllText($vp, ([ordered]@{ version = $ver; notes = $Notes } | ConvertTo-Json), $enc)

# 2) sw.js  3) + 4) index.html
$targets = @(
  @{ file = "sw.js";      pattern = 'const BUILD_VERSION = "[^"]*";'; replace = "const BUILD_VERSION = `"$ver`";" },
  @{ file = "index.html"; pattern = 'var APP_VERSION = "[^"]*";';     replace = "var APP_VERSION = `"$ver`";" },
  @{ file = "index.html"; pattern = 'og-preview\.png\?v=[^"]*';       replace = "og-preview.png?v=$ver" }
)
foreach ($t in $targets) {
  $p = Join-Path $root $t.file
  $text = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
  $text = [regex]::Replace($text, $t.pattern, $t.replace)
  [System.IO.File]::WriteAllText($p, $text, $enc)
}

Write-Host "bumped -> $ver"
Write-Host "next: git add -A; git commit -m 'chore: bump to $ver'; git push origin main"
