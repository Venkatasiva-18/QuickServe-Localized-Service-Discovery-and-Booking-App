$json = @{
    name = 'John Plumber'
    email = 'john@plumbing.com'
    password = 'password123'
    phone = '9876543210'
    doorNo = '42'
    addressLine = 'Main St'
    city = 'Mumbai'
    state = 'Maharashtra'
    pincode = 400001
    country = 'India'
    serviceType = 'Plumbing'
    price = 500
} | ConvertTo-Json

try {
    $result = Invoke-WebRequest -Uri 'http://localhost:8080/api/provider/signup' -Method Post -ContentType 'application/json' -Body $json -UseBasicParsing
    Write-Host "Status: $($result.StatusCode)"
    Write-Host $result.Content
} catch {
    Write-Host "Error: $($_.Exception.Response.StatusCode.Value)"
    Write-Host $_.Exception.Message
}
