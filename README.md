# DiRT - Dialed RAD Tool

A production-ready Next.js application for mountain bike frame and component calculations.

## Features

- ✅ Server-side calculations (proprietary formulas hidden from client)
- ✅ Clean, modern UI
- ✅ Build name customization
- ✅ Copy results to clipboard
- ✅ Heavy Hands Index with smart display logic
- ✅ Responsive design
- ✅ Production-ready for Vercel deployment

## Deployment to Vercel

### Step 1: Upload to GitHub

1. Go to github.com and log in
2. Click the "+" icon in the top right → "New repository"
3. Name it: `dirt-calculator`
4. Leave it Public (or Private if you prefer)
5. Click "Create repository"

6. On the next page, look for "uploading an existing file"
7. Drag and drop ALL the files from this `dirt-nextjs` folder:
   - package.json
   - next.config.js
   - app/ folder
   - (all files and folders)

8. Scroll down and click "Commit changes"

### Step 2: Deploy to Vercel

1. Go to vercel.com and log in
2. Click "Add New" → "Project"
3. Click "Import" next to your `dirt-calculator` repository
4. Vercel will auto-detect it's a Next.js app
5. Click "Deploy" (don't change any settings)
6. Wait 2-3 minutes while it builds
7. You'll get a live URL like `dirt-calculator.vercel.app`

### Step 3: Test It!

Visit your URL and test the calculator. All calculations happen server-side, so your proprietary formulas are secure!

### Step 4 (Optional): Custom Domain

In Vercel dashboard:
1. Go to your project → Settings → Domains
2. Add your custom domain (e.g., `calculator.yoursite.com`)
3. Follow DNS instructions
4. Done!

## Updating the App

To make changes:
1. Edit files locally
2. Go to your GitHub repository
3. Upload the changed files (will replace old ones)
4. Vercel automatically re-deploys!

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Server-side API routes
- No database needed (stateless calculations)

## Security

- All RAD/RAAD calculations happen server-side
- Client never sees the proprietary formulas
- API route `/api/calculate` is the only entry point
- Formulas are hidden in server code

---

Built with ❤️ for mountain bikers
