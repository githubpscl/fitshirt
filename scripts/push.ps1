# Pusht alle lokalen Aenderungen auf GitHub.
# Vercel deployed danach automatisch.
#
# Nutzung im PowerShell:
#   cd "C:\Users\pasca\OneDrive\Dokumente\Sonstiges\Freestyle\FitShirt"
#   .\scripts\push.ps1

$ErrorActionPreference = "Stop"
Set-Location -Path (Split-Path -Path $PSScriptRoot -Parent)

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "FitShirt - Push Live" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# 1) Stale git-lock aus Cowork-Sandbox entfernen
if (Test-Path .git/index.lock) {
  Write-Host "[ok] alte .git/index.lock entfernt" -ForegroundColor Green
  Remove-Item -Force .git/index.lock
}

# 2) Status zeigen
Write-Host "Aenderungen:" -ForegroundColor Yellow
git status --short
Write-Host ""

# 3) Wenn nix zu pushen, raus
$pending = git status --porcelain
if (-not $pending) {
  $unpushed = git log origin/main..HEAD --oneline 2>$null
  if (-not $unpushed) {
    Write-Host "[i] Nichts zu committen, nichts zu pushen." -ForegroundColor Gray
    Pause
    exit 0
  }
}

# 4) Commit-Nachricht abfragen (mit Default)
$default = "Improve site: emails, rate-limit, SEO, consent, lazy routes, draft recovery"
$msg = Read-Host "Commit-Nachricht [Enter = Default]"
if ([string]::IsNullOrWhiteSpace($msg)) { $msg = $default }

# 5) Add + Commit (commit darf fehlschlagen, wenn schon committed)
git add -A
$LASTEXITCODE = 0
git commit -m $msg
if ($LASTEXITCODE -ne 0) {
  Write-Host "[i] Nichts neues zu committen - pushe nur unpushed commits." -ForegroundColor Gray
}

# 6) Push
Write-Host ""
Write-Host "Pushe nach origin/main..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "Fertig! Vercel deployed in 1-2 Minuten." -ForegroundColor Green
Write-Host "URL: https://fitshirt-roan.vercel.app" -ForegroundColor Green
Write-Host ""
Pause
