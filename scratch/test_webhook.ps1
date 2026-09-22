$body = @{
    id = 999999
    gateway = "ACB"
    transactionDate = "2026-09-23 00:20:00"
    accountNumber = "27655931"
    content = "MFD734008 thanh toan goi VIP"
    transferType = "in"
    transferAmount = 49000
} | ConvertTo-Json

Write-Host "Sending payload:" $body
$resp = Invoke-RestMethod -Uri "http://localhost:5240/api/subscription/sepay-webhook" -Method POST -ContentType "application/json" -Body $body
$resp | ConvertTo-Json
