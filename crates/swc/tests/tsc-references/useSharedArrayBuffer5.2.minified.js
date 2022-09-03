//// [useSharedArrayBuffer5.ts]
var foge = new SharedArrayBuffer(1024), species = foge[Symbol.species], stringTag = foge[Symbol.toStringTag];
