import * as swcHelpers from "@swc/helpers";
var Base = function Base() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        swcHelpers.classCallCheck(this, Derived);
        return _super.apply(this, arguments);
    }
    return Derived;
}(Base);
var Derived2 = /*#__PURE__*/ function(Derived) {
    "use strict";
    swcHelpers.inherits(Derived2, Derived);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        swcHelpers.classCallCheck(this, Derived2);
        return _super.apply(this, arguments);
    }
    return Derived2;
}(Derived);
var TargetHasOptional;
(function(TargetHasOptional) {
    var c;
    var a;
    var b = {
        opt: new Base()
    };
    var d;
    var e;
    var f;
    // disallowed by weak type checking
    c = d;
    c = e;
    c = f;
    a = d;
    a = e;
    a = f;
    b = d;
    b = e;
    b = f;
    // ok
    c = a;
    a = c;
    b = a;
    b = c;
})(TargetHasOptional || (TargetHasOptional = {}));
var SourceHasOptional;
(function(SourceHasOptional) {
    var c;
    var a;
    var b = {
        opt: new Base()
    };
    var d;
    var e;
    var f;
    c = d; // error
    c = e; // error
    c = f; // error
    c = a; // ok
    a = d; // error
    a = e; // error
    a = f; // error
    a = c; // ok
    b = d; // error
    b = e; // error
    b = f; // error
    b = a; // ok
    b = c; // ok
})(SourceHasOptional || (SourceHasOptional = {}));
