$json = @{
    name = 'Jane Electrician'
    email = 'jane@electrical.com'
    password = 'password456'
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
    $result = Invoke-WebRequest -Uri 'http://localhost:8080/api/provider/signup' -Method Post -ContentType 'application/json' -Body $json -UseBasicParsing
    Write-Host "Status: $($result.StatusCode)"
    Write-Host "Response:"
    Write-Host $result.Content
} catch {
    $response = $_.Exception.Response
    Write-Host "Status Code: $($response.StatusCode.Value)"
    Write-Host "Status Description: $($response.StatusDescription)"
    
    try {
        $reader = [System.IO.StreamReader]::new($response.GetResponseStream())
        $content = $reader.ReadToEnd()
        $reader.Close()
        Write-Host "Response Content:"
        Write-Host $content
    } catch {
        Write-Host "Error reading response: $($_.Exception.Message)"
    }
}
