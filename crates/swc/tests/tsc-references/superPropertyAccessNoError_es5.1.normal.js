import _assert_this_initialized from "@swc/helpers/lib/_assert_this_initialized.js";
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
        _class_call_check(this, SomeBaseClass);
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
    _inherits(SomeDerivedClass, SomeBaseClass);
    var _super = _create_super(SomeDerivedClass);
    function SomeDerivedClass() {
        _class_call_check(this, SomeDerivedClass);
        var _this = _super.call(this);
        var x = _get((_assert_this_initialized(_this), _get_prototype_of(SomeDerivedClass.prototype)), "func", _this).call(_this);
        var x;
        return _this;
    }
    var _proto = SomeDerivedClass.prototype;
    _proto.fn = function fn() {
        var _this = this;
        var x = _get(_get_prototype_of(SomeDerivedClass.prototype), "func", this).call(this);
        var x;
        var y = function() {
            return _get(_get_prototype_of(SomeDerivedClass.prototype), "func", _this).call(_this);
        };
    };
    _proto.returnThis = function returnThis() {
        return _get(_get_prototype_of(SomeDerivedClass.prototype), "returnThis", this).call(this);
    };
    SomeDerivedClass.fn = function fn() {
        var x = _get(_get_prototype_of(SomeDerivedClass), "func", this).call(this);
        var x;
    };
    _create_class(SomeDerivedClass, [
        {
            key: "a",
            get: function get() {
                var x = _get(_get_prototype_of(SomeDerivedClass.prototype), "func", this).call(this);
                var x;
                return null;
            },
            set: function set(n) {
                var x = _get(_get_prototype_of(SomeDerivedClass.prototype), "func", this).call(this);
                var x;
            }
        }
    ], [
        {
            key: "a",
            get: function get() {
                var x = _get(_get_prototype_of(SomeDerivedClass), "func", this).call(this);
                var x;
                return null;
            },
            set: function set(n) {
                var x = _get(_get_prototype_of(SomeDerivedClass), "func", this).call(this);
                var x;
            }
        }
    ]);
    return SomeDerivedClass;
}(SomeBaseClass);
var instance = new SomeDerivedClass();
instance.returnThis().fn();
