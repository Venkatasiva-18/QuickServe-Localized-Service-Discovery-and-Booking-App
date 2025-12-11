$json = @{
    name = 'John Customer Updated'
    email = 'john.customer@example.com'
    password = 'pass1234'
    phone = '9999999999'
    doorNo = '99'
    addressLine = 'Updated Main Street'
    city = 'Pune'
    state = 'Maharashtra'
    pincode = '400002'
    country = 'India'
    latitude = 18.5204
    longitude = 73.8567
} | ConvertTo-Json

Write-Host "Updating Customer ID: 8"
Write-Host "Request JSON:"
Write-Host $json
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/customer/8' -Method Put -ContentType 'application/json' -Body $json -UseBasicParsing
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
        Write-Host "Response:"
        Write-Host $content
    }
}
