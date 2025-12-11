$json = @{
    name = 'Jane Electrician Updated'
    email = 'jane.electrical@example.com'
    password = 'secure456'
    phone = '9988776655'
    doorNo = '101'
    addressLine = 'New Side Street'
    city = 'Delhi'
    state = 'Delhi'
    pincode = 110002
    country = 'India'
    serviceType = 'Electrical & Solar'
    price = 850
    latitude = 28.6139
    longitude = 77.2090
} | ConvertTo-Json

Write-Host "Updating Provider ID: 1"
Write-Host "Request JSON:"
Write-Host $json
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/provider/1' -Method Put -ContentType 'application/json' -Body $json -UseBasicParsing
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
