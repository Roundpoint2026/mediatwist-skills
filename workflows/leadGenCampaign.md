# Workflow: Lead Gen Campaign

## Purpose
Create a structured Meta lead generation campaign via the Ads API — from campaign to creative — all in PAUSED state for safe review before going live.

---

## Steps

### Step 1 — Define Campaign Parameters
Decide on:
- Campaign name (e.g. `"Mediatwist Lead Gen – Q2 2026"`)
- Objective: `OUTCOME_LEADS`
- Daily budget (in cents): e.g. `2000` = $20.00/day
- Target audience: geo, age range, interests

### Step 2 — Generate Ad Creative with Remotion
Use Remotion to render a high-converting ad image.
- Recommended size: **1080 × 1080** (square, best for Facebook feed + Instagram)
- Template: `lead-gen-card` or `promo-banner`
- Include: headline, sub-copy, CTA text, brand logo

```bash
npx remotion render src/index.ts LeadGenCard out/lead-gen.jpg \
  --props='{"headline":"Get Your Free Strategy Session","cta":"Book Now"}'
```

Upload to CDN → get public `imageUrl`.

### Step 3 — Create Campaign
```javascript
const { createCampaign } = require('./ads/metaAds');

const campaign = await createCampaign({
  name: 'Mediatwist Lead Gen – Q2 2026',
  objective: 'OUTCOME_LEADS',
  status: 'PAUSED',  // Always start paused
});
// → { id: 'campaign_id' }
```

### Step 4 — Create Ad Set
```javascript
const { createAdSet } = require('./ads/metaAds');

const adSet = await createAdSet({
  campaignId: campaign.id,
  name: 'US Business Owners 28–50',
  dailyBudget: 2000,
  targeting: {
    geo_locations: { countries: ['US'] },
    age_min: 28,
    age_max: 50,
  },
});
// → { id: 'adset_id' }
```

### Step 5 — Create Ad Creative
```javascript
const { createAdCreative } = require('./ads/metaAds');

const creative = await createAdCreative({
  name: 'Lead Gen Creative v1',
  imageUrl: 'https://cdn.mediatwist.com/ads/lead-gen-q2.jpg',
  caption: 'Struggling to generate leads online? We fix that. Book your free 30-min strategy call today.',
  linkUrl: 'https://mediatwist.com/strategy-call',
});
// → { id: 'creative_id' }
```

### Step 6 — Log & Review
Note the returned IDs:
```json
{
  "campaignId": "...",
  "adSetId": "...",
  "creativeId": "..."
}
```

Review everything in Meta Ads Manager before activating.

### Step 7 — Activate (manual)
Once reviewed and approved in Ads Manager, change campaign status to `ACTIVE`.

---

## Full Script
```javascript
require('dotenv').config();
const { createCampaign, createAdSet, createAdCreative } = require('./ads/metaAds');

async function runLeadGenCampaign() {
  const campaign = await createCampaign({ name: 'Mediatwist Lead Gen – Q2 2026', objective: 'OUTCOME_LEADS' });
  const adSet    = await createAdSet({ campaignId: campaign.id, name: 'US Business Owners 28–50', dailyBudget: 2000 });
  const creative = await createAdCreative({
    name: 'Lead Gen Creative v1',
    imageUrl: 'https://cdn.mediatwist.com/ads/lead-gen-q2.jpg',
    caption: 'Struggling to generate leads? Book your free strategy call.',
    linkUrl: 'https://mediatwist.com/strategy-call',
  });
  console.log('Campaign structure created:', { campaign, adSet, creative });
}

runLeadGenCampaign();
```

---

## Dependencies
- `ads/metaAds.js`
- Remotion project (for creative generation)
- `.env` → `META_AD_ACCOUNT_ID`, `META_ADS_ACCESS_TOKEN`, `PAGE_ID`

## Notes
- Budget in cents: `2000` = $20.00/day
- All assets created as `PAUSED` — never go live without review
- Use `OUTCOME_LEADS` with Lead Forms or website conversion for best CPL
