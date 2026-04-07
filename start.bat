@echo off
chcp 65001 >nul
title Ancient Building System Launcher
color 0A
echo ==================================================
echo   Ancient Building Visualization System Launcher
echo ==================================================
echo.

set "GAME_DIR=%~dp0game\fuzhou-ancient-house-restorer-main\Game"
set "FRONT_DIR=%~dp0ancient_buildings"

echo Checking paths...
if not exist "%GAME_DIR%\manage.py" (
    echo Error: Game backend path not found.
    echo Please ensure start.bat is in the root folder.
    pause
    exit /b
)
if not exist "%FRONT_DIR%\package.json" (
    echo Error: Frontend path not found.
    echo Please ensure start.bat is in the root folder.
    pause
    exit /b
)

echo [1/3] Starting Game Backend (Django)...
start "GameBackend" cmd /k "chcp 65001 >nul && cd /d %GAME_DIR% && python manage.py runserver 8000"

echo.
echo [2/3] Starting Frontend (Vue/Vite)...
start "Frontend" cmd /k "chcp 65001 >nul && cd /d %FRONT_DIR% && npm run dev"

echo.
echo [3/3] Waiting for services to start...
timeout /t 8 /nobreak >nul

echo.
echo [Done] Opening browser...
echo Note: Please keep the black command windows open!
echo Browser will be opened by Vite once.

echo.
echo ==================================================
echo All services started. Close black windows to stop.
echo If you see "command not found", please install Python/Node.js
echo ==================================================
pause
