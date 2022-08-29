//// [globalThisReadonlyProperties.ts]
globalThis.globalThis = 1 // should error
;
var x = 1;
var y = 2;
globalThis.x = 3;
globalThis.y = 4 // should error
;
