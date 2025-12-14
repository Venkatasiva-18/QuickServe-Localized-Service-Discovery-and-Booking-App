$uri = "http://localhost:8080/api/init/demo-data"
$response = Invoke-WebRequest -Uri $uri -Method POST -ContentType "application/json" -UseBasicParsing
Write-Output $response.StatusCode
Write-Output $response.Content
