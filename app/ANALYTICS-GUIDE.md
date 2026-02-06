# How to Monitor DiRT Usage

## What's Being Tracked:

Every time someone accesses DiRT, the system logs:
- **inIframe: true/false** - Are they viewing through your WordPress embed?
- **referrer** - What site sent them (your site vs direct access)
- **timestamp** - When they accessed it

## Where to See the Data:

### Option 1: Vercel Runtime Logs (Free)
1. Go to your DiRT project in Vercel
2. Click "Deployments" tab
3. Click your latest deployment
4. Click "View Function Logs"
5. Look for `[DiRT Access]` and `[DiRT Password Success]` entries

**What to look for:**
- `inIframe: false` + `referrer: direct` = **Someone using stolen URL**
- `inIframe: true` + `referrer: llbmtb.com` = **Legitimate member**

### Option 2: Vercel Analytics (Pro - $20/mo)
1. Go to your project → Analytics tab
2. Click "Events" 
3. See custom events:
   - "Page View" with iframe status
   - "Password Success" entries
4. Filter by properties to see direct vs iframe usage

### Option 3: Enable Web Analytics (Free add-on with Pro)
1. Project Settings → Analytics
2. Toggle "Enable Web Analytics"
3. See real-time visitor data and referrers

## Red Flags to Watch For:

🚩 **Multiple "Password Success" with `inIframe: false`**
→ People are using the direct URL, not your iframe

🚩 **Traffic from unknown referrers**
→ URL might be shared on forums/social media

🚩 **Sudden spike in traffic**
→ Someone might have posted the URL publicly

🚩 **Many failed password attempts**
→ Someone trying to guess (though unlikely)

## What to Do If You See Suspicious Activity:

1. Change the password immediately (see PASSWORD-CHANGE-INSTRUCTIONS.md)
2. Update the password on your WordPress page
3. Consider changing it more frequently (weekly instead of monthly)

## Current Tracking:

✅ Page views (iframe vs direct)
✅ Password success (logged in vs stolen URL)
✅ Referrer tracking
✅ Failed password attempts
✅ Timestamp for all events
