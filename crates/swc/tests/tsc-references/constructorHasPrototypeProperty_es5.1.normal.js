import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var NonGeneric;
(function(NonGeneric) {
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    var D = /*#__PURE__*/ function(C) {
        "use strict";
        _inherits(D, C);
        var _super = _create_super(D);
        function D() {
            _class_call_check(this, D);
            return _super.apply(this, arguments);
        }
        return D;
    }(C);
    var r = C.prototype;
    r.foo;
    var r2 = D.prototype;
    r2.bar;
})(NonGeneric || (NonGeneric = {}));
var Generic;
(function(Generic) {
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    var D = /*#__PURE__*/ function(C) {
        "use strict";
        _inherits(D, C);
        var _super = _create_super(D);
        function D() {
            _class_call_check(this, D);
            return _super.apply(this, arguments);
        }
        return D;
    }(C);
    var r = C.prototype; // C<any, any>
    var ra = r.foo; // any
    var r2 = D.prototype; // D<any, any>
    var rb = r2.baz; // any
})(Generic || (Generic = {}));
