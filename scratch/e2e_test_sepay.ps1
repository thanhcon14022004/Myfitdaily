$createBody = @{
    planId = "Premium"
    billingCycle = "Monthly"
    amount = 49000
} | ConvertTo-Json

Write-Host "Creating payment..."
$createRes = Invoke-RestMethod -Uri "http://localhost:5240/api/subscription/create-payment" -Method POST -ContentType "application/json" -Body $createBody
Write-Host "Create Response:" ($createRes | ConvertTo-Json -Depth 4)

$orderCode = $createRes.data.orderCode
Write-Host "`nOrderCode created: $orderCode"

Write-Host "`nChecking payment before transfer:"
$check1 = Invoke-RestMethod -Uri "http://localhost:5240/api/subscription/check-payment/$orderCode"
Write-Host "Check 1 Response:" ($check1 | ConvertTo-Json -Depth 4)

Write-Host "`nSimulating SePay Webhook transfer with matching order code and amount..."
$webhookBody = @{
    id = 1234567
    gateway = "ACB"
    transactionDate = "2026-09-23 00:30:00"
    accountNumber = "27655931"
    content = "Thanh toan don hang $orderCode cua MyFitDaily"
    transferType = "in"
    transferAmount = 49000
} | ConvertTo-Json

$webhookRes = Invoke-RestMethod -Uri "http://localhost:5240/api/subscription/sepay-webhook" -Method POST -ContentType "application/json" -Body $webhookBody
Write-Host "Webhook Response:" ($webhookRes | ConvertTo-Json)

Write-Host "`nChecking payment after transfer:"
$check2 = Invoke-RestMethod -Uri "http://localhost:5240/api/subscription/check-payment/$orderCode"
Write-Host "Check 2 Response:" ($check2 | ConvertTo-Json -Depth 4)
