//// [constructorHasPrototypeProperty.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
(function(NonGeneric) {
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    var D = /*#__PURE__*/ function(C) {
        "use strict";
        _inherits(D, C);
        function D() {
            _class_call_check(this, D);
            return _call_super(this, D, arguments);
        }
        return D;
    }(C);
    var r = C.prototype;
    r.foo;
    var r2 = D.prototype;
    r2.bar;
})(NonGeneric || (NonGeneric = {}));
(function(Generic) {
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    var D = /*#__PURE__*/ function(C) {
        "use strict";
        _inherits(D, C);
        function D() {
            _class_call_check(this, D);
            return _call_super(this, D, arguments);
        }
        return D;
    }(C);
    var r = C.prototype; // C<any, any>
    var ra = r.foo; // any
    var r2 = D.prototype; // D<any, any>
    var rb = r2.baz; // any
})(Generic || (Generic = {}));
var NonGeneric, Generic;
