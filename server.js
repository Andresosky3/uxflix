/* Servidor de desarrollo opcional. Ejecutar: npm start */
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=__dirname,port=Number(process.env.PORT||5173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.ttf':'font/ttf','.pdf':'application/pdf','.md':'text/plain; charset=utf-8'};
http.createServer((req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);res.end('Ruta no válida');return}
 const target=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!target.startsWith(root+path.sep)||pathname.split('/').some(s=>s.startsWith('.'))){res.writeHead(403);res.end('Acceso no permitido');return}
 fs.stat(target,(err,stat)=>{if(err||!stat.isFile()){res.writeHead(404);res.end('Archivo no encontrado');return}res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Content-Length':stat.size,'X-Content-Type-Options':'nosniff'});if(req.method==='HEAD'){res.end();return}fs.createReadStream(target).pipe(res)})
}).listen(port,'127.0.0.1',()=>console.log(`UXFLIX listo en http://localhost:${port}`));
