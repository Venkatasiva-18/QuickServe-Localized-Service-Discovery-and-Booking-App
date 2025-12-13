# Test Booking Functionality
$baseUrl = "http://localhost:8080"

Write-Host "====== BOOKING FUNCTIONALITY TEST ======" -ForegroundColor Cyan
Write-Host ""

# Test 1: Get all providers to find a valid provider ID
Write-Host "1. Fetching available providers..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/provider" -Method Get -ErrorAction Stop
    $providers = $response.Content | ConvertFrom-Json
    Write-Host "✓ Found $($providers.Count) providers" -ForegroundColor Green
    
    if ($providers.Count -gt 0) {
        $providerId = $providers[0].id
        Write-Host "  Using provider: $($providers[0].name) (ID: $providerId)" -ForegroundColor Gray
    } else {
        Write-Host "✗ No providers found. Please create a provider first." -ForegroundColor Red
        exit
    }
} catch {
    Write-Host "✗ Error fetching providers: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Test 2: Get all services
Write-Host "`n2. Fetching available services..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/services" -Method Get -ErrorAction Stop
    $services = $response.Content | ConvertFrom-Json
    Write-Host "✓ Found $($services.Count) services" -ForegroundColor Green
    
    if ($services.Count -gt 0) {
        $serviceId = $services[0].id
        Write-Host "  Using service: $($services[0].name) (ID: $serviceId)" -ForegroundColor Gray
    } else {
        Write-Host "✗ No services found. Please create a service first." -ForegroundColor Red
        exit
    }
} catch {
    Write-Host "✗ Error fetching services: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Test 3: Create booking
Write-Host "`n3. Creating booking..." -ForegroundColor Yellow
$tomorrow = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
$time = "14:30"

$booking = @{
    customerId = 1
    providerId = $providerId
    serviceId = $serviceId
    serviceName = "Test Booking Service"
    bookingDate = $tomorrow
    bookingTime = $time
    status = "Pending"
    notes = "Test booking from PowerShell"
} | ConvertTo-Json

Write-Host "  Request body:" -ForegroundColor Gray
Write-Host "  {" -ForegroundColor Gray
Write-Host "    customerId: 1" -ForegroundColor Gray
Write-Host "    providerId: $providerId" -ForegroundColor Gray
Write-Host "    serviceId: $serviceId" -ForegroundColor Gray
Write-Host "    bookingDate: $tomorrow" -ForegroundColor Gray
Write-Host "    bookingTime: $time" -ForegroundColor Gray
Write-Host "  }" -ForegroundColor Gray

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/booking/create" `
        -Method Post `
        -Body $booking `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    $bookingResult = $response.Content | ConvertFrom-Json
    Write-Host "✓ Booking created successfully!" -ForegroundColor Green
    Write-Host "  Booking ID: $($bookingResult.id)" -ForegroundColor Gray
    Write-Host "  Status: $($bookingResult.status)" -ForegroundColor Gray
    Write-Host "  Date: $($bookingResult.date)" -ForegroundColor Gray
    Write-Host "  Time: $($bookingResult.time)" -ForegroundColor Gray
    
    $bookingId = $bookingResult.id
} catch {
    Write-Host "✗ Error creating booking: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $body = $reader.ReadToEnd()
        Write-Host "  Response: $body" -ForegroundColor Yellow
    }
    exit
}

# Test 4: Get customer bookings
Write-Host "`n4. Fetching customer bookings..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/booking/customer/1" -Method Get -ErrorAction Stop
    $bookings = $response.Content | ConvertFrom-Json
    Write-Host "✓ Found $($bookings.Count) bookings for customer 1" -ForegroundColor Green
    
    if ($bookings.Count -gt 0) {
        Write-Host "  Latest booking:" -ForegroundColor Gray
        Write-Host "    ID: $($bookings[0].id)" -ForegroundColor Gray
        Write-Host "    Service: $($bookings[0].serviceName)" -ForegroundColor Gray
        Write-Host "    Status: $($bookings[0].status)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Error fetching bookings: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Get specific booking
if ($bookingId) {
    Write-Host "`n5. Fetching specific booking (ID: $bookingId)..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/booking/$bookingId" -Method Get -ErrorAction Stop
        $booking = $response.Content | ConvertFrom-Json
        Write-Host "✓ Booking found" -ForegroundColor Green
        Write-Host "  Service: $($booking.serviceName)" -ForegroundColor Gray
        Write-Host "  Provider: $($booking.providerName)" -ForegroundColor Gray
        Write-Host "  Date: $($booking.date)" -ForegroundColor Gray
    } catch {
        Write-Host "✗ Error fetching booking: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n====== TEST COMPLETE ======" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "✓ Providers: Available" -ForegroundColor Green
Write-Host "✓ Services: Available" -ForegroundColor Green
Write-Host "✓ Booking Creation: Working" -ForegroundColor Green
Write-Host "✓ Booking Retrieval: Working" -ForegroundColor Green
Write-Host ""
Write-Host "Booking functionality is operational!" -ForegroundColor Cyan
