//// [declarationEmitThisPredicatesWithPrivateName01.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "C", {
    enumerable: true,
    get: function() {
        return C;
    }
});
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _inherits = require("@swc/helpers/_/_inherits");
var _instanceof = require("@swc/helpers/_/_instanceof");
var _create_super = require("@swc/helpers/_/_create_super");
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
    var _super = _create_super._(D);
    function D() {
        _class_call_check._(this, D);
        return _super.apply(this, arguments);
    }
    return D;
}(C);
