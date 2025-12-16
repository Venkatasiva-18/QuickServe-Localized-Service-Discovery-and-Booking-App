@echo off
setlocal

:: Get the current directory
set "PROJECT_DIR=%~dp0"

echo.
echo ========================================
echo   Service Spot Application Starter
echo ========================================
echo.
echo Project Directory: %PROJECT_DIR%
echo.

echo [1] Starting Backend (Port 8080)...
echo.
start "Backend - Service Spot" cmd /k "cd /d "%PROJECT_DIR%backend" && mvnw spring-boot:run"

echo [2] Waiting for Backend to start (30 seconds)...
timeout /t 30 /nobreak

echo.
echo [3] Starting Frontend (Port 5173)...
echo.
start "Frontend - Service Spot" cmd /k "cd /d "%PROJECT_DIR%frontend" && npm run dev"

echo.
echo ========================================
echo   Application Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Once frontend loads, navigate to:
echo   1. Login as Customer (or sign up)
echo   2. Click "Book Service"
echo   3. Services will auto-load from backend
echo.
echo Demo credentials:
echo   Admin:
echo     Email: admin@servicespot.com
echo     Password: admin123
echo.
echo ========================================
echo   Both terminals will remain open.
echo   Close this window when done.
echo ========================================
echo.
pause
