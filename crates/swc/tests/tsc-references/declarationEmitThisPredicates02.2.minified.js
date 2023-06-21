//// [declarationEmitThisPredicates02.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "obj", {
    enumerable: !0,
    get: function() {
        return obj;
    }
});
var obj = {
    m: function() {
        return null != this.a && null != this.b && null != this.c;
    }
};
