# Facebook Poster Skill

## Purpose
Post content to Facebook using the Meta Graph API via `meta/postToFacebook.js`.

## Input
- `imageUrl` (string) — Publicly accessible image URL
- `caption` (string) — Post caption / message

## Behavior
- Calls `meta/postToFacebook.js → postToFacebook(imageUrl, caption)`
- Posts to the Facebook Page defined by `PAGE_ID` in `.env`
- Uses the `/photos` endpoint (single-step, no staging)
- Returns `{ id, post_id }` on success

## Output
```json
{ "id": "photo_id", "post_id": "post_id" }
```

## Example
```json
{
  "imageUrl": "https://cdn.mediatwist.com/posts/march-offer.jpg",
  "caption": "Spring is here — and so are fresh results. 🌱 Book your free strategy call today. #SocialMedia #Mediatwist #DigitalMarketing"
}
```

## Runner
```bash
node meta/postRunner.js facebook '{"imageUrl":"https://...","caption":"Your caption"}'
```

## Notes
- Requires `PAGE_ID` and `ACCESS_TOKEN` in `.env`
- Uses Meta Graph API v20.0
- Results logged automatically to `logs/posts.json`
