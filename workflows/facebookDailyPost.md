# Workflow: Facebook Daily Post

## Purpose
Automate the daily posting of a branded image + caption to the Mediatwist Facebook page.

---

## Steps

### Step 1 — Generate Caption
Use the prompt template in `/prompts/facebookCaption.txt`.
- Fill in `{{TOPIC}}` (today's post topic) and `{{AUDIENCE}}` (target persona)
- Pass to Claude API, OpenAI, or write manually
- Output: a caption string ready for posting

### Step 2 — Generate Visual with Remotion
Use Remotion to render a branded image or short video clip for the post.
- Input: caption text, brand colors, template name
- Template options: `quote-card`, `product-highlight`, `stat-callout`, `promo-banner`
- Output: rendered `.mp4` or `.png` file
- Upload rendered file to a public CDN (e.g. Cloudflare Images, S3, Cloudinary)
- Output: a public `imageUrl`

```bash
# Example Remotion render command
npx remotion render src/index.ts QuoteCard out/post.mp4 --props='{"caption":"Your text","template":"quote-card"}'
```

### Step 3 — Post to Facebook
Call the post runner with `platform = 'facebook'` and your payload.

```bash
node meta/postRunner.js facebook '{"imageUrl":"https://cdn.mediatwist.com/post.jpg","caption":"Your caption here"}'
```

Or programmatically:
```javascript
const { run } = require('./meta/postRunner');
await run('facebook', { imageUrl, caption });
```

### Step 4 — Review Log
Check `logs/posts.json` for the result entry.
- `success: true` — post is live ✅
- `success: false` — check the error and retry

---

## Dependencies
- `meta/postRunner.js`
- `meta/postToFacebook.js`
- `utils/logger.js`
- `prompts/facebookCaption.txt`
- Remotion project (for visual generation)
- `.env` → `PAGE_ID`, `ACCESS_TOKEN`

## Scheduling
Run daily via cron:
```bash
# Post every day at 9:00 AM
0 9 * * * node /path/to/meta/postRunner.js facebook '{"imageUrl":"...","caption":"..."}'
```

Or use the built-in scheduler skill to automate this from Claude.
