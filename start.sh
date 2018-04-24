#tsc app.ts  --outDir outdir;
tsc websocket/connectToSocket.ts --outDir outdir_websocket;

#pm2 start outdir/app.js;
pm2 start outdir/websocket/connectToSocket.js;

pm2 logs