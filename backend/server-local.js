const http=require('http');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..','frontend');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4','.ico':'image/x-icon'};
const server=http.createServer((req,res)=>{
  let url=decodeURIComponent((req.url||'/').split('?')[0]);
  if(url==='/')url='/index.html';
  const file=path.normalize(path.join(root,url));
  if(!file.startsWith(root)){res.writeHead(403);return res.end('Acesso negado');}
  fs.stat(file,(err,st)=>{
    if(err||!st.isFile()){res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});return res.end('Arquivo não encontrado');}
    res.writeHead(200,{'Content-Type':mime[path.extname(file).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store'});
    fs.createReadStream(file).pipe(res);
  });
});
server.listen(3000,'127.0.0.1',()=>console.log('Sabor & Cia aberto em http://localhost:3000'));
