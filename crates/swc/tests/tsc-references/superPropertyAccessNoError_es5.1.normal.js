import * as swcHelpers from "@swc/helpers";
// @target: es5
//super.publicInstanceMemberFunction in constructor of derived class
//super.publicInstanceMemberFunction in instance member function of derived class
//super.publicInstanceMemberFunction in instance member accessor(get and set) of derived class
//super.publicInstanceMemberFunction in lambda in member function
//super.publicStaticMemberFunction in static member function of derived class
//super.publicStaticMemberFunction in static member accessor(get and set) of derived class
var SomeBaseClass = /*#__PURE__*/ function() {
    "use strict";
    function SomeBaseClass() {
        swcHelpers.classCallCheck(this, SomeBaseClass);
    }
    var _proto = SomeBaseClass.prototype;
    _proto.func = function func() {
        return "";
    };
    _proto.returnThis = function returnThis() {
        return this;
    };
    SomeBaseClass.func = function func() {
        return 3;
    };
    return SomeBaseClass;
}();
var SomeDerivedClass = /*#__PURE__*/ function(SomeBaseClass) {
    "use strict";
    swcHelpers.inherits(SomeDerivedClass, SomeBaseClass);
    var _super = swcHelpers.createSuper(SomeDerivedClass);
    function SomeDerivedClass() {
        swcHelpers.classCallCheck(this, SomeDerivedClass);
        var _this = _super.call(this);
        var x = swcHelpers.get((swcHelpers.assertThisInitialized(_this), swcHelpers.getPrototypeOf(SomeDerivedClass.prototype)), "func", _this).call(_this);
        var x;
        return _this;
    }
    var _proto = SomeDerivedClass.prototype;
    _proto.fn = function fn() {
        var _this = this;
        var x = swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass.prototype), "func", this).call(this);
        var x;
        var y = function() {
            return swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass.prototype), "func", _this).call(_this);
        };
    };
    _proto.returnThis = function returnThis() {
        return swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass.prototype), "returnThis", this).call(this);
    };
    SomeDerivedClass.fn = function fn() {
        var x = swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass), "func", this).call(this);
        var x;
    };
    swcHelpers.createClass(SomeDerivedClass, [
        {
            key: "a",
            get: function get() {
                var x = swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass.prototype), "func", this).call(this);
                var x;
                return null;
            },
            set: function set(n) {
                var x = swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass.prototype), "func", this).call(this);
                var x;
            }
        }
    ], [
        {
            key: "a",
            get: function get() {
                var x = swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass), "func", this).call(this);
                var x;
                return null;
            },
            set: function set(n) {
                var x = swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass), "func", this).call(this);
                var x;
            }
        }
    ]);
    return SomeDerivedClass;
}(SomeBaseClass);
var instance = new SomeDerivedClass();
instance.returnThis().fn();
