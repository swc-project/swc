//// [defaultExportsCannotMerge04.ts]
"use strict";
var Foo;
function Foo() {}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return Foo;
    }
}), function(Foo) {
    var x;
    Foo.x = x;
}(Foo || (Foo = {}));
