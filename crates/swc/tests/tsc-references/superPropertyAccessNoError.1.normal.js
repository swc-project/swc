//// [superPropertyAccessNoError.ts]
//super.publicInstanceMemberFunction in constructor of derived class
//super.publicInstanceMemberFunction in instance member function of derived class
//super.publicInstanceMemberFunction in instance member accessor(get and set) of derived class
//super.publicInstanceMemberFunction in lambda in member function
//super.publicStaticMemberFunction in static member function of derived class
//super.publicStaticMemberFunction in static member accessor(get and set) of derived class
import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var SomeBaseClass = /*#__PURE__*/ function() {
    "use strict";
    function SomeBaseClass() {
        _class_call_check(this, SomeBaseClass);
    }
    var _proto = SomeBaseClass.prototype;
    _proto.func = function func() {
        return '';
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
    function SomeDerivedClass() {
        _class_call_check(this, SomeDerivedClass);
        var _this;
        _this = _call_super(this, SomeDerivedClass);
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
