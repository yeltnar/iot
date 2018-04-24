tsc iot_core/app.ts  --outDir outdir;
pm2 start outdir/app.js;

tsc websocket/connectToSocket.ts  --outDir outdir;
pm2 start outdir/connectToSocket.js;

pm2 logs;