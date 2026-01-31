const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 8080;
const root = path.join(__dirname);
const mime = {
  '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.json':'application/json', '.mp4':'video/mp4'
};

const server = http.createServer((req,res)=>{
  try{
    const safePath = path.normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^\/+/, '');
    let p = path.join(root, safePath || 'index.html');
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
    if (!fs.existsSync(p)) { res.writeHead(404, {'Content-Type':'text/plain'}); res.end('Not found'); return; }
    const ext = path.extname(p).toLowerCase();
    const type = mime[ext] || 'application/octet-stream';
    res.writeHead(200, {'Content-Type': type});
    const stream = fs.createReadStream(p);
    stream.pipe(res);
  }catch(err){ res.writeHead(500, {'Content-Type':'text/plain'}); res.end('Server error'); }
});

server.listen(port, ()=> console.log(`Serving ${root} on http://127.0.0.1:${port}`));

module.exports = server;
