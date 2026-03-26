const fs   = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/posts.json');

/**
 * Appends a post event to logs/posts.json
 * Creates the file and directory if they don't exist
 *
 * @param {object} entry
 * @param {string} entry.platform   'facebook' | 'linkedin'
 * @param {string} entry.imageUrl   Image URL that was posted
 * @param {string} entry.caption    Caption that was posted
 * @param {boolean} entry.success   Whether the post succeeded
 */
async function logPost(entry) {
  let logs = [];

  // Load existing log entries
  if (fs.existsSync(LOG_FILE)) {
    try {
      const raw = fs.readFileSync(LOG_FILE, 'utf8');
      logs = JSON.parse(raw);
    } catch {
      logs = []; // Reset if file is corrupted
    }
  }

  // Append new entry
  logs.push({
    timestamp: new Date().toISOString(),
    platform:  entry.platform,
    caption:   entry.caption,
    imageUrl:  entry.imageUrl,
    success:   entry.success,
  });

  // Ensure logs/ directory exists and write
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));

  console.log(`📝 Logged [${entry.platform}] → success: ${entry.success}`);
}

module.exports = { logPost };
