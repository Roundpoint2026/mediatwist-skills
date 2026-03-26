const axios = require('axios');

/**
 * Posts an image + caption to LinkedIn (UGC API)
 *
 * ─── STATUS: SCAFFOLD ────────────────────────────────────────────────────────
 * Structure and endpoints are ready. Wire up OAuth token to activate.
 *
 * Requires in .env:
 *   LINKEDIN_ACCESS_TOKEN   — OAuth 2.0 bearer token
 *   LINKEDIN_PERSON_URN     — e.g. urn:li:person:XXXXXXXX
 *                             or urn:li:organization:XXXXXXXX for a company page
 *
 * ─── HOW LINKEDIN IMAGE POSTING WORKS ────────────────────────────────────────
 * Step 1: Register an upload URL   → POST /assets?action=registerUpload
 * Step 2: Upload the image binary  → PUT {uploadUrl}
 * Step 3: Create UGC post          → POST /ugcPosts (with asset URN from step 1)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * @param {string} imageUrl  Publicly accessible image URL
 * @param {string} caption   Post caption / message
 * @returns {Promise<object>} LinkedIn API response or scaffold status
 */
async function postToLinkedIn(imageUrl, caption) {
  const { LINKEDIN_ACCESS_TOKEN, LINKEDIN_PERSON_URN } = process.env;

  // ── Validation ──────────────────────────────────────────────────────────────
  if (!LINKEDIN_ACCESS_TOKEN) {
    throw new Error('Missing LINKEDIN_ACCESS_TOKEN in .env');
  }
  if (!LINKEDIN_PERSON_URN) {
    throw new Error('Missing LINKEDIN_PERSON_URN in .env');
  }

  const headers = {
    Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
  };

  // ── TODO: Step 1 — Register image upload ────────────────────────────────────
  // const registerRes = await axios.post(
  //   'https://api.linkedin.com/v2/assets?action=registerUpload',
  //   {
  //     registerUploadRequest: {
  //       recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
  //       owner: LINKEDIN_PERSON_URN,
  //       serviceRelationships: [{
  //         relationshipType: 'OWNER',
  //         identifier: 'urn:li:userGeneratedContent',
  //       }],
  //     },
  //   },
  //   { headers }
  // );
  // const uploadUrl = registerRes.data.value.uploadMechanism[...].uploadUrl;
  // const assetUrn  = registerRes.data.value.asset;

  // ── TODO: Step 2 — Upload image binary to uploadUrl ─────────────────────────
  // const imageBuffer = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  // await axios.put(uploadUrl, imageBuffer.data, {
  //   headers: { Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}` },
  // });

  // ── TODO: Step 3 — Create UGC post with image asset ─────────────────────────
  // const postBody = {
  //   author: LINKEDIN_PERSON_URN,
  //   lifecycleState: 'PUBLISHED',
  //   specificContent: {
  //     'com.linkedin.ugc.ShareContent': {
  //       shareCommentary: { text: caption },
  //       shareMediaCategory: 'IMAGE',
  //       media: [{
  //         status: 'READY',
  //         description: { text: caption },
  //         media: assetUrn,
  //       }],
  //     },
  //   },
  //   visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  // };
  // const postRes = await axios.post('https://api.linkedin.com/v2/ugcPosts', postBody, { headers });
  // return postRes.data;

  // ── Scaffold response (remove when token is wired up) ────────────────────────
  const scaffoldPayload = {
    author: LINKEDIN_PERSON_URN,
    caption,
    imageUrl,
  };

  console.log('[LinkedIn] 🚧 Scaffold mode — post not sent. Payload ready:', scaffoldPayload);
  return { status: 'scaffold', message: 'LinkedIn posting not yet active', payload: scaffoldPayload };
}

module.exports = { postToLinkedIn };
