//// [reExportAliasMakesInstantiated.ts]
export var test1 = pack2.test1;
var test2 = mod2; // Possible false positive instantiation, but ok
