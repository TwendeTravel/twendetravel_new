@echo off
echo Applying CORS configuration to Firebase Storage...
echo.
echo Make sure you have Firebase CLI installed and are logged in.
echo Run: npm install -g firebase-tools
echo Then: firebase login
echo.
echo To apply CORS configuration, run:
echo gsutil cors set cors.json gs://twendetravel-b4821.appspot.com
echo.
echo If you don't have gsutil, install Google Cloud SDK from:
echo https://cloud.google.com/sdk/docs/install
echo.
pause
