//// [defaultExportsCannotMerge04.ts]
var x;
function Foo() {}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return Foo;
    }
}), Object.defineProperty(Foo || (Foo = {}), "x", {
    enumerable: !0,
    get: function() {
        return x;
    },
    set: function(v) {
        x = v;
    }
});
