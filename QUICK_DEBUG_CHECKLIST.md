# Quick Debug Checklist - EntityOS AI

## Problem: OpenAI works but unsure if database save and graph update work

## Step-by-Step Debug Process

### Step 1: Check Browser Console
```bash
# Open your browser to http://localhost:3000/dashboard
# Press F12 to open Developer Tools
# Click on "Console" tab
```

**Look for:**
- ⚠️ Big error banner about Supabase credentials
- If present → Go to Step 2
- If not present → Go to Step 3

---

### Step 2: Fix .env File (if Supabase error appears)

```bash
# Open .env file
cat .env
```

**Check if these are placeholder values:**
- `VITE_SUPABASE_URL=https://your-project.supabase.co` ← PLACEHOLDER
- `VITE_SUPABASE_ANON_KEY=your-anon-key-here` ← PLACEHOLDER

**If placeholders found:**
1. Go to https://app.supabase.com/project/_/settings/api
2. Copy your real Project URL → Replace VITE_SUPABASE_URL
3. Copy your real anon/public key → Replace VITE_SUPABASE_ANON_KEY
4. Save .env file
5. **IMPORTANT: Restart dev server**
   ```bash
   # Press Ctrl+C in terminal to stop
   npm run dev
   # Wait for server to start
   ```
6. Go back to Step 1 to verify error is gone

---

### Step 3: Test the Full Scan Flow

```bash
# With browser console open (F12)
# Click "Scan Now" button on dashboard
```

**Watch for these console messages IN ORDER:**

1. ✅ `[Dashboard] Starting graph generation for: Tesla`
2. ✅ `Generated graph: Object` ← from OpenAI
3. ✅ `[Dashboard] Graph generated successfully`
4. **Then ONE of these:**
   - ✅ `[Dashboard] User logged in, saving to Supabase...`
   - ⚠️ `[Dashboard] User not logged in, skipping database save`
5. **If logged in, then ONE of these:**
   - ✅ `[Dashboard] Supabase save successful`
   - ❌ `[Dashboard] Supabase save error: ...`
6. ✅ `[Dashboard] Updating visualization with new graph data`
7. ✅ `[Dashboard] New nodes: 12 New links: 15`
8. ✅ `[Dashboard] D3 simulation restarted with new data`

---

### Step 4: Check Visual Results

**Terminal UI (bottom of dashboard):**
- Should show: `[scan] done in ~3.5s`
- Should show: `[graph] 12 nodes, 15 edges`

**Graph Visualization (center panel):**
- Should update with new nodes
- Look for: Tesla, Elon Musk, Automotive, Electric Vehicles, etc.
- Should animate and settle into force-directed layout

**RAG Panel (right side):**
- Should show: "✓ Scan complete. Generated 12 entities and 15 relationships."

---

### Step 5: Verify Authentication (if getting "not logged in" warning)

```bash
# Check if you're logged in
# Look at top right of dashboard - is there a user indicator?
```

**If not logged in:**
1. Click "Start Free Scan" on home page
2. Should redirect to `/login`
3. Click "Sign in with Google"
4. Complete OAuth flow
5. Should redirect back to `/dashboard`
6. Try scan again

**If login fails:**
- Check Supabase OAuth settings
- Verify Google OAuth is configured
- Check redirect URLs are set to `http://localhost:3000/dashboard`

---

## Common Issues & Solutions

### Issue: "Generated graph: Object" appears twice
- **Cause:** React StrictMode in development
- **Solution:** This is normal, ignore it
- **Impact:** None - will not happen in production

### Issue: No console logs appear at all
- **Cause:** Console filter may be active
- **Solution:** Check console filter is set to "All levels"
- **Solution:** Refresh page and try again

### Issue: Supabase save fails with "Invalid JWT"
- **Cause:** Wrong anon key in .env
- **Solution:** Double-check you copied the "anon/public" key, not the service role key
- **Solution:** Restart dev server after fixing .env

### Issue: Graph doesn't visually update
- **Cause:** D3 simulation may be stopped
- **Solution:** Check console for "[Dashboard] D3 simulation restarted"
- **Solution:** Try clicking "Reset View" button above graph

### Issue: Can't login with Google
- **Cause:** OAuth not configured in Supabase
- **Solution:** Follow Google OAuth setup guide (we did this earlier)
- **Solution:** Verify redirect URLs in Supabase match your dev server

---

## Success Criteria

✅ **All working correctly when:**
1. No Supabase error banner on page load
2. All 8 console log messages appear in order
3. Terminal UI shows "scan done" and "12 nodes, 15 edges"
4. Graph visualization updates with new entities
5. RAG panel shows completion message
6. Either "Supabase save successful" OR "not logged in" (both are OK)

✅ **OpenAI working, Supabase optional:**
- Graph generation works without login/database
- Just won't save scans for later viewing
- All visualization features work

---

## Still Having Issues?

Share this information:
1. Screenshot of browser console after clicking "Scan Now"
2. Screenshot of Terminal UI (bottom panel)
3. Output of: `cat .env | grep VITE` (will show if vars are set)
4. Are you logged in? (check top right of dashboard)

---

**Files to check:**
- `.env` - Environment variables
- `DEBUGGING_STATUS.md` - Detailed technical explanation
- Browser Console (F12) - Real-time debugging

**Branch:** claude/setup-entityos-monorepo-rKmmb
**Latest commit:** ae65ea2 - "Add comprehensive debugging"
