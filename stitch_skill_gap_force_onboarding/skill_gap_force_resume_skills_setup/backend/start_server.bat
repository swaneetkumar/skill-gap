@echo off
echo ============================================================
echo   Skill Gap Force -- Resume Skill Extractor Backend
echo ============================================================
echo.
echo Installing / verifying dependencies...
pip install -r requirements.txt
echo.
echo Starting Flask server on http://localhost:5000 ...
echo (Press Ctrl+C to stop)
echo.
python app.py
pause
