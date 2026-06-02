# Pusht die Made-to-Measure-Erweiterung auf GitHub und triggert Vercel-Auto-Deploy.
# Doppelklick oder rechtsklick -> "Mit PowerShell ausfuehren"

$ErrorActionPreference = "Stop"
Set-Location -Path (Split-Path -Path $PSScriptRoot -Parent)

Write-Host "FitShirt - MTM-Erweiterung pushen" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Stale git-lock entfernen (Cowork-Sandbox konnte das auf OneDrive nicht)
if (Test-Path .git/index.lock) {
  Remove-Item -Force .git/index.lock
  Write-Host "[ok] alte index.lock entfernt" -ForegroundColor Green
}

Write-Host ""
Write-Host "Status der lokalen Aenderungen:" -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "Commit und Push starten..." -ForegroundColor Yellow
git add -A
git commit -m "Add Made-to-Measure as premium production option (129EUR) alongside Smart Match (65EUR)"
git push origin main

Write-Host ""
Write-Host "Fertig! Vercel deployed in 1-2 Minuten automatisch." -ForegroundColor Green
Write-Host "URL: https://fitshirt-roan.vercel.app" -ForegroundColor Green
Write-Host ""
Pause
