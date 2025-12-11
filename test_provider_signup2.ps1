$json = @{
    name = 'Jane Electrician'
    email = 'jane.electrical@example.com'
    password = 'secure456'
    phone = '9988776655'
    doorNo = '100'
    addressLine = 'Side Street'
    city = 'Delhi'
    state = 'Delhi'
    pincode = 110001
    country = 'India'
    serviceType = 'Electrical'
    price = 750
} | ConvertTo-Json

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
        Write-Host "Response:"
        Write-Host $content
    }
}
