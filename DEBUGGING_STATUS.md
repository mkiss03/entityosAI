# EntityOS AI Integration - Debugging Status

## Current Status: OpenAI Working ✅ | Supabase Needs Attention ⚠️

### What's Working
- **OpenAI Knowledge Graph Generation** ✅
  - Successfully generating valid graph data for brand names
  - Using GPT-4o-mini with enforced JSON output
  - Generating 12 nodes and 15 relationships for Tesla example
  - Proper validation of node types and link references
  - Fallback graph on API failure

### What Needs Attention
- **Supabase Integration** ⚠️
  - `.env` file may have placeholder credentials
  - Database save functionality cannot work without valid credentials
  - Authentication will not work without valid credentials

### Debugging Improvements Added

I've added comprehensive logging throughout the application to help track what's happening:

#### Console Logs Added
1. **Graph Generation Flow**
   - `[Dashboard] Starting graph generation for: <brand>`
   - `[Dashboard] Graph generated successfully: <data>`

2. **Database Save Flow**
   - `[Dashboard] User logged in, saving to Supabase...`
   - `[Dashboard] Supabase save successful: <data>`
   - `[Dashboard] Supabase save error: <error>`
   - `[Dashboard] User not logged in, skipping database save`

3. **Visualization Update Flow**
   - `[Dashboard] Updating visualization with new graph data`
   - `[Dashboard] New nodes: X New links: Y`
   - `[Dashboard] D3 simulation restarted with new data`

4. **Error Tracking**
   - `[Dashboard] CRITICAL ERROR during scan: <error>`
   - Full error stack traces

5. **Supabase Credential Validation**
   - Clear error banner on app load if credentials are invalid
   - Detects placeholder values in `.env`
   - Provides step-by-step fix instructions

### How to Use the New Debugging

1. **Open Browser Console** (F12 in Chrome/Firefox)
   - Look for `[Dashboard]` prefixed messages
   - Check for the Supabase configuration error banner

2. **Watch the Terminal UI**
   - Bottom of the dashboard shows real-time logs
   - Look for `[db]`, `[graph]`, `[error]`, `[warn]` tags

3. **Test the Scan Flow**
   - Click "Scan Now" button
   - Watch console logs appear in this order:
     1. `[Dashboard] Starting graph generation...`
     2. `Generated graph: Object` (from OpenAI)
     3. Either database save logs OR not logged in warning
     4. `[Dashboard] Updating visualization...`
     5. `[Dashboard] D3 simulation restarted...`
     6. Terminal shows: `[scan] done in ~3.5s`
     7. Terminal shows: `[graph] 12 nodes, 15 edges`

### Expected Console Output (Successful Scan)

```
[Dashboard] Starting graph generation for: Tesla
openai.js:132 Generated graph: {nodes: Array(12), links: Array(15)}
[Dashboard] Graph generated successfully: {nodes: Array(12), links: Array(15)}
[Dashboard] User logged in, saving to Supabase... <user-id>
[Dashboard] Supabase save successful: [{id: '...', ...}]
[Dashboard] Updating visualization with new graph data
[Dashboard] New nodes: 12 New links: 15
[Dashboard] D3 simulation restarted with new data
```

### What You're Currently Seeing

Based on the previous console output:
- ✅ OpenAI API call succeeds
- ✅ Valid graph data generated (12 nodes, 15 links)
- ❓ Missing subsequent logs about database save
- ❓ Missing logs about visualization update
- ❓ "Generated graph" appears twice (possible double render)

### Possible Causes

1. **Not Logged In**
   - If you're not logged in, database save is skipped
   - Graph visualization should still update
   - Console will show: `[Dashboard] User not logged in, skipping database save`

2. **Invalid Supabase Credentials**
   - `.env` has placeholder values
   - Database save will fail with error
   - Console will show Supabase configuration error banner on page load
   - Console will show: `[Dashboard] Supabase save error: ...`

3. **React StrictMode Double Render**
   - Development mode may call functions twice
   - This is normal for detecting side effects
   - Should not affect production build

### Next Steps to Investigate

1. **Check Browser Console**
   - Open F12 Developer Tools
   - Look for the new `[Dashboard]` log messages
   - Look for the Supabase configuration error banner
   - Screenshot and share the full console output

2. **Check .env File**
   ```bash
   cat .env
   ```
   - Verify VITE_SUPABASE_URL is not `https://your-project.supabase.co`
   - Verify VITE_SUPABASE_ANON_KEY is not `your-anon-key-here`
   - Verify VITE_OPENAI_API_KEY is filled (we know this works)

3. **Restart Dev Server** (if .env was changed)
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```
   - Vite doesn't hot-reload .env changes
   - Must restart server for .env changes to take effect

4. **Check Terminal UI** (bottom of dashboard page)
   - Should show scan progress messages
   - Look for `[db]`, `[graph]`, `[error]`, `[warn]` tags

5. **Check Graph Visualization**
   - Does the force-directed graph update with new nodes?
   - Look for Tesla + 11 other entities
   - Should see: Elon Musk, Automotive, Electric Vehicles, Energy Storage, etc.

### Required Environment Variables

Your `.env` file needs:

```env
# Supabase - Get from https://app.supabase.com/project/_/settings/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI - Get from https://platform.openai.com/api-keys
VITE_OPENAI_API_KEY=sk-proj-...
```

**Note:** All three keys are required for full functionality:
- OpenAI for graph generation (currently working)
- Supabase URL + Key for database + authentication

### Files Modified

- `src/pages/Dashboard.jsx` - Added detailed logging for scan flow
- `src/lib/supabase.js` - Added credential validation and helpful error messages

### Testing the Fix

After fixing .env and restarting the dev server:

1. Open browser console (F12)
2. Refresh the page
3. Verify NO Supabase error banner appears
4. Click "Scan Now"
5. Watch console logs - should see all 7 steps listed above
6. Watch graph visualization - should see new nodes appear and animate
7. Check terminal UI - should see `[scan] done` and `[graph] X nodes, Y edges`

---

**Generated:** 2026-01-15
**Branch:** claude/setup-entityos-monorepo-rKmmb
**Commit:** ae65ea2
