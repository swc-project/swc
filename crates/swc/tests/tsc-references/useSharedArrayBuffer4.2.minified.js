//// [useSharedArrayBuffer4.ts]
var foge = new SharedArrayBuffer(1024), bar = foge.slice(1, 10), species = foge[Symbol.species], stringTag = foge[Symbol.toStringTag], len = foge.byteLength;
