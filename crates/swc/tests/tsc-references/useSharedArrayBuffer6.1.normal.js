//// [useSharedArrayBuffer6.ts]
var foge = new SharedArrayBuffer(1024);
foge.length; // should error
var length = SharedArrayBuffer.length;
