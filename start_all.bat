@echo off
chcp 65001 > nul
start "前端服务" cmd /k "chcp 65001 & call .\fronted\start_frontend.bat"
start "后端服务" cmd /k "chcp 65001 & call .\backend\start_backend.bat"