//// [defaultExportsCannotMerge04.ts]
function Foo() {}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return Foo;
    }
}), Foo || (Foo = {});
