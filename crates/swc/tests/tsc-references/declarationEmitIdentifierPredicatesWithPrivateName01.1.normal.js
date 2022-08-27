//// [declarationEmitIdentifierPredicatesWithPrivateName01.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "f", {
    enumerable: true,
    get: function() {
        return f;
    }
});
function f(x) {
    return typeof x.a === "number";
}
