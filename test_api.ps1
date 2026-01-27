$base = "https://localhost:7154/api"

# Trust self-signed certs
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}

Write-Host "Testing GET /Assets..."
try {
    $assets = Invoke-RestMethod -Uri "$base/Assets" -Method Get
    Write-Host "Success! Found $($assets.Count) assets."
} catch {
    Write-Host "GET /Assets Failed: $_"
}

Write-Host "`nTesting POST /IPAddresses..."
$body = @{
    name = "Test IP from Script"
    type = "ip_address"
    status = "active"
    location = "Script Location"
    ipAddress = "10.0.0.99"
    subnet = "255.255.255.0"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$base/IPAddresses" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Success! Created IP Address with ID: $($response.id)"
} catch {
    Write-Host "POST /IPAddresses Failed: $_"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response Body: $($reader.ReadToEnd())"
    }
}
