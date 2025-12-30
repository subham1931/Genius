# Deployment Guide for Vercel

Since you have already pushed your code to GitHub, the recommended way to deploy is using the Vercel Dashboard integration. This sets up automatic deployments whenever you push to the `main` branch.

## Option 1: Vercel Dashboard (Recommended)

1.  **Log in to Vercel**: Go to [vercel.com](https://vercel.com) and log in (continue with GitHub is easiest).
2.  **Add New Project**:
    *   Click "Add New..." -> "Project".
    *   Select "Import" next to your `Genius` repository (Importing from GitHub).
3.  **Configure Project**:
    *   **Framework Preset**: Next.js (Should be detected automatically).
    *   **Root Directory**: `./` (Default).
    *   **Environment Variables**: You **MUST** add all the variables from your local `.env` file here.
        *   Expand "Environment Variables".
        *   Copy each key and value pairs from your `.env` file.

### Required Environment Variables

Copy these exactly as they are in your local `.env` file:

| Key | Description |
| :--- | :--- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Auth Public Key |
| `CLERK_SECRET_KEY` | Clerk Auth Secret Key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/dashboard` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/dashboard` |
| `GOOGLE_API_KEY` | Your Gemini AI Key |
| `HUGGINGFACE_API_KEY` | Your HuggingFace Key |
| `REPLICATE_API_TOKEN` | Your Replicate Key |
| `DATABASE_URL` | MongoDB Connection String |
| `NEXT_PUBLIC_APP_URL` | The URL of your deployed app (e.g., https://your-project.vercel.app) |

*Note: For `NEXT_PUBLIC_APP_URL`, initially you can use the domain Vercel assigns you, or just put `http://localhost:3000` temporarily, but updating it to the real domain is best for webhooks.*

4.  **Deploy**: Click "Deploy".
5.  **Wait**: Vercel will build your project. If successful, you will get a confetti screen!

---

## Important Checks

### MongoDB Network Access
Ensure your MongoDB Atlas cluster allows connections from Vercel.
1.  Go to [MongoDB Atlas](https://cloud.mongodb.com).
2.  Go to "Network Access" in the sidebar.
3.  Ensure there is an entry for `0.0.0.0/0` (Allow Access from Anywhere). Vercel uses dynamic IPs, so this is usually required unless you use Vercel Secure Compute (Enterprise).

### Clerk Production Keys
If you are deploying for production usage:
1.  Go to your Clerk Dashboard.
2.  Switch to "Production" instance (or create one).
3.  Get the "Live" keys (Publishable Key starting with `pk_live_...` and Secret Key starting with `sk_live_...`).
4.  Update the Environment Variables in Vercel to use these Live keys instead of the Test keys (`pk_test_...`).

## Option 2: Vercel CLI

If you prefer the command line:
1.  Run `npx vercel login`
2.  Run `npx vercel`
3.  Follow the prompts to link the project.
