const http = require('http');

const PORT = process.env.PORT || 8080;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>practice-app</title>
  <style>
    :root {
      --bg0: #0c0f14;
      --bg1: #121826;
      --ink: #e8ecf4;
      --muted: #8b95a8;
      --accent: #3ee0b8;
      --accent-dim: rgba(62, 224, 184, 0.15);
      --border: rgba(255, 255, 255, 0.08);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 1.5rem;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      color: var(--ink);
      background:
        radial-gradient(1200px 600px at 20% -10%, rgba(62, 224, 184, 0.12), transparent 55%),
        radial-gradient(900px 500px at 100% 20%, rgba(99, 140, 255, 0.10), transparent 50%),
        linear-gradient(165deg, var(--bg0), var(--bg1));
    }
    .card {
      width: min(100%, 28rem);
      padding: 2rem 2rem 1.75rem;
      border-radius: 1rem;
      background: rgba(10, 12, 18, 0.65);
      border: 1px solid var(--border);
      box-shadow:
        0 0 0 1px rgba(0, 0, 0, 0.35) inset,
        0 24px 48px rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(10px);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.25rem 0.65rem;
      border-radius: 999px;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--accent);
      background: var(--accent-dim);
      border: 1px solid rgba(62, 224, 184, 0.35);
    }
    .badge span {
      display: inline-block;
      width: 0.45rem;
      height: 0.45rem;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 10px var(--accent);
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.55; transform: scale(0.92); }
    }
    h1 {
      margin: 1rem 0 0.5rem;
      font-size: clamp(1.5rem, 4vw, 1.85rem);
      font-weight: 650;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }
    p {
      margin: 0;
      color: var(--muted);
      font-size: 0.95rem;
      line-height: 1.55;
    }
    .meta {
      margin-top: 1.35rem;
      padding-top: 1.1rem;
      border-top: 1px solid var(--border);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.75rem;
      color: var(--muted);
    }
    .meta strong { color: #c5ccd8; font-weight: 500; }
  </style>
</head>
<body>
  <main class="card">
    <div class="badge"><span></span> Live</div>
    <h1>Hello from Node.js on GKE</h1>
    <p>Shipped with Docker, delivered by Jenkins, and running happily behind Kubernetes.</p>
    <p> by Aditya kumar </p>
    <div class="meta">
      <strong>Stack</strong> · Node ${process.version} · Port ${PORT}
    </div>
  </main>
</body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.url === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});