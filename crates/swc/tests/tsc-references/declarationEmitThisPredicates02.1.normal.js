//// [declarationEmitThisPredicates02.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "obj", {
    enumerable: true,
    get: function() {
        return obj;
    }
});
var obj = {
    m: function m() {
        var dis = this;
        return dis.a != null && dis.b != null && dis.c != null;
    }
};
