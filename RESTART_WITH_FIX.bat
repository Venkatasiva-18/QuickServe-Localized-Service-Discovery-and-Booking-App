@echo off
echo ========================================
echo QuickServe - RESTART APPLICATION
echo Notification Fix Applied
echo ========================================
echo.

echo [1/3] Stopping any running processes...
echo Please manually stop backend and frontend if running (Ctrl+C in their terminals)
echo.
pause

echo.
echo [2/3] Starting Backend...
echo.
cd /d "%~dp0backend"
start "QuickServe Backend" cmd /k "mvnw.cmd spring-boot:run"

echo Waiting for backend to start (30 seconds)...
timeout /t 30 /nobreak

echo.
echo [3/3] Starting Frontend...
echo.
cd /d "%~dp0frontend"
start "QuickServe Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo ✅ APPLICATION RESTARTED!
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo 🔔 Notification System Fixed!
echo.
echo Test Steps:
echo 1. Login as customer
echo 2. Book a service
echo 3. Check provider's notification bell
echo.
echo Check NOTIFICATION_FIX_APPLIED.md for details
echo.
pause

