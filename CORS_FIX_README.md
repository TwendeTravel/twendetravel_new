# Firebase Storage CORS Fix Instructions

## The Problem
You're seeing CORS errors because Firebase Storage isn't configured to allow requests from your development server (localhost:8080).

## Quick Fixes

### Option 1: Apply CORS Configuration (Recommended)
1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
2. Run: `gsutil cors set cors.json gs://twendetravel-b4821.appspot.com`

### Option 2: Use Firebase CLI
1. Make sure Firebase CLI is installed: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Deploy storage rules: `firebase deploy --only storage`

### Option 3: Temporary Workaround
If CORS issues persist, we can implement a server-side upload endpoint.

## What I've Updated
- Enhanced error handling in ProfileSettings.tsx
- Added better logging for debugging
- Updated storage.rules for better security
- Created cors.json configuration file

## Testing
1. After applying CORS config, restart your development server
2. Try uploading a profile image
3. Check browser console for detailed error messages

The enhanced error handling will now show you exactly what's failing.
