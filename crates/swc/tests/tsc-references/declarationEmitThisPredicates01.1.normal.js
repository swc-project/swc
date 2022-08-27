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
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default;
var _inherits = require("@swc/helpers/lib/_inherits.js").default;
var _instanceof = require("@swc/helpers/lib/_instanceof.js").default;
var _createSuper = require("@swc/helpers/lib/_create_super.js").default;
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto.m = function m() {
        return _instanceof(this, D);
    };
    return C;
}();
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _createSuper(D);
    function D() {
        _classCallCheck(this, D);
        return _super.apply(this, arguments);
    }
    return D;
}(C);
