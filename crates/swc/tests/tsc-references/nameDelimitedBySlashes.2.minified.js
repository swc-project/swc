//// [test/foo_0.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "foo", {
    enumerable: !0,
    get: function() {
        return foo;
    }
});
var foo = 42;
//// [foo_1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), require("./test/foo_0").foo;
