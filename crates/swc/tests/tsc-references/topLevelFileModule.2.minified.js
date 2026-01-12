//// [vs/foo_0.ts]
var x;
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "x", {
    enumerable: !0,
    get: function() {
        return x;
    }
});
//// [vs/fum.d.ts]
//// [foo_1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var foo = require("./vs/foo_0"), fum = require("./vs/fum");
foo.x, fum.y;
