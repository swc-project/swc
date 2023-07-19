//// [foo.ts]
function foo() {}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "foo", {
    enumerable: !0,
    get: function() {
        return foo;
    }
});
//// [bar.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _foo = require("./foo");
_foo.foo, _foo.foo;
