try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/provider' -Method Get -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response:"
    Write-Host $response.Content
} catch {
    Write-Host "Error Code: $($_.Exception.Response.StatusCode.Value)"
    Write-Host "Error: $($_.Exception.Message)"
}
