@echo off
cd /d .\backend
python -m uvicorn app.main:app --reload