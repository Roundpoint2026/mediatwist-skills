# LinkedIn Poster Skill

## Purpose
Post content to LinkedIn using the UGC API via `linkedin/postToLinkedIn.js`.

## Status
🚧 **Scaffold** — structure and endpoints are ready. Activate by adding `LINKEDIN_ACCESS_TOKEN` to `.env`.

## Input
- `imageUrl` (string) — Publicly accessible image URL
- `caption` (string) — Post caption / message

## Behavior
- Calls `linkedin/postToLinkedIn.js → postToLinkedIn(imageUrl, caption)`
- In scaffold mode: logs the payload but does not send
- When activated: executes a 3-step LinkedIn UGC post (register → upload → post)

## Output (when active)
```json
{ "id": "urn:li:share:XXXXXXXXXX" }
```

## Example
```json
{
  "imageUrl": "https://cdn.mediatwist.com/posts/linkedin-march.jpg",
  "caption": "Most agencies chase likes. We chase leads.\n\nHere's what we changed for our clients in Q1 👇\n\n#LinkedInMarketing #Mediatwist #LeadGen"
}
```

## Runner
```bash
node linkedin/linkedinRunner.js '{"imageUrl":"https://...","caption":"Your caption"}'
```

## Notes
- Requires `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_PERSON_URN` in `.env`
- OAuth token obtained via LinkedIn Developer Portal (3-legged OAuth 2.0)
- Image requires a 2-step upload — see TODOs in `postToLinkedIn.js`
- Results logged automatically to `logs/posts.json`
