# Workflow: Multi-Platform Posting

## Purpose
Publish content across multiple platforms (Facebook, LinkedIn) using a unified posting system.
This workflow is designed to be reusable, scalable, and compatible with Claude-based automation.

---

## Inputs

| Field       | Type             | Description                            |
|-------------|------------------|----------------------------------------|
| `imageUrl`  | string           | Publicly accessible image or video URL |
| `caption`   | string           | Post copy (can be empty but recommended) |
| `platforms` | array of strings | e.g. `["facebook", "linkedin"]`        |

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
- Structured log entry written to `/logs/posts.json`

---

## Workflow Steps

### Step 1 — Validate Inputs

Ensure all required fields are present and valid before proceeding.

- `imageUrl` — must be present and a valid string URL
- `caption` — must be a string (can be empty, but recommended)
- `platforms` — must be a non-empty array containing only valid values (`"facebook"`, `"linkedin"`)

**If validation fails:**
- Abort execution immediately
- Log the failure to `/logs/posts.json`
- Return `{ "success": false, "errors": ["Validation failed: <reason>"] }`

---

### Step 2 — Normalize Payload

Create a standardized internal payload to pass through the rest of the workflow:

```json
{
  "imageUrl": "...",
  "caption": "...",
  "timestamp": "ISO_8601"
}
```

---

### Step 3 — Initialize Results Object

```json
{
  "facebook": null,
  "linkedin": null,
  "errors": []
}
```

---

### Step 4 — Execute Platform Posts

#### 🔵 Facebook Flow

- **File:** `/meta/postRunner.js`
- **Function:** `runPost({ imageUrl, caption })`

**Behavior:**
- Uses Meta Graph API `/photos` endpoint
- Posts image via URL
- Includes caption
- Publishes immediately

**On success:** Store API response in `results.facebook`

**On failure:** Push error message to `results.errors`

---

#### 🔗 LinkedIn Flow (Scaffold or Active)

- **File:** `/linkedin/linkedinRunner.js`
- **Function:** `runLinkedInPost({ imageUrl, caption })`

**Behavior:**
- If `LINKEDIN_ACCESS_TOKEN` is present in `.env`: attempt post via LinkedIn UGC API
- If token is absent: mark result as `"skipped"`

**On success:** Store API response in `results.linkedin`

**On failure:** Push error message to `results.errors`

---

### Step 5 — Logging

Append a structured entry to `/logs/posts.json` after every run (success or failure):

```json
{
  "timestamp": "ISO_8601",
  "imageUrl": "...",
  "caption": "...",
  "platforms": ["facebook", "linkedin"],
  "results": {
    "facebook": "...",
    "linkedin": "...",
    "errors": []
  }
}
```

---

### Step 6 — Return Final Result

**On success:**
```json
{
  "success": true,
  "results": { ... }
}
```

**On failure:**
```json
{
  "success": false,
  "errors": [ ... ]
}
```

---

## Claude Behavior Notes

When executing this workflow, Claude should:

- **Not** rewrite core posting logic
- **Reuse** existing runners (`postRunner.js`, `linkedinRunner.js`)
- **Only** orchestrate flow and data movement
- **Log every attempt** — success or failure — without exception

---

## Reference Implementation

```javascript
require('dotenv').config();
const { run }            = require('../meta/postRunner');
const { runLinkedIn }    = require('../linkedin/linkedinRunner');
const { logPost }        = require('../utils/logger');

async function multiPlatformPost({ imageUrl, caption, platforms }) {

  // Step 1 — Validate
  if (!imageUrl || typeof imageUrl !== 'string')
    return { success: false, errors: ['imageUrl is required'] };
  if (typeof caption !== 'string')
    return { success: false, errors: ['caption must be a string'] };
  if (!Array.isArray(platforms) || platforms.length === 0)
    return { success: false, errors: ['platforms must be a non-empty array'] };

  // Step 2 — Normalize payload
  const payload = {
    imageUrl,
    caption,
    timestamp: new Date().toISOString(),
  };

  // Step 3 — Initialize results
  const results = { facebook: null, linkedin: null, errors: [] };

  // Step 4 — Execute posts
  for (const platform of platforms) {
    try {
      if (platform === 'facebook') {
        results.facebook = await run('facebook', { imageUrl, caption });
      } else if (platform === 'linkedin') {
        if (process.env.LINKEDIN_ACCESS_TOKEN) {
          results.linkedin = await runLinkedIn({ imageUrl, caption });
        } else {
          results.linkedin = 'skipped';
          console.warn('[LinkedIn] No access token — skipping');
        }
      }
    } catch (err) {
      results.errors.push(`[${platform}] ${err.message}`);
    }
  }

  // Step 5 — Log
  await logPost({ ...payload, platforms, results });

  // Step 6 — Return
  const success = results.errors.length === 0;
  return { success, results };
}

module.exports = { multiPlatformPost };
```

### CLI Usage
```bash
node meta/postRunner.js all '{"imageUrl":"https://example.com/image.jpg","caption":"This is a test post"}'
```

---

## Dependencies

- `meta/postRunner.js` — Facebook posting runner
- `linkedin/linkedinRunner.js` — LinkedIn posting runner
- `utils/logger.js` — log writer
- `.env` → `PAGE_ID`, `ACCESS_TOKEN`, `LINKEDIN_ACCESS_TOKEN` *(optional)*

---

## Future Extensions

- **Instagram** — same Meta Graph API, minimal changes to `postToFacebook.js`
- **Scheduling** — cron job or queue system integration
- **Retry logic** — exponential backoff for failed posts
- **Caption generation** — auto-generate via `/prompts/facebookCaption.txt` + Claude API
- **Analytics tracking** — record reach, impressions, and engagement per post
