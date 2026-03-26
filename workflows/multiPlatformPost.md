# Workflow: Multi-Platform Post

## Purpose
Post branded content to both Facebook and LinkedIn in a single automated run.

---

## Steps

### Step 1 — Prepare Platform-Specific Captions
Generate separate captions per platform for better native performance.

- Facebook: use `/prompts/facebookCaption.txt` — conversational, short, hashtag-friendly
- LinkedIn: use `/prompts/linkedinCaption.txt` — hook-driven, thought-leadership format

### Step 2 — Generate Visuals with Remotion
Render platform-optimised assets for each destination.

| Platform  | Recommended Size | Remotion Template     |
|-----------|------------------|-----------------------|
| Facebook  | 1200 × 630       | `fb-landscape`        |
| LinkedIn  | 1200 × 628       | `li-landscape`        |
| Both      | 1080 × 1080      | `square-card`         |

```bash
# Facebook asset
npx remotion render src/index.ts FBLandscape out/fb-post.jpg --props='{"caption":"..."}'

# LinkedIn asset
npx remotion render src/index.ts LILandscape out/li-post.jpg --props='{"caption":"..."}'
```

Upload rendered files to CDN → get public `imageUrl` per platform.

### Step 3 — Post to All Platforms

**Option A: Single payload to all platforms**
```bash
node meta/postRunner.js all '{"imageUrl":"https://...","caption":"Shared caption"}'
```

**Option B: Platform-specific payloads (recommended)**
```javascript
const { run } = require('./meta/postRunner');

await run('facebook', { imageUrl: fbImageUrl, caption: fbCaption });
await run('linkedin', { imageUrl: liImageUrl, caption: liCaption });
```

### Step 4 — Review Logs
Both results will appear in `logs/posts.json` with individual platform entries.

---

## Dependencies
- `meta/postRunner.js`
- `meta/postToFacebook.js`
- `linkedin/postToLinkedIn.js`
- `utils/logger.js`
- Remotion project (for visual generation)
- `.env` → `PAGE_ID`, `ACCESS_TOKEN`, `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_PERSON_URN`

## Notes
- LinkedIn is scaffolded — wire up `LINKEDIN_ACCESS_TOKEN` to activate it
- Platform-specific captions consistently outperform shared copy — use Option B when possible
