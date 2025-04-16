@echo off
start "前端服务" cmd /k call .\fronted\start_frontend.bat
start "后端服务" cmd /k call .\backend\start_backend.bat