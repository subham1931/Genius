# 🔑 Free API Keys Setup Guide

This guide will help you get **completely FREE** API keys for all features of the AI Platform.

---

## 📋 Required API Keys

### 1. **Google Gemini API** (Conversation & Code Generation)
**Cost:** ✅ **100% FREE**
- **Free Tier:** 15 requests/minute, 1 million tokens/minute, 1500 requests/day
- **Get Key:** [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

**Steps:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Click "Create API Key in new project" (or select existing project)
4. Copy the API key
5. Add to `.env`: `GOOGLE_API_KEY=your_key_here`

---

### 2. **Hugging Face API** (Image Generation)
**Cost:** ✅ **FREE Tier Available**
- **Free Tier:** Unlimited requests (with rate limits)
- **Get Key:** [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

**Steps:**
1. Create account at [Hugging Face](https://huggingface.co/join)
2. Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
3. Click "New token"
4. Name it (e.g., "AI Platform")
5. Select "Read" role
6. Copy the token
7. Add to `.env`: `HUGGINGFACE_API_KEY=your_token_here`

**Note:** First request might take 20-30 seconds as the model loads. Subsequent requests are faster.

---

### 3. **Replicate API** (Music/Audio Generation)
**Cost:** ✅ **Free Credits Available**
- **Free Tier:** $0.01 in free credits (enough for testing)
- **Get Key:** [https://replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)

**Steps:**
1. Create account at [Replicate](https://replicate.com)
2. Go to [Account > API Tokens](https://replicate.com/account/api-tokens)
3. Copy your default token (or create new one)
4. Add to `.env`: `REPLICATE_API_TOKEN=your_token_here`

---

### 4. **Clerk Authentication** (User Management)
**Cost:** ✅ **FREE up to 10,000 users**
- **Get Keys:** [https://dashboard.clerk.com](https://dashboard.clerk.com)

**Steps:**
1. Create account at [Clerk](https://clerk.com)
2. Create new application
3. Copy the keys from the dashboard
4. Add to `.env`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

---

## 🚀 Quick Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your API keys in `.env`

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

---

## 💡 Cost Comparison

| Feature | Old (OpenAI/Bytez) | New (Free APIs) | Savings |
|---------|-------------------|-----------------|---------|
| Conversation | $0.03/1K tokens | **FREE** | 100% |
| Code Generation | $0.03/1K tokens | **FREE** | 100% |
| Image Generation | $0.02/image | **FREE** | 100% |
| Music Generation | $0.05/generation | **FREE** (credits) | ~100% |

---

## ⚠️ Important Notes

### Google Gemini Limits:
- **Rate Limit:** 15 requests/minute
- **Daily Limit:** 1500 requests/day
- **Token Limit:** 1 million tokens/minute

### Hugging Face:
- First request may take 20-30 seconds (model loading)
- Cached models respond in 2-5 seconds
- Rate limits apply (usually generous for free tier)

### Replicate:
- Free credits are limited
- Consider upgrading for production use
- Pay-as-you-go pricing is very affordable

---

## 🔄 Migration from Old APIs

If you were using OpenAI or Bytez before:

1. **Remove old packages:**
   ```bash
   npm uninstall openai bytez.js
   ```

2. **Remove old env variables:**
   - Delete `OPENAI_API_KEY`
   - Delete `BYTEZ_API_KEY`

3. **Add new env variables** (see above)

4. **Restart dev server:**
   ```bash
   npm run dev
   ```

---

## 🆘 Troubleshooting

### "Model is loading" error (Hugging Face):
- **Solution:** Wait 20-30 seconds and try again
- **Reason:** Model needs to load on first request

### "Rate limit exceeded" (Google Gemini):
- **Solution:** Wait 1 minute or implement request queuing
- **Reason:** Free tier has 15 requests/minute limit

### "Unauthorized" error:
- **Solution:** Check if API key is correctly set in `.env`
- **Reason:** Invalid or missing API key

---

## 📚 Additional Resources

- [Google Gemini Documentation](https://ai.google.dev/docs)
- [Hugging Face Inference API](https://huggingface.co/docs/api-inference/index)
- [Replicate Documentation](https://replicate.com/docs)
- [Clerk Documentation](https://clerk.com/docs)

---

**Enjoy your FREE AI Platform! 🎉**
