require('dotenv').config();
const axios = require('axios');

/**
 * Meta Ads API Module
 * Foundation for creating campaigns, ad sets, and ad creatives via Meta Marketing API
 *
 * Requires in .env:
 *   META_AD_ACCOUNT_ID      — e.g. act_123456789
 *   META_ADS_ACCESS_TOKEN   — long-lived system user token (Marketing API access)
 *   PAGE_ID                 — your Facebook Page ID (for ad creatives)
 *   META_PIXEL_ID           — (optional) your Meta Pixel ID for conversion tracking
 *
 * All assets are created with status: PAUSED — activate manually in Ads Manager.
 */

const API_VERSION = 'v20.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAdCredentials() {
  const { META_AD_ACCOUNT_ID, META_ADS_ACCESS_TOKEN } = process.env;
  if (!META_AD_ACCOUNT_ID || !META_ADS_ACCESS_TOKEN) {
    throw new Error('Missing META_AD_ACCOUNT_ID or META_ADS_ACCESS_TOKEN in .env');
  }
  return { META_AD_ACCOUNT_ID, META_ADS_ACCESS_TOKEN };
}

// ─── Campaign ─────────────────────────────────────────────────────────────────

/**
 * Creates a new Meta ad campaign
 *
 * @param {object} options
 * @param {string} options.name        Campaign display name
 * @param {string} options.objective   Meta objective e.g. OUTCOME_AWARENESS | OUTCOME_LEADS | OUTCOME_SALES
 * @param {string} options.status      'PAUSED' (default, safe) | 'ACTIVE'
 * @returns {Promise<object>}          { id: campaign_id }
 */
async function createCampaign({ name, objective = 'OUTCOME_AWARENESS', status = 'PAUSED' }) {
  const { META_AD_ACCOUNT_ID, META_ADS_ACCESS_TOKEN } = getAdCredentials();

  const response = await axios.post(
    `${BASE_URL}/${META_AD_ACCOUNT_ID}/campaigns`,
    {
      name,
      objective,
      status,
      special_ad_categories: [], // Required — set appropriately for housing/employment/credit ads
      access_token: META_ADS_ACCESS_TOKEN,
    }
  );

  console.log(`✅ Campaign created: "${name}" → ID: ${response.data.id}`);
  return response.data;
}

// ─── Ad Set ───────────────────────────────────────────────────────────────────

/**
 * Creates an ad set inside a campaign
 *
 * @param {object} options
 * @param {string} options.campaignId    ID from createCampaign()
 * @param {string} options.name          Ad set display name
 * @param {number} options.dailyBudget   Daily budget in cents (1000 = $10.00)
 * @param {object} options.targeting     Override default targeting (optional)
 * @returns {Promise<object>}            { id: adset_id }
 */
async function createAdSet({
  campaignId,
  name,
  dailyBudget = 1000,
  targeting = {},
}) {
  const { META_AD_ACCOUNT_ID, META_ADS_ACCESS_TOKEN } = getAdCredentials();

  // Merge with sensible defaults — override freely
  const finalTargeting = {
    geo_locations: { countries: ['US'] },
    age_min: 25,
    age_max: 55,
    ...targeting,
  };

  const response = await axios.post(
    `${BASE_URL}/${META_AD_ACCOUNT_ID}/adsets`,
    {
      name,
      campaign_id: campaignId,
      daily_budget: dailyBudget,
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'REACH',
      targeting: finalTargeting,
      status: 'PAUSED',
      access_token: META_ADS_ACCESS_TOKEN,
    }
  );

  console.log(`✅ Ad set created: "${name}" → ID: ${response.data.id}`);
  return response.data;
}

// ─── Ad Creative ──────────────────────────────────────────────────────────────

/**
 * Creates an ad creative with an image and caption
 *
 * @param {object} options
 * @param {string} options.name       Creative display name
 * @param {string} options.imageUrl   Publicly accessible image URL
 * @param {string} options.caption    Ad copy / message
 * @param {string} options.linkUrl    Destination URL (landing page)
 * @returns {Promise<object>}         { id: creative_id }
 */
async function createAdCreative({
  name,
  imageUrl,
  caption,
  linkUrl = 'https://mediatwist.com',
}) {
  const { META_AD_ACCOUNT_ID, META_ADS_ACCESS_TOKEN } = getAdCredentials();
  const { PAGE_ID } = process.env;

  if (!PAGE_ID) throw new Error('Missing PAGE_ID in .env');

  const response = await axios.post(
    `${BASE_URL}/${META_AD_ACCOUNT_ID}/adcreatives`,
    {
      name,
      object_story_spec: {
        page_id: PAGE_ID,
        link_data: {
          image_url: imageUrl,
          message: caption,
          link: linkUrl,
          call_to_action: {
            type: 'LEARN_MORE', // Options: SIGN_UP, CONTACT_US, GET_QUOTE, BOOK_TRAVEL, etc.
            value: { link: linkUrl },
          },
        },
      },
      access_token: META_ADS_ACCESS_TOKEN,
    }
  );

  console.log(`✅ Ad creative created: "${name}" → ID: ${response.data.id}`);
  return response.data;
}

module.exports = { createCampaign, createAdSet, createAdCreative };
