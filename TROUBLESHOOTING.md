# 🔧 Troubleshooting Guide

## Common Issues and Solutions

---

## 🔴 Issue: "Google API Key not configured"

### Error Message:
```
Google API Key not configured
Status: 500
```

### Solution:
1. Check if `GOOGLE_API_KEY` exists in your `.env` file
2. Make sure there are no extra spaces or quotes
3. Restart your dev server after adding the key

### Example `.env`:
```env
GOOGLE_API_KEY=AIzaSyC...your_actual_key_here
```

---

## 🔴 Issue: "Model is loading, please try again in a moment"

### Error Message:
```
Model is loading, please try again in a moment
Status: 503
```

### Why This Happens:
Hugging Face models go to sleep after inactivity. First request wakes them up.

### Solution:
1. **Wait 20-30 seconds**
2. Try the request again
3. Subsequent requests will be fast (2-5 seconds)

### Prevention:
Implement a loading state in your UI:
```typescript
if (response.status === 503) {
  setLoading("Model is waking up, please wait...");
  // Retry after 30 seconds
}
```

---

## 🔴 Issue: "Rate limit exceeded"

### Error Message:
```
429 Too Many Requests
```

### Google Gemini Limits:
- **15 requests per minute**
- **1500 requests per day**

### Solutions:

#### Short-term:
1. Wait 1 minute before trying again
2. Reduce request frequency

#### Long-term:
1. Implement request queuing
2. Add rate limiting on your frontend
3. Cache responses for similar queries
4. Upgrade to paid tier if needed

### Example Rate Limiting:
```typescript
// Simple rate limiter
let requestCount = 0;
let resetTime = Date.now() + 60000;

if (Date.now() > resetTime) {
  requestCount = 0;
  resetTime = Date.now() + 60000;
}

if (requestCount >= 15) {
  return new NextResponse("Rate limit exceeded", { status: 429 });
}

requestCount++;
```

---

## 🔴 Issue: Images Not Displaying

### Symptoms:
- Image generation succeeds
- But images don't show in UI

### Solution:
Check if your image component supports base64 images:

```tsx
// ✅ Correct
<img src={image.url} alt="Generated" />

// ❌ Wrong (if expecting external URL)
<Image src={image.url} width={512} height={512} />
```

For Next.js Image component, you need to allow base64:
```tsx
<Image 
  src={image.url} 
  width={512} 
  height={512}
  unoptimized // Add this for base64
/>
```

---

## 🔴 Issue: "Unauthorized" Error

### Error Message:
```
Unauthorized
Status: 401
```

### Possible Causes:

1. **Not logged in with Clerk**
   - Solution: Make sure you're signed in

2. **Clerk keys not configured**
   - Check `.env` for:
     ```env
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
     CLERK_SECRET_KEY=sk_test_...
     ```

3. **Middleware blocking request**
   - Check `middleware.ts` configuration

---

## 🔴 Issue: Slow Image Generation (First Request)

### Symptoms:
- First image takes 20-30 seconds
- Subsequent images are fast

### Why This Happens:
Hugging Face models need to load into memory on first request.

### Solutions:

1. **Add Better Loading UI:**
```tsx
const [loadingMessage, setLoadingMessage] = useState("");

// On first request
setLoadingMessage("Waking up the AI model (20-30s)...");

// After first request
setLoadingMessage("Generating image...");
```

2. **Use Alternative Models:**
```typescript
// Faster but lower quality
const model = "runwayml/stable-diffusion-v1-5";

// Current (better quality, slower first load)
const model = "stabilityai/stable-diffusion-2-1";
```

3. **Pre-warm the Model:**
Make a dummy request on app startup to keep model warm.

---

## 🔴 Issue: "Internal Error" in API Routes

### Error Message:
```
Internal Error
Status: 500
```

### Debugging Steps:

1. **Check Server Logs:**
```bash
# Look for error details in terminal
[CONVERSATION_ERROR] ...
[CODE_ERROR] ...
[IMAGE_API_ERROR] ...
```

2. **Common Causes:**
   - Missing API keys
   - Invalid API keys
   - Network issues
   - Malformed requests

3. **Test API Keys:**
```bash
# Test Google Gemini
curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_KEY"

# Test Hugging Face
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://huggingface.co/api/whoami
```

---

## 🔴 Issue: TypeScript Errors

### Error:
```
Property 'text' does not exist on type 'GenerateContentResponse'
```

### Solution:
Make sure `@google/generative-ai` is installed:
```bash
npm install @google/generative-ai
```

Restart TypeScript server in VS Code:
- Press `Ctrl+Shift+P`
- Type "TypeScript: Restart TS Server"

---

## 🔴 Issue: Environment Variables Not Loading

### Symptoms:
- API keys are in `.env`
- But still getting "not configured" errors

### Solutions:

1. **Restart Dev Server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

2. **Check File Name:**
- Must be exactly `.env` (not `.env.local` or `.env.example`)

3. **Check File Location:**
- Must be in project root (same level as `package.json`)

4. **Check for Typos:**
```env
# ✅ Correct
GOOGLE_API_KEY=your_key

# ❌ Wrong
GOOGLE_API_KEY =your_key  # Extra space
GOOGLE_API_KEY="your_key" # Quotes (usually not needed)
```

---

## 🔴 Issue: CORS Errors

### Error:
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

### Why This Happens:
Usually not an issue with server-side API routes, but if you're calling APIs from client:

### Solution:
Always call APIs from server-side routes (API routes), not from client components.

```tsx
// ❌ Don't do this (client-side)
const response = await fetch("https://api-inference.huggingface.co/...");

// ✅ Do this (server-side API route)
const response = await fetch("/api/image", {
  method: "POST",
  body: JSON.stringify({ prompt })
});
```

---

## 🔴 Issue: Build Errors

### Error:
```
Module not found: Can't resolve 'bytez.js'
```

### Solution:
Old imports still exist. Remove them:

```bash
# Uninstall old package
npm uninstall bytez.js

# Clear cache
rm -rf .next
rm -rf node_modules
npm install

# Rebuild
npm run build
```

---

## 🔴 Issue: Hugging Face 401 Unauthorized

### Error:
```
401 Unauthorized from Hugging Face API
```

### Solutions:

1. **Check Token Permissions:**
   - Go to https://huggingface.co/settings/tokens
   - Make sure token has "Read" permission

2. **Check Token Format:**
```env
# ✅ Correct
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxx

# ❌ Wrong
HUGGINGFACE_API_KEY=Bearer hf_xxxxxxxxxxxxx
```

3. **Regenerate Token:**
   - Delete old token
   - Create new one
   - Update `.env`

---

## 🔴 Issue: Gemini API Quota Exceeded

### Error:
```
Quota exceeded for quota metric 'Generate Content API requests per day'
```

### Why This Happens:
You've hit the 1500 requests/day limit.

### Solutions:

1. **Wait Until Tomorrow:**
   - Quota resets daily

2. **Upgrade to Paid Tier:**
   - Very affordable ($0.35/1M tokens)
   - Much higher limits

3. **Implement Caching:**
```typescript
// Cache similar requests
const cache = new Map();
const cacheKey = JSON.stringify(messages);

if (cache.has(cacheKey)) {
  return NextResponse.json(cache.get(cacheKey));
}

// ... make API call ...

cache.set(cacheKey, response);
```

---

## 🆘 Still Having Issues?

### Debug Checklist:

- [ ] All API keys are in `.env`
- [ ] Dev server has been restarted
- [ ] No typos in environment variable names
- [ ] API keys are valid (test them separately)
- [ ] Clerk authentication is working
- [ ] Network connection is stable
- [ ] No firewall blocking API calls

### Get Help:

1. **Check Server Logs:**
   - Look at terminal output for detailed errors

2. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for errors in Console tab

3. **Test APIs Individually:**
   - Test each API endpoint separately
   - Narrow down the issue

4. **Check API Status:**
   - [Google Cloud Status](https://status.cloud.google.com/)
   - [Hugging Face Status](https://status.huggingface.co/)

---

## 📚 Additional Resources

- [Google Gemini Documentation](https://ai.google.dev/docs)
- [Hugging Face API Docs](https://huggingface.co/docs/api-inference/index)
- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Most issues can be solved by restarting the dev server and checking API keys! 🔄**
