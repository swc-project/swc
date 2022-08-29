//// [useSharedArrayBuffer2.ts]
var foge = new SharedArrayBuffer(1024);
foge.slice(1, 10), foge.byteLength;
