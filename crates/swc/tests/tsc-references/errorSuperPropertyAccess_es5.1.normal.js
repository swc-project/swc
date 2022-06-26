import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _set from "@swc/helpers/src/_set.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
//super property access in constructor of class with no base type
//super property access in instance member function of class with no base type
//super property access in instance member accessor(get and set) of class with no base type
var NoBase = /*#__PURE__*/ function() {
    "use strict";
    function NoBase() {
        _class_call_check(this, NoBase);
        this.m = _get(_get_prototype_of(NoBase.prototype), "prototype", this);
        this.n = _get(_get_prototype_of(NoBase.prototype), "hasOwnProperty", this).call(this, "");
        var a = _get(_get_prototype_of(NoBase.prototype), "prototype", this);
        var b = _get(_get_prototype_of(NoBase.prototype), "hasOwnProperty", this).call(this, "");
    }
    var _proto = NoBase.prototype;
    _proto.fn = function fn() {
        var a = _get(_get_prototype_of(NoBase.prototype), "prototype", this);
        var b = _get(_get_prototype_of(NoBase.prototype), "hasOwnProperty", this).call(this, "");
    };
    //super static property access in static member function of class with no base type
    //super static property access in static member accessor(get and set) of class with no base type
    NoBase.static1 = function static1() {
        _get(_get_prototype_of(NoBase), "hasOwnProperty", this).call(this, "");
    };
    _create_class(NoBase, null, [
        {
            key: "static2",
            get: function get() {
                _get(_get_prototype_of(NoBase), "hasOwnProperty", this).call(this, "");
                return "";
            },
            set: function set(n) {
                _get(_get_prototype_of(NoBase), "hasOwnProperty", this).call(this, "");
            }
        }
    ]);
    return NoBase;
}();
var SomeBase = /*#__PURE__*/ function() {
    "use strict";
    function SomeBase() {
        _class_call_check(this, SomeBase);
        this.privateMember = 0;
        this.publicMember = 0;
    }
    var _proto = SomeBase.prototype;
    _proto.privateFunc = function privateFunc() {};
    _proto.publicFunc = function publicFunc() {};
    SomeBase.privateStaticFunc = function privateStaticFunc() {};
    SomeBase.publicStaticFunc = function publicStaticFunc() {};
    return SomeBase;
}();
SomeBase.privateStaticMember = 0;
SomeBase.publicStaticMember = 0;
//super.publicInstanceMemberNotFunction in constructor of derived class
//super.publicInstanceMemberNotFunction in instance member function of derived class
//super.publicInstanceMemberNotFunction in instance member accessor(get and set) of derived class
//super property access only available with typed this
var SomeDerived1 = /*#__PURE__*/ function(SomeBase) {
    "use strict";
    _inherits(SomeDerived1, SomeBase);
    var _super = _create_super(SomeDerived1);
    function SomeDerived1() {
        _class_call_check(this, SomeDerived1);
        var _this = _super.call(this);
        _set((_assert_this_initialized(_this), _get_prototype_of(SomeDerived1.prototype)), "publicMember", 1, _this, true);
        return _this;
    }
    var _proto = SomeDerived1.prototype;
    _proto.fn = function fn() {
        var x = _get(_get_prototype_of(SomeDerived1.prototype), "publicMember", this);
    };
    _proto.fn2 = function fn2() {
        var inner = function inner() {
            _get(_get_prototype_of(SomeDerived1.prototype), "publicFunc", this).call(this);
        };
        var x = {
            test: function test() {
                return _get(_get_prototype_of(SomeDerived1.prototype), "publicFunc", this).call(this);
            }
        };
    };
    _create_class(SomeDerived1, [
        {
            key: "a",
            get: function get() {
                var x = _get(_get_prototype_of(SomeDerived1.prototype), "publicMember", this);
                return undefined;
            },
            set: function set(n) {
                n = _get(_get_prototype_of(SomeDerived1.prototype), "publicMember", this);
            }
        }
    ]);
    return SomeDerived1;
}(SomeBase);
//super.privateProperty in constructor of derived class
//super.privateProperty in instance member function of derived class
//super.privateProperty in instance member accessor(get and set) of derived class
var SomeDerived2 = /*#__PURE__*/ function(SomeBase) {
    "use strict";
    _inherits(SomeDerived2, SomeBase);
    var _super = _create_super(SomeDerived2);
    function SomeDerived2() {
        _class_call_check(this, SomeDerived2);
        var _this = _super.call(this);
        _set((_assert_this_initialized(_this), _get_prototype_of(SomeDerived2.prototype)), "privateMember", 1, _this, true);
        return _this;
    }
    var _proto = SomeDerived2.prototype;
    _proto.fn = function fn() {
        var x = _get(_get_prototype_of(SomeDerived2.prototype), "privateMember", this);
    };
    _create_class(SomeDerived2, [
        {
            key: "a",
            get: function get() {
                var x = _get(_get_prototype_of(SomeDerived2.prototype), "privateMember", this);
                return undefined;
            },
            set: function set(n) {
                n = _get(_get_prototype_of(SomeDerived2.prototype), "privateMember", this);
            }
        }
    ]);
    return SomeDerived2;
}(SomeBase);
//super.publicStaticMemberNotFunction in static member function of derived class
//super.publicStaticMemberNotFunction in static member accessor(get and set) of derived class
//super.privateStaticProperty in static member function of derived class
//super.privateStaticProperty in static member accessor(get and set) of derived class
var SomeDerived3 = /*#__PURE__*/ function(SomeBase) {
    "use strict";
    _inherits(SomeDerived3, SomeBase);
    var _super = _create_super(SomeDerived3);
    function SomeDerived3() {
        _class_call_check(this, SomeDerived3);
        return _super.apply(this, arguments);
    }
    SomeDerived3.fn = function fn() {
        _set(_get_prototype_of(SomeDerived3.prototype), "publicStaticMember", 3, this, true);
        _set(_get_prototype_of(SomeDerived3.prototype), "privateStaticMember", 3, this, true);
        _get(_get_prototype_of(SomeDerived3), "privateStaticFunc", this).call(this);
    };
    _create_class(SomeDerived3, null, [
        {
            key: "a",
            get: function get() {
                _set(_get_prototype_of(SomeDerived3.prototype), "publicStaticMember", 3, this, true);
                _set(_get_prototype_of(SomeDerived3.prototype), "privateStaticMember", 3, this, true);
                _get(_get_prototype_of(SomeDerived3), "privateStaticFunc", this).call(this);
                return "";
            },
            set: function set(n) {
                _set(_get_prototype_of(SomeDerived3.prototype), "publicStaticMember", 3, this, true);
                _set(_get_prototype_of(SomeDerived3.prototype), "privateStaticMember", 3, this, true);
                _get(_get_prototype_of(SomeDerived3), "privateStaticFunc", this).call(this);
            }
        }
    ]);
    return SomeDerived3;
}(SomeBase);
// In object literal
var obj = {
    n: super.wat,
    p: super.foo()
};
