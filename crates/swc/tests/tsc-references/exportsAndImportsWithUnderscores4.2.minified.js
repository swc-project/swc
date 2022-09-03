//// [exportsAndImportsWithUnderscores4.ts]
"use strict";
//// [m1.ts]
"use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}
function _() {
    console.log("_");
}
function __() {
    console.log("__");
}
function ___() {
    console.log("___");
}
function _hi() {
    console.log("_hi");
}
function __proto() {
    console.log("__proto");
}
function __esmodule() {
    console.log("__esmodule");
}
function ___hello() {
    console.log("___hello");
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), _export(exports, {
    _: function() {
        return _;
    },
    __: function() {
        return __;
    },
    ___: function() {
        return ___;
    },
    _hi: function() {
        return _hi;
    },
    __proto: function() {
        return __proto;
    },
    __esmodule: function() {
        return __esmodule;
    },
    ___hello: function() {
        return ___hello;
    }
});
//// [m2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _m1 = require("./m1");
(0, _m1._)(), (0, _m1.__)(), (0, _m1.___hello)(), (0, _m1.__esmodule)(), (0, _m1.__proto)(), (0, _m1._hi)();
