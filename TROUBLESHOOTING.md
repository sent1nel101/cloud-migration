# Troubleshooting Guide

**Last Updated**: December 29, 2024
**Status**: All known issues fixed

---

## Common Issues & Solutions

### Issue: "Failed to generate roadmap"

**Symptoms**: Click button, loading appears, then error message

**Possible Causes**:
1. API key is incorrect or invalid
2. API quota exceeded
3. Network connectivity issue
4. JSON parsing error

**Solutions**:

**Step 1: Check API Key**
```bash
# Open .env.local and verify:
ANTHROPIC_API_KEY=sk-ant-v1-...

# Make sure:
- Key starts with sk-ant-v1-
- No extra spaces or quotes
- Full key is copied (not truncated)
```

**Step 2: Check Anthropic Console**
Visit: https://console.anthropic.com/
- Check usage and quota
- Verify API key is active
- Check for any error messages

**Step 3: Check Browser Console**
- Press F12 (or right-click → Inspect)
- Go to Console tab
- Look for error messages
- Screenshot errors if unclear

**Step 4: Restart Dev Server**
```bash
# Stop current server (Ctrl+C)
npm run dev
```

**Step 5: Try Different Input**
- Use shorter job title
- Use simpler text in goals
- Try 5 years experience instead of complex numbers

---

### Issue: No CSS Styles (Plain HTML Look)

**Symptoms**: App works but looks like plain HTML, no colors/styling

**Cause**: PostCSS Tailwind plugin misconfigured

**Solution**:
```javascript
// File: postcss.config.js
// Should have:
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

// NOT:
// "tailwindcss": {}  ← Wrong for Tailwind CSS v4
```

**If Already Fixed**:
- Restart dev server: `npm run dev`
- Clear browser cache: Ctrl+Shift+Delete
- Hard refresh: Ctrl+Shift+R

---

### Issue: Styles Load but Form Doesn't Submit

**Symptoms**: Form appears styled, but clicking button does nothing

**Possible Causes**:
1. JavaScript error in form handling
2. API endpoint not responding
3. Browser console errors

**Solutions**:

**Check Browser Console**:
1. Press F12
2. Click Console tab
3. Look for red error messages
4. Share any errors for debugging

**Check Network Tab**:
1. Press F12
2. Click Network tab
3. Submit form
4. Look for failed requests
5. Check /api/roadmap response

---

### Issue: Roadmap Takes Too Long (>10 seconds)

**Symptoms**: Button shows loading for extended time

**Expected**: 2-5 seconds is normal
**Long**: 5-10 seconds occasionally normal
**Very Long**: >10 seconds = problem

**Possible Causes**:
1. Slow internet connection
2. Claude API is slow (rare)
3. Server overload

**Solutions**:
- Check internet speed
- Try again (might be temporary)
- Check API status

---

### Issue: Roadmap Content Looks Generic

**Symptoms**: Roadmap doesn't mention specific skills you entered

**Cause**: Prompt might need refinement

**Solution**:
Edit: `app/api/roadmap/route.ts`

Find this section:
```typescript
User Profile:
- Current Role: ${input.currentRole}
- Years of Experience: ${input.yearsExperience}
- Top Skills: ${input.skills?.join(", ") || "Not specified"}
```

Make prompt more specific by adding:
```typescript
- Top Skills: ${input.skills?.join(", ") || "Not specified"} [LEVERAGE THESE IN YOUR RECOMMENDATIONS]
```

Then rebuild: `npm run build`

---

### Issue: Made-Up Courses/Certifications

**Symptoms**: Roadmap mentions courses that don't exist

**Cause**: Claude sometimes hallucinated

**Solution (Already Fixed)**:
The prompt now asks for real, verifiable resources. If issue persists:

Edit: `app/api/roadmap/route.ts`

Update prompt instruction:
```typescript
"Only recommend REAL, VERIFIABLE courses and certifications that actually exist.",
"Do NOT make up course names.",
"Use only well-known platforms: Coursera, Udacity, Google, AWS, etc.",
```

---

## Browser Console Errors

### Error: "JSON.parse: unexpected character"

**Cause**: Claude response isn't pure JSON

**Status**: Fixed in latest version
**If Still Occurs**: 
- Update code from repository
- Clear node_modules: `rm -rf node_modules && npm install`
- Rebuild: `npm run build`

### Error: "Cannot find module '@anthropic-ai/sdk'"

**Cause**: SDK not installed

**Fix**:
```bash
npm install @anthropic-ai/sdk
```

### Error: "ANTHROPIC_API_KEY is not defined"

**Cause**: .env.local not set up

**Fix**:
1. Create `.env.local` file in root directory
2. Add: `ANTHROPIC_API_KEY=sk-ant-v1-your-key-here`
3. Restart dev server: `npm run dev`

---

## Performance Issues

### Slow Load Time (>3 seconds)

**Possible Causes**:
1. Browser cache full
2. Computer low on resources
3. Network slow

**Solutions**:
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build

# Clear browser cache: Ctrl+Shift+Delete
```

### Slow API Response (>10 seconds)

**Possible Causes**:
1. Claude API overloaded
2. Network latency
3. Large response

**Solutions**:
- Try again (might be temporary)
- Check internet connection
- Contact Anthropic support if persistent

---

## Deployment Issues

### Vercel Deployment Fails

**Common Causes**:
1. Environment variables not set
2. API key invalid
3. Build error

**Fix**:

**Step 1**: Verify build locally
```bash
npm run build
```

**Step 2**: Check Vercel dashboard
- Settings → Environment Variables
- Add: `ANTHROPIC_API_KEY=your-key`

**Step 3**: Redeploy
- Click "Redeploy" in Vercel dashboard
- Or: `git push origin main`

### Vercel: 500 Error on Submit

**Cause**: API endpoint error

**Debug**:
1. Check Vercel logs: Deployments → Logs
2. Look for error messages
3. Check API key is set in Vercel

---

## Testing Checklist

When troubleshooting, verify:

- [ ] Dev server runs: `npm run dev`
- [ ] Page loads at localhost:3000
- [ ] Form displays with styles
- [ ] All form fields visible
- [ ] Skills add/remove buttons work
- [ ] Submit button clickable
- [ ] API key in .env.local
- [ ] Browser console has no red errors
- [ ] Network tab shows /api/roadmap request
- [ ] Response is 200 OK

---

## Getting Help

### Check These First
1. **Browser Console** (F12 → Console)
   - Copy any error messages

2. **Network Tab** (F12 → Network)
   - Click /api/roadmap request
   - Check response body
   - Check status code

3. **Anthropic Dashboard**
   - https://console.anthropic.com/
   - Check usage, errors, quota

### If Still Stuck
1. Share error message (from browser console)
2. Share network response details
3. Describe what you entered in form
4. Describe what happens (exact error)

---

## Quick Restart Steps

If something seems broken:

```bash
# 1. Stop dev server (Ctrl+C)

# 2. Clean cache
rm -rf .next
rm -rf node_modules/.cache

# 3. Clear browser cache
# Ctrl+Shift+Delete in browser

# 4. Restart dev server
npm run dev

# 5. Hard refresh browser
# Ctrl+Shift+R (or Cmd+Shift+R on Mac)
```

---

## Known Fixes Applied

✅ **Fixed**: JSON parsing error
- Now handles markdown code blocks
- Better prompt structure
- Response cleaning

✅ **Fixed**: Missing CSS styles  
- PostCSS config uses @tailwindcss/postcss
- Tailwind CSS v4 compatible

✅ **Improved**: Error handling
- Better error messages
- Console logging for debugging
- API error detection

---

## Still Need Help?

1. Check `BUG_FIXES.md` for recent fixes
2. Check `TEST_CLAUDE_INTEGRATION.md` for testing guide
3. Run through Testing Checklist above
4. Check browser console for errors
5. Verify API key in .env.local

---

**Last Updated**: December 29, 2024
**Build Status**: ✅ Passing
**Known Issues**: None

Try testing again with `npm run dev`!
