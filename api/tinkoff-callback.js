import crypto from 'crypto';

/**
 * Tinkoff webhook entrypoint (Vercel Serverless Function)
 * Step 1 – skeleton: just log body and reply "OK" so the bank stops retrying.
 *
 * 👉 Next steps (separate commits)
 *  1. Parse JSON & verify Token (SHA‑256) – adds security.
 *  2. Forward the payload to INTERNAL_WEBHOOK_URL (your HTTP server)
 *  3. Handle retry logic / logging.
 *
 * Notes:
 *  • Bank expects HTTP 200 with body "OK" (exactly) within 10 s.
 *  • Keep responses FAST – do IO (DB, HTTP) after sending 200 whenever possible.
 */

export default async function handler(req, res) {
  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    // -- read raw request body ------------------------------------------------
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks).toString('utf-8');

    // For debugging: output to Vercel logs (visible in "Functions" tab)
    console.log('[Tinkoff webhook] raw body =>', rawBody);

    // TODO (Step 2): JSON.parse, Token verification, forward to your server.

    // ⬇️ Always answer quickly so the bank stops retrying
    return res.status(200).send('OK');
  } catch (err) {
    console.error('[Tinkoff webhook] error:', err);
    // Even on error we send 200 so bank doesn’t spam retries; log locally.
    return res.status(200).send('OK');
  }
}
