//// [useSharedArrayBuffer3.ts]
var foge = new SharedArrayBuffer(1024), bar = foge.slice(1, 10), len = foge.byteLength;
