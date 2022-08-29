//// [foo_0.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_class_call_check.mjs"
], function(require, exports, _classCallCheck) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        E1: function() {
            return E1;
        },
        C1: function() {
            return C1;
        }
    });
    _classCallCheck = _classCallCheck.default;
    var C1 = function C1() {
        "use strict";
        _classCallCheck(this, C1);
        this.m1 = 42;
    };
    C1.s1 = true;
    var E1;
    (function(E1) {
        E1[E1["A"] = 0] = "A";
        E1[E1["B"] = 1] = "B";
        E1[E1["C"] = 2] = "C";
    })(E1 || (E1 = {}));
});
//// [foo_1.ts]
define([
    "require",
    "exports",
    "./foo_0"
], function(require, exports, _foo0) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var i;
    var x = {};
    var y = false;
    var z;
    var e = 0;
});
