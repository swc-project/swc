//// [vs/foo_0.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "x", {
    enumerable: !0,
    get: function() {}
});
//// [vs/fum.d.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
//// [foo_1.ts]
var foo = require("./vs/foo_0"), fum = require("./vs/fum");
foo.x, fum.y;
