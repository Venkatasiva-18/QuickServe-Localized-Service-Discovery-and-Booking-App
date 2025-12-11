$json = @{
    name = 'John Customer'
    email = 'john.customer@example.com'
    password = 'pass1234'
    phone = '9999999999'
    doorNo = '99'
    addressLine = 'Main Street'
    city = 'Mumbai'
    state = 'Maharashtra'
    pincode = '400001'
    country = 'India'
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/customer/signup' -Method Post -ContentType 'application/json' -Body $json -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response:"
    Write-Host $response.Content
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
}
