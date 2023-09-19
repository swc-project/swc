//// [defaultExportsCannotMerge04.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return Foo;
    }
});
function Foo() {}
(function(Foo) {
    var x = Foo.x = void 0;
})(Foo || (Foo = {}));
