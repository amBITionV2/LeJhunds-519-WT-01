@echo off
echo Setting up Zerify Web3 features...
echo.

echo Installing dependencies...
npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo Error installing dependencies. Trying with --force...
    npm install --force
)

echo.
echo Creating .env file from template...
if not exist .env (
    copy env.example .env
    echo Please edit .env file and add your Web3.Storage token
) else (
    echo .env file already exists
)

echo.
echo Setup complete! Next steps:
echo 1. Edit .env file with your Web3.Storage token
echo 2. Run: npm run node (in one terminal)
echo 3. Run: npm run deploy (in another terminal)
echo 4. Run: npm run dev
echo.
pause
