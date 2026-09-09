const http = require('http');
const fs = require('fs');
const path = require('path');
const dist = path.join(__dirname, 'dist');
const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.xml':'application/xml','.txt':'text/plain','.json':'application/json','.ico':'image/x-icon'};
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  let fp = path.join(dist, p);
  if (!fs.existsSync(fp)) fp += '.html';
  if (!fs.existsSync(fp)) { res.writeHead(404); res.end('Not found'); return; }
  const ext = path.extname(fp);
  res.writeHead(200, {'Content-Type': mime[ext] || 'application/octet-stream'});
  fs.createReadStream(fp).pipe(res);
}).listen(3456, () => console.log('KC Water Damage → http://localhost:3456'));
