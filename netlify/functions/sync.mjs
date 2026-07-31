/* Plenlogg sync — a thin backup endpoint on top of Netlify Blobs.

   GET  /api/sync?code=XXXX        -> { data, updated } or 404 if nothing stored
   POST /api/sync?code=XXXX  body: { data, updated }  -> stores it

   The code is the whole access control: it is generated client-side, long
   enough not to be guessable, and acts as both identifier and secret. There
   are no accounts; whoever holds the code holds the data. That is the right
   trade for a personal lawn log, but it does mean the code should not be
   shared casually.

   Writes are last-write-wins on the whole document. The client sends its
   local `updated` timestamp; we store it alongside so the client can compare
   on load and decide which copy is newer. */

import { getStore } from '@netlify/blobs';

const CODE_RE = /^[A-Z0-9]{8,32}$/;

export default async (req) => {
  const url = new URL(req.url);
  const code = (url.searchParams.get('code') || '').toUpperCase();

  if (!CODE_RE.test(code)) {
    return json({ error: 'bad code' }, 400);
  }

  const store = getStore('plenlogg');

  try {
    if (req.method === 'GET') {
      const hit = await store.get(code, { type: 'json' });
      if (!hit) return json({ error: 'not found' }, 404);
      return json(hit, 200);
    }

    if (req.method === 'POST') {
      const body = await req.json();
      if (!body || typeof body.data === 'undefined') {
        return json({ error: 'no data' }, 400);
      }
      const rec = { data: body.data, updated: body.updated || Date.now() };
      await store.setJSON(code, rec);
      return json({ ok: true, updated: rec.updated }, 200);
    }

    return json({ error: 'method' }, 405);
  } catch (e) {
    return json({ error: 'store failure' }, 500);
  }
};

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export const config = { path: '/api/sync' };
