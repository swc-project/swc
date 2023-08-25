//// [globalThisReadonlyProperties.ts]
globalThis.globalThis = 1 // should error
, globalThis.x = 3, globalThis.y = 4 // should error
;
