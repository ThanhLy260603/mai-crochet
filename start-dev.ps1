# Khởi động cả server và client cho development
Write-Host "Đang khởi động server và client..." -ForegroundColor Green

# Khởi động server trong background
Write-Host "Khởi động server (port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev"

# Đợi một chút để server khởi động
Start-Sleep -Seconds 3

# Khởi động client
Write-Host "Khởi động client (port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm start"

Write-Host "Server: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Client: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Nhấn Enter để thoát..."
Read-Host 