[System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }
$assetTypes = Invoke-RestMethod -Uri "https://localhost:7154/api/AssetTypes" -Method Get
foreach ($target in $assetTypes) {
    Write-Host "Updating $($target.id) - $($target.name)"
    
    $body = @{
        id                = $target.id
        name              = $target.name
        description       = $target.description
        isCustom          = $target.isCustom
        requiresIpAddress = $target.requiresIpAddress
        fields            = $target.fields
    } | ConvertTo-Json -Depth 10

    try {
        $response = Invoke-RestMethod -Uri "https://localhost:7154/api/AssetTypes/$($target.id)" -Method Put -Headers @{"Content-Type" = "application/json" } -Body $body
        Write-Host "SUCCESS: Updated"
    }
    catch {
        Write-Host "ERROR: $( (New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())).ReadToEnd() )"
    }
}
