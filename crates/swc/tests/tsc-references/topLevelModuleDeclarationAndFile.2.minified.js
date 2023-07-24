//// [vs/foo_0/index.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "x", {
    enumerable: !0,
    get: function() {
        return x;
    }
});
var x = 42;
//// [foo_1.ts]
//// [foo_2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var foo = require("vs/foo_0");
foo.x, foo.y();
