//// [foo_0.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_class_call_check"
], function(require, exports, _class_call_check) {
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
        C1: function() {
            return C1;
        },
        E1: function() {
            return E1;
        }
    });
    var C1 = function C1() {
        "use strict";
        _class_call_check._(this, C1);
        this.m1 = 42;
    };
    C1.s1 = true;
    var E1 = /*#__PURE__*/ function(E1) {
        E1[E1["A"] = 0] = "A";
        E1[E1["B"] = 1] = "B";
        E1[E1["C"] = 2] = "C";
        return E1;
    }({});
});
//// [foo_1.ts]
define([
    "require"
], function(require) {
    "use strict";
    var i;
    var x = {};
    var y = false;
    var z;
    var e = 0;
});
