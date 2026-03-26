# Workflow: Multi-Platform Posting

## Purpose
Publish content across multiple platforms (Facebook, LinkedIn) using a unified posting system.
This workflow is designed to be reusable, scalable, and compatible with Claude-based automation.

---

## Inputs

| Field       | Type             | Description                              |
|-------------|------------------|------------------------------------------|
| `imageUrl`  | string           | Publicly accessible image or video URL   |
| `caption`   | string           | Post copy (can be platform-specific)     |
| `platforms` | array of strings | e.g. `["facebook", "linkedin"]`          |

### Example Payload
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "caption": "This is a test post",
  "platforms": ["facebook", "linkedin"]
}
```

---

## Output
- Posts successfully published to each selected platform
- Structured log entry written to `/logs/posts.json` for each platform

---

## Workflow Steps

### Step 1 — Validate Inputs
Before posting, verify the payload is complete and well-formed.

```javascript
function validatePayload({ imageUrl, caption, platforms }) {
  if (!imageUrl || typeof imageUrl !== 'string')
    throw new Error('imageUrl is required and must be a string');
  if (!caption || typeof caption !== 'string')
    throw new Error('caption is required and must be a string');
  if (!Array.isArray(platforms) || platforms.length === 0)
    throw new Error('platforms must be a non-empty array');

  const supported = ['facebook', 'linkedin'];
  const unsupported = platforms.filter(p => !supported.includes(p));
  if (unsupported.length > 0)
    throw new Error(`Unsupported platform(s): ${unsupported.join(', ')}`);
}
```

### Step 2 — (Optional) Generate Visuals with Remotion
Render platform-optimised branded assets before posting.

| Platform | Recommended Size | Remotion Template |
|----------|------------------|-------------------|
| Facebook | 1200 × 630       | `fb-landscape`    |
| LinkedIn | 1200 × 628       | `li-landscape`    |
| Both     | 1080 × 1080      | `square-card`     |

```bash
# Facebook asset
npx remotion render src/index.ts FBLandscape out/fb-post.jpg \
  --props='{"caption":"This is a test post","platform":"facebook"}'

# LinkedIn asset
npx remotion render src/index.ts LILandscape out/li-post.jpg \
  --props='{"caption":"This is a test post","platform":"linkedin"}'
```

Upload rendered files to a public CDN (e.g. Cloudflare Images, S3) and use the returned URL as `imageUrl`.

### Step 3 — (Optional) Generate Platform-Specific Captions
For best engagement, tailor captions per platform using the prompt templates.

- Facebook → `/prompts/facebookCaption.txt` — conversational, short, hashtag-friendly
- LinkedIn → `/prompts/linkedinCaption.txt` — hook-driven, thought-leadership format

Fill in `{{TOPIC}}` and `{{AUDIENCE}}`, pass to Claude or an LLM, use the output as `caption`.

### Step 4 — Post to Each Platform
Call `postRunner.js` with `platform = "all"` or loop for platform-specific captions.

```javascript
const { run } = require('./meta/postRunner');

// Option A: single shared payload to all platforms
const results = await run('all', { imageUrl, caption });

// Option B: platform-specific captions (recommended for better engagement)
for (const platform of platforms) {
  const platformCaption = captions[platform] || caption;
  await run(platform, { imageUrl, caption: platformCaption });
}
```

### Step 5 — Handle Results
Check each platform's response and surface any failures.

```javascript
for (const [platform, result] of Object.entries(results)) {
  if (result.success) {
    console.log(`✅ [${platform}] Posted successfully`);
  } else {
    console.error(`❌ [${platform}] Failed:`, result.result.error);
    // TODO: add retry logic or alerting
  }
}
```

### Step 6 — Verify Log
Each run appends an entry to `/logs/posts.json`:

```json
{
  "timestamp": "2026-03-25T10:00:00.000Z",
  "platform": "facebook",
  "caption": "This is a test post",
  "imageUrl": "https://example.com/image.jpg",
  "success": true
}
```

---

## Full Example Script

```javascript
require('dotenv').config();
const { run } = require('./meta/postRunner');

async function multiPlatformPost({ imageUrl, caption, platforms }) {
  // Step 1: Validate
  if (!imageUrl || !caption || !platforms?.length) {
    throw new Error('Missing required fields: imageUrl, caption, platforms');
  }

  const results = {};

  // Step 4: Post to each platform
  for (const platform of platforms) {
    results[platform] = await run(platform, { imageUrl, caption });
  }

  // Step 5: Report
  for (const [platform, result] of Object.entries(results)) {
    console.log(`[${platform}]`, result.success ? '✅ Success' : `❌ Failed: ${result.result?.error}`);
  }

  return results;
}

// Run directly
multiPlatformPost({
  imageUrl: 'https://example.com/image.jpg',
  caption: 'This is a test post',
  platforms: ['facebook', 'linkedin'],
});
```

### CLI Usage
```bash
node meta/postRunner.js all '{"imageUrl":"https://example.com/image.jpg","caption":"This is a test post"}'
```

---

## Dependencies
- `meta/postRunner.js` — universal runner
- `meta/postToFacebook.js` — Facebook posting
- `linkedin/postToLinkedIn.js` — LinkedIn posting
- `utils/logger.js` — log writer
- `.env` → `PAGE_ID`, `ACCESS_TOKEN`, `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_PERSON_URN`

---

## Notes
- LinkedIn posting is scaffolded — add `LINKEDIN_ACCESS_TOKEN` + `LINKEDIN_PERSON_URN` to `.env` to activate
- Platform-specific captions consistently outperform shared copy — use Option B when possible
- All posts logged to `/logs/posts.json` automatically — monitor for failures
- Use Remotion for branded visuals — render platform-specific sizes for best results
- Consider scheduling this workflow with a cron job or the built-in `schedule` skill
