import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// checking assignment compatibility relations for function types.
var Errors;
(function(Errors) {
    var Base = function Base() {
        "use strict";
        _class_call_check(this, Base);
    };
    var Derived = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(Derived, Base);
        var _super = _create_super(Derived);
        function Derived() {
            _class_call_check(this, Derived);
            return _super.apply(this, arguments);
        }
        return Derived;
    }(Base);
    var Derived2 = /*#__PURE__*/ function(Derived) {
        "use strict";
        _inherits(Derived2, Derived);
        var _super = _create_super(Derived2);
        function Derived2() {
            _class_call_check(this, Derived2);
            return _super.apply(this, arguments);
        }
        return Derived2;
    }(Derived);
    var OtherDerived = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(OtherDerived, Base);
        var _super = _create_super(OtherDerived);
        function OtherDerived() {
            _class_call_check(this, OtherDerived);
            return _super.apply(this, arguments);
        }
        return OtherDerived;
    }(Base);
    var WithNonGenericSignaturesInBaseType;
    (function(WithNonGenericSignaturesInBaseType) {
        // target type with non-generic call signatures
        var a2;
        var a7;
        var a8;
        var a10;
        var a11;
        var a12;
        var a14;
        var a15;
        var a16;
        var a17;
        var b2;
        a2 = b2; // ok
        b2 = a2; // ok
        var b7;
        a7 = b7; // ok
        b7 = a7; // ok
        var b8;
        a8 = b8; // error, type mismatch
        b8 = a8; // error
        var b10;
        a10 = b10; // ok
        b10 = a10; // ok
        var b11;
        a11 = b11; // ok
        b11 = a11; // ok
        var b12;
        a12 = b12; // ok
        b12 = a12; // ok
        var b15;
        a15 = b15; // ok
        b15 = a15; // ok
        var b15a;
        a15 = b15a; // ok
        b15a = a15; // ok
        var b16;
        a16 = b16; // error
        b16 = a16; // error
        var b17;
        a17 = b17; // error
        b17 = a17; // error
    })(WithNonGenericSignaturesInBaseType || (WithNonGenericSignaturesInBaseType = {}));
    var WithGenericSignaturesInBaseType;
    (function(WithGenericSignaturesInBaseType) {
        // target type has generic call signature
        var a2;
        var b2;
        a2 = b2; // ok
        b2 = a2; // ok
        // target type has generic call signature
        var a3;
        var b3;
        a3 = b3; // ok
        b3 = a3; // ok
    })(WithGenericSignaturesInBaseType || (WithGenericSignaturesInBaseType = {}));
})(Errors || (Errors = {}));
