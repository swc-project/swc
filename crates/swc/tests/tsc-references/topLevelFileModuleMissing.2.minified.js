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
//// [foo_1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), require("vs/foo").x;
