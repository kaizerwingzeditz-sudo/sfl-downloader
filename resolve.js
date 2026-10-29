// Vercel Serverless Function: safely accepts only sfl.gl URLs, then forwards
// the request to the publicly documented resolver service.
const ALLOWED_HOSTS = new Set(['sfl.gl', 'www.sfl.gl']);
const PROVIDER_ENDPOINT = 'https://www.kevinhosting.my.id/api/tools/sfl';

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Gunakan metode POST.' });
  }

  try {
    const input = typeof req.body?.url === 'string' ? req.body.url : '';
    if (!input || input.length > 2048) {
      return res.status(400).json({ error: 'Masukkan satu URL SFL.gl yang valid.' });
    }

    let url;
    try { url = new URL(input); }
    catch { return res.status(400).json({ error: 'Format URL tidak valid.' }); }

    if (!['http:', 'https:'].includes(url.protocol) || !ALLOWED_HOSTS.has(url.hostname.toLowerCase())) {
      return res.status(400).json({ error: 'Hanya link http(s) dari sfl.gl yang didukung.' });
    }

    const abort = new AbortController();
    const timeout = setTimeout(() => abort.abort(), 20000);
    let upstream;
    try {
      upstream = await fetch(PROVIDER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ url: url.href }),
        signal: abort.signal
      });
    } finally {
      clearTimeout(timeout);
    }

    const bodyText = await upstream.text();
    let data;
    try { data = JSON.parse(bodyText); }
    catch { data = { message: bodyText.slice(0, 500) }; }

    if (!upstream.ok) {
      return res.status(502).json({
        error: `Layanan resolver pihak ketiga mengembalikan status ${upstream.status}. Coba lagi nanti.`,
        upstreamStatus: upstream.status
      });
    }
    return res.status(200).json(data);
  } catch (error) {
    const timedOut = error?.name === 'AbortError';
    return res.status(502).json({
      error: timedOut
        ? 'Resolver pihak ketiga kehabisan waktu. Coba lagi beberapa saat.'
        : 'Tidak bisa menghubungi resolver pihak ketiga. Layanan mungkin sedang tidak tersedia.'
    });
  }
};
