$json = @{
    name = 'John Plumber'
    email = 'plumber@example.com'
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

Write-Host "Request JSON:"
Write-Host $json
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/provider/signup' -Method Post -ContentType 'application/json' -Body $json -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response:"
    Write-Host $response.Content
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = [System.IO.StreamReader]::new($stream)
        $content = $reader.ReadToEnd()
        $reader.Close()
        Write-Host "Response Content:"
        Write-Host $content
    } else {
        Write-Host "Exception: $($_.Exception.Message)"
    }
}
