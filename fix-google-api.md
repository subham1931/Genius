# Fix Google API Key Issue

## Problem
The conversation API is returning a 500 error because the Google API key is invalid or expired.

Error: `models/gemini-1.5-flash is not found for API version v1beta`

## Solution

### Step 1: Get a New Google API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy the new API key

### Step 2: Update Your .env File

Open your `.env` file and update the `GOOGLE_API_KEY`:

```env
GOOGLE_API_KEY=your_new_api_key_here
```

### Step 3: Test the API Key

Run this command to test if the API key works:

```bash
node test-google-api.js
```

### Step 4: Restart the Dev Server

After updating the `.env` file:

1. Stop the current dev server (Ctrl+C)
2. Restart it: `npm run dev`
3. Try the conversation feature again

## Alternative: Use a Different Model

If the issue persists, you can try using a different Gemini model. Edit `app/api/conversation/route.ts` and change line 124:

```typescript
// From:
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// To one of these:
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
// OR
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
```

## Verify It's Working

After fixing, you should see:
- ✅ No 500 errors in the browser console
- ✅ The conversation API responds successfully
- ✅ Messages appear in the chat interface
