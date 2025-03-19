//// [exportStar.ts]
//// [t1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    x: function() {
        return x;
    },
    y: function() {
        return y;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: all[name]
});
var x = 1, y = 2;
//// [t2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    default: function() {
        return _default;
    },
    foo: function() {
        return foo;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: all[name]
});
var _default = "hello";
function foo() {}
//// [t3.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    x: function() {
        return x;
    },
    y: function() {
        return y;
    },
    z: function() {
        return z;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: all[name]
});
var x = "x", y = "y", z = "z";
//// [t4.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _export_star = require("@swc/helpers/_/_export_star");
_export_star._(require("./t1"), exports), _export_star._(require("./t2"), exports), _export_star._(require("./t3"), exports);
//// [main.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _t4 = /*#__PURE__*/ require("@swc/helpers/_/_interop_require_wildcard")._(require("./t4"));
_t4.default, _t4.x, _t4.y, _t4.z, _t4.foo;
