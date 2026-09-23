$txs = Invoke-RestMethod -Uri "http://localhost:5240/api/subscription/plans"
Write-Host "Plans status: OK"
