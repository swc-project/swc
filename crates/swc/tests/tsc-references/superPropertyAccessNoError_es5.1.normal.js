import * as swcHelpers from "@swc/helpers";
var SomeBaseClass = // @target: es5
//super.publicInstanceMemberFunction in constructor of derived class
//super.publicInstanceMemberFunction in instance member function of derived class
//super.publicInstanceMemberFunction in instance member accessor(get and set) of derived class
//super.publicInstanceMemberFunction in lambda in member function
//super.publicStaticMemberFunction in static member function of derived class
//super.publicStaticMemberFunction in static member accessor(get and set) of derived class
/*#__PURE__*/ function() {
    "use strict";
    function SomeBaseClass() {
        swcHelpers.classCallCheck(this, SomeBaseClass);
    }
    swcHelpers.createClass(SomeBaseClass, [
        {
            key: "func",
            value: function func() {
                return '';
            }
        },
        {
            key: "returnThis",
            value: function returnThis() {
                return this;
            }
        }
    ], [
        {
            key: "func",
            value: function func() {
                return 3;
            }
        }
    ]);
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
    swcHelpers.createClass(SomeDerivedClass, [
        {
            key: "fn",
            value: function fn() {
                var _this = this;
                var x = swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass.prototype), "func", this).call(this);
                var x;
                var y = function() {
                    return swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass.prototype), "func", _this).call(_this);
                };
            }
        },
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
        },
        {
            key: "returnThis",
            value: function returnThis() {
                return swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass.prototype), "returnThis", this).call(this);
            }
        }
    ], [
        {
            key: "fn",
            value: function fn() {
                var x = swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerivedClass), "func", this).call(this);
                var x;
            }
        },
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
