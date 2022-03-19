var Errors, WithGenericSignaturesInBaseType;
import * as swcHelpers from "@swc/helpers";
!function(Errors) {
    var Base1 = function() {
        "use strict";
        swcHelpers.classCallCheck(this, Base1);
    }, Derived = function(Base) {
        "use strict";
        swcHelpers.inherits(Derived, Base);
        var _super = swcHelpers.createSuper(Derived);
        function Derived() {
            return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
        }
        return Derived;
    }(Base1), Derived2 = function(Derived) {
        "use strict";
        swcHelpers.inherits(Derived2, Derived);
        var _super = swcHelpers.createSuper(Derived2);
        function Derived2() {
            return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
        }
        return Derived2;
    }(Derived), OtherDerived = function(Base) {
        "use strict";
        swcHelpers.inherits(OtherDerived, Base);
        var _super = swcHelpers.createSuper(OtherDerived);
        function OtherDerived() {
            return swcHelpers.classCallCheck(this, OtherDerived), _super.apply(this, arguments);
        }
        return OtherDerived;
    }(Base1);
    foo2(function(x) {
        return null;
    }), foo7(function(x) {
        return function(r) {
            return null;
        };
    }), foo8(function(x, y) {
        return function(r) {
            return null;
        };
    }), foo10(function() {
        for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++)x[_key] = arguments[_key];
        return null;
    }), foo11(function(x, y) {
        return null;
    }), foo12(function(x, y) {
        return null;
    }), foo15(function(x) {
        return null;
    }), foo15(function(x) {
        return 1;
    }), foo16(function(x) {
        return null;
    }), foo17(function(x) {
        return null;
    });
}(Errors || (Errors = {})), WithGenericSignaturesInBaseType || (WithGenericSignaturesInBaseType = {}), foo2(function(x) {
    return [
        ''
    ];
}), foo3(function(x) {
    return null;
});
