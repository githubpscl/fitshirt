Write-Host "FitShirt GitHub Login" -ForegroundColor Cyan
Write-Host ""
Write-Host "Du wirst gleich aufgefordert, einen Code in den Browser einzugeben."
Write-Host ""
& 'C:\Program Files\GitHub CLI\gh.exe' auth login --hostname github.com --git-protocol https --web
Write-Host ""
Write-Host "Login abgeschlossen. Du kannst dieses Fenster jetzt schliessen." -ForegroundColor Green
Read-Host "Druecke Enter zum Schliessen"
