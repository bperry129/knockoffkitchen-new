@echo off
echo Generating sitemap.xml...
echo.

cd %~dp0
node scripts/generate-sitemap.js

echo.
echo Sitemap generation complete!
echo The sitemap has been saved to public/sitemap.xml
echo.
pause
