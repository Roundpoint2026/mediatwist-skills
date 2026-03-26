require('dotenv').config();

const { postToLinkedIn } = require('./postToLinkedIn');
const { logPost } = require('../utils/logger');

/**
 * LinkedIn-specific post runner
 * Use for LinkedIn-only posting jobs (e.g. scheduled LinkedIn posts)
 *
 * @param {object} payload  { imageUrl: string, caption: string }
 * @returns {Promise<object>} { success: boolean, result: object }
 */
async function runLinkedIn(payload) {
  const { imageUrl, caption } = payload;
  let success = false;
  let result;

  try {
    result = await postToLinkedIn(imageUrl, caption);
    success = true;
    console.log('✅ [LinkedIn] Result:', result);
  } catch (err) {
    console.error('❌ [LinkedIn] Failed:', err.message);
    result = { error: err.message };
  }

  await logPost({ platform: 'linkedin', imageUrl, caption, success });
  return { success, result };
}

// ─── CLI Usage ────────────────────────────────────────────────────────────────
// node linkedin/linkedinRunner.js '{"imageUrl":"https://...","caption":"Hello!"}'
// ─────────────────────────────────────────────────────────────────────────────
if (require.main === module) {
  const [,, payloadStr] = process.argv;

  const payload = payloadStr
    ? JSON.parse(payloadStr)
    : {
        imageUrl: process.env.TEST_IMAGE_URL || 'https://example.com/sample.jpg',
        caption:  process.env.TEST_CAPTION  || 'Test post from Mediatwist 🚀',
      };

  runLinkedIn(payload)
    .then(result => console.log('\n📊 Result:', JSON.stringify(result, null, 2)))
    .catch(err => { console.error(err.message); process.exit(1); });
}

module.exports = { runLinkedIn };
