require('dotenv').config();

const { postToFacebook } = require('./postToFacebook');
const { postToLinkedIn } = require('../linkedin/postToLinkedIn');
const { logPost } = require('../utils/logger');

/**
 * Universal Post Runner
 * Routes a payload to one or all platform posting functions
 *
 * @param {string} platform  'facebook' | 'linkedin' | 'all'
 * @param {object} payload   { imageUrl: string, caption: string }
 * @returns {Promise<object>} Results keyed by platform
 */
async function run(platform, payload) {
  const targets = platform === 'all' ? ['facebook', 'linkedin'] : [platform];
  const results = {};

  for (const p of targets) {
    let success = false;
    let result;

    try {
      if (p === 'facebook') {
        result = await postToFacebook(payload.imageUrl, payload.caption);
      } else if (p === 'linkedin') {
        result = await postToLinkedIn(payload.imageUrl, payload.caption);
      } else {
        throw new Error(`Unsupported platform: ${p}`);
      }

      success = true;
      console.log(`✅ [${p}] Post successful:`, result);
    } catch (err) {
      console.error(`❌ [${p}] Post failed:`, err.message);
      result = { error: err.message };
    }

    await logPost({ platform: p, ...payload, success });
    results[p] = { success, result };
  }

  return results;
}

// ─── CLI Usage ────────────────────────────────────────────────────────────────
// node meta/postRunner.js facebook '{"imageUrl":"https://...","caption":"Hello!"}'
// node meta/postRunner.js all      '{"imageUrl":"https://...","caption":"Hello!"}'
// ─────────────────────────────────────────────────────────────────────────────
if (require.main === module) {
  const [,, platform = 'facebook', payloadStr] = process.argv;

  const payload = payloadStr
    ? JSON.parse(payloadStr)
    : {
        imageUrl: process.env.TEST_IMAGE_URL || 'https://example.com/sample.jpg',
        caption:  process.env.TEST_CAPTION  || 'Test post from Mediatwist 🚀',
      };

  run(platform, payload)
    .then(results => {
      console.log('\n📊 Run complete:\n', JSON.stringify(results, null, 2));
    })
    .catch(err => {
      console.error('Fatal error:', err.message);
      process.exit(1);
    });
}

module.exports = { run };
