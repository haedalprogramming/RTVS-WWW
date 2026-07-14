// TEMPORARY diagnostic endpoint — lists what's actually sitting directly
// under GOOGLE_DRIVE_FOLDER_ID, to debug a report that uploaded videos
// aren't visible in Drive's UI. Remove once that's resolved.

const { requireSession } = require('./_lib/uploadAuth');
const { listChildren } = require('./_lib/googleDrive');

module.exports = async function handler(req, res) {
  if (!requireSession(req, res)) return;

  const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!rootFolderId) {
    return res.status(500).json({ error: 'GOOGLE_DRIVE_FOLDER_ID is not configured' });
  }

  try {
    const children = await listChildren(rootFolderId);
    return res.status(200).json({ rootFolderId, children });
  } catch (err) {
    return res.status(502).json({ error: String(err.message || err) });
  }
};
