@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Installing, this takes about a minute the first time...
  call npm install
)
echo Starting Vecta Studio. Your browser will open by itself.
call npm run dev
pause
