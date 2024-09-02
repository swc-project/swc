//// [declarationEmitThisPredicates01.ts]
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
    C: function() {
        return C;
    },
    D: function() {
        return D;
    }
});
var _call_super = require("@swc/helpers/_/_call_super");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _inherits = require("@swc/helpers/_/_inherits");
var _instanceof = require("@swc/helpers/_/_instanceof");
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check._(this, C);
    }
    var _proto = C.prototype;
    _proto.m = function m() {
        return _instanceof._(this, D);
    };
    return C;
}();
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits._(D, C);
    function D() {
        _class_call_check._(this, D);
        return _call_super._(this, D, arguments);
    }
    return D;
}(C);
