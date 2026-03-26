# Meta Ads Manager Skill

## Purpose
Create and manage Meta ad campaigns, ad sets, and creatives via the Meta Marketing API (`ads/metaAds.js`).

## Input

### `createCampaign(options)`
| Field       | Type   | Default              | Description                                      |
|-------------|--------|----------------------|--------------------------------------------------|
| `name`      | string | required             | Campaign display name                            |
| `objective` | string | `OUTCOME_AWARENESS`  | Meta objective (OUTCOME_LEADS, OUTCOME_SALES...) |
| `status`    | string | `PAUSED`             | PAUSED (safe default) or ACTIVE                  |

### `createAdSet(options)`
| Field          | Type   | Default    | Description                             |
|----------------|--------|------------|-----------------------------------------|
| `campaignId`   | string | required   | ID returned by `createCampaign()`       |
| `name`         | string | required   | Ad set display name                     |
| `dailyBudget`  | number | `1000`     | In cents — 1000 = $10.00/day            |
| `targeting`    | object | US, 25–55  | Geo, age, interests override            |

### `createAdCreative(options)`
| Field      | Type   | Default                  | Description                       |
|------------|--------|--------------------------|-----------------------------------|
| `name`     | string | required                 | Creative display name             |
| `imageUrl` | string | required                 | Publicly accessible image URL     |
| `caption`  | string | required                 | Ad copy / message                 |
| `linkUrl`  | string | `https://mediatwist.com` | Destination / landing page URL    |

## Behavior
- All assets created with `status: PAUSED` — safe to run without risking spend
- Logs each created asset ID to the console
- Follows the Campaign → Ad Set → Creative hierarchy

## Example
```javascript
const { createCampaign, createAdSet, createAdCreative } = require('./ads/metaAds');

const campaign = await createCampaign({ name: 'Mediatwist Lead Gen Q1', objective: 'OUTCOME_LEADS' });
const adSet    = await createAdSet({ campaignId: campaign.id, name: 'US Adults 25–45', dailyBudget: 2000 });
const creative = await createAdCreative({ name: 'Lead Gen v1', imageUrl: 'https://...', caption: 'Get your free strategy session today.' });
```

## Notes
- Requires `META_AD_ACCOUNT_ID`, `META_ADS_ACCESS_TOKEN`, and `PAGE_ID` in `.env`
- Uses Meta Graph API v20.0
- Budget in cents: `2000` = $20.00/day
- Never activate campaigns without reviewing targeting and creative in Ads Manager first
