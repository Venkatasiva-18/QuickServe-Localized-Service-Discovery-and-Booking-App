$baseUrl = "http://localhost:8080"

Write-Host "Testing Search Functionalities..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

Write-Host "`n1. Testing Provider Search with all parameters..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/search?service=electrician&area=Jubilee%20Hills&city=Hyderabad" -Method Get -ErrorAction Stop
    Write-Host "✓ Provider search (service, area, city) - Status: $($response.StatusCode)" -ForegroundColor Green
    $data = $response.Content | ConvertFrom-Json
    Write-Host "  Result count: $($data.Count) providers found" -ForegroundColor Gray
} catch {
    Write-Host "✗ Provider search failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2. Testing Provider Search by City only..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/search/city?city=Hyderabad" -Method Get -ErrorAction Stop
    Write-Host "✓ City search - Status: $($response.StatusCode)" -ForegroundColor Green
    $data = $response.Content | ConvertFrom-Json
    Write-Host "  Result count: $($data.Count) providers found" -ForegroundColor Gray
} catch {
    Write-Host "✗ City search failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. Testing Provider Search by Service Type..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/search/service?serviceType=electrician" -Method Get -ErrorAction Stop
    Write-Host "✓ Service type search - Status: $($response.StatusCode)" -ForegroundColor Green
    $data = $response.Content | ConvertFrom-Json
    Write-Host "  Result count: $($data.Count) providers found" -ForegroundColor Gray
} catch {
    Write-Host "✗ Service type search failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n4. Testing Service Search..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/services/search?keyword=plumbing&city=Hyderabad" -Method Get -ErrorAction Stop
    Write-Host "✓ Service search - Status: $($response.StatusCode)" -ForegroundColor Green
    $data = $response.Content | ConvertFrom-Json
    Write-Host "  Result count: $($data.Count) services found" -ForegroundColor Gray
} catch {
    Write-Host "✗ Service search failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n5. Testing Article Search..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/articles/search?keyword=tips" -Method Get -ErrorAction Stop
    Write-Host "✓ Article search - Status: $($response.StatusCode)" -ForegroundColor Green
    $data = $response.Content | ConvertFrom-Json
    Write-Host "  Result count: $($data.Count) articles found" -ForegroundColor Gray
} catch {
    Write-Host "✗ Article search failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n6. Testing All Providers endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/provider" -Method Get -ErrorAction Stop
    Write-Host "✓ All providers - Status: $($response.StatusCode)" -ForegroundColor Green
    $data = $response.Content | ConvertFrom-Json
    Write-Host "  Total providers: $($data.Count)" -ForegroundColor Gray
} catch {
    Write-Host "✗ All providers failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=================================" -ForegroundColor Cyan
Write-Host "Search functionality tests complete!" -ForegroundColor Cyan
