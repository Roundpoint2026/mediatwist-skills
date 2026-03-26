const axios = require('axios');

/**
 * Posts an image + caption to a Facebook Page
 * Uses the /photos endpoint (single-step, no staging required)
 *
 * Requires in .env:
 *   PAGE_ID        — your Facebook Page ID
 *   ACCESS_TOKEN   — your long-lived Page access token
 *
 * @param {string} imageUrl  Publicly accessible image URL
 * @param {string} caption   Post caption / message
 * @returns {Promise<object>} Facebook API response { id, post_id }
 */
async function postToFacebook(imageUrl, caption) {
  const { PAGE_ID, ACCESS_TOKEN } = process.env;

  if (!PAGE_ID || !ACCESS_TOKEN) {
    throw new Error('Missing PAGE_ID or ACCESS_TOKEN in .env');
  }

  const endpoint = `https://graph.facebook.com/v20.0/${PAGE_ID}/photos`;

  const response = await axios.post(endpoint, {
    url: imageUrl,
    caption,
    access_token: ACCESS_TOKEN,
  });

  return response.data; // { id: photo_id, post_id: post_id }
}

module.exports = { postToFacebook };
