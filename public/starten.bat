@echo off
:: Datenimport-Simulation — Windows Starter
:: Doppelklick startet einen lokalen Webserver und öffnet die App im Browser.

echo ==================================
echo   Datenimport-Simulation
echo ==================================
echo.

cd /d "%~dp0"
set PORT=8080

:: Python pruefen (py Launcher oder python3 oder python)
where py >nul 2>&1
if %errorlevel%==0 (
  echo Starte Server auf http://localhost:%PORT% ...
  start /b py -m http.server %PORT% --bind 127.0.0.1
  timeout /t 1 /nobreak >nul
  start http://localhost:%PORT%
  echo App geoeffnet. Dieses Fenster offen lassen.
  echo Zum Beenden: Fenster schliessen oder Ctrl+C druecken.
  pause >nul
  goto :eof
)

where python >nul 2>&1
if %errorlevel%==0 (
  echo Starte Server auf http://localhost:%PORT% ...
  start /b python -m http.server %PORT% --bind 127.0.0.1
  timeout /t 1 /nobreak >nul
  start http://localhost:%PORT%
  echo App geoeffnet. Dieses Fenster offen lassen.
  pause >nul
  goto :eof
)

:: Node.js / npx als Fallback
where npx >nul 2>&1
if %errorlevel%==0 (
  echo Starte Server mit npx serve ...
  start /b npx serve . --listen %PORT%
  timeout /t 2 /nobreak >nul
  start http://localhost:%PORT%
  pause >nul
  goto :eof
)

echo FEHLER: Python oder Node.js nicht gefunden.
echo Bitte installieren Sie Python 3 von https://python.org
pause
