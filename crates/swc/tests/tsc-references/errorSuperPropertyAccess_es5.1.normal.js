import * as swcHelpers from "@swc/helpers";
//super property access in constructor of class with no base type
//super property access in instance member function of class with no base type
//super property access in instance member accessor(get and set) of class with no base type
var NoBase = /*#__PURE__*/ function() {
    "use strict";
    function NoBase() {
        swcHelpers.classCallCheck(this, NoBase);
        this.m = swcHelpers.get(swcHelpers.getPrototypeOf(NoBase.prototype), "prototype", this);
        this.n = swcHelpers.get(swcHelpers.getPrototypeOf(NoBase.prototype), "hasOwnProperty", this).call(this, '');
        var a = swcHelpers.get(swcHelpers.getPrototypeOf(NoBase.prototype), "prototype", this);
        var b = swcHelpers.get(swcHelpers.getPrototypeOf(NoBase.prototype), "hasOwnProperty", this).call(this, '');
    }
    var _proto = NoBase.prototype;
    _proto.fn = function fn() {
        var a = swcHelpers.get(swcHelpers.getPrototypeOf(NoBase.prototype), "prototype", this);
        var b = swcHelpers.get(swcHelpers.getPrototypeOf(NoBase.prototype), "hasOwnProperty", this).call(this, '');
    };
    //super static property access in static member function of class with no base type
    //super static property access in static member accessor(get and set) of class with no base type
    NoBase.static1 = function static1() {
        swcHelpers.get(swcHelpers.getPrototypeOf(NoBase), "hasOwnProperty", this).call(this, '');
    };
    swcHelpers.createClass(NoBase, null, [
        {
            key: "static2",
            get: function get() {
                swcHelpers.get(swcHelpers.getPrototypeOf(NoBase), "hasOwnProperty", this).call(this, '');
                return '';
            },
            set: function set(n) {
                swcHelpers.get(swcHelpers.getPrototypeOf(NoBase), "hasOwnProperty", this).call(this, '');
            }
        }
    ]);
    return NoBase;
}();
var SomeBase = /*#__PURE__*/ function() {
    "use strict";
    function SomeBase() {
        swcHelpers.classCallCheck(this, SomeBase);
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
    swcHelpers.inherits(SomeDerived1, SomeBase);
    var _super = swcHelpers.createSuper(SomeDerived1);
    function SomeDerived1() {
        swcHelpers.classCallCheck(this, SomeDerived1);
        var _this = _super.call(this);
        swcHelpers.set((swcHelpers.assertThisInitialized(_this), swcHelpers.getPrototypeOf(SomeDerived1.prototype)), "publicMember", 1, _this, true);
        return _this;
    }
    var _proto = SomeDerived1.prototype;
    _proto.fn = function fn() {
        var x = swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerived1.prototype), "publicMember", this);
    };
    _proto.fn2 = function fn2() {
        var inner = function inner() {
            swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerived1.prototype), "publicFunc", this).call(this);
        };
        var x = {
            test: function test() {
                return swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerived1.prototype), "publicFunc", this).call(this);
            }
        };
    };
    swcHelpers.createClass(SomeDerived1, [
        {
            key: "a",
            get: function get() {
                var x = swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerived1.prototype), "publicMember", this);
                return undefined;
            },
            set: function set(n) {
                n = swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerived1.prototype), "publicMember", this);
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
    swcHelpers.inherits(SomeDerived2, SomeBase);
    var _super = swcHelpers.createSuper(SomeDerived2);
    function SomeDerived2() {
        swcHelpers.classCallCheck(this, SomeDerived2);
        var _this = _super.call(this);
        swcHelpers.set((swcHelpers.assertThisInitialized(_this), swcHelpers.getPrototypeOf(SomeDerived2.prototype)), "privateMember", 1, _this, true);
        return _this;
    }
    var _proto = SomeDerived2.prototype;
    _proto.fn = function fn() {
        var x = swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerived2.prototype), "privateMember", this);
    };
    swcHelpers.createClass(SomeDerived2, [
        {
            key: "a",
            get: function get() {
                var x = swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerived2.prototype), "privateMember", this);
                return undefined;
            },
            set: function set(n) {
                n = swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerived2.prototype), "privateMember", this);
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
    swcHelpers.inherits(SomeDerived3, SomeBase);
    var _super = swcHelpers.createSuper(SomeDerived3);
    function SomeDerived3() {
        swcHelpers.classCallCheck(this, SomeDerived3);
        return _super.apply(this, arguments);
    }
    SomeDerived3.fn = function fn() {
        swcHelpers.set(swcHelpers.getPrototypeOf(SomeDerived3.prototype), "publicStaticMember", 3, this, true);
        swcHelpers.set(swcHelpers.getPrototypeOf(SomeDerived3.prototype), "privateStaticMember", 3, this, true);
        swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerived3), "privateStaticFunc", this).call(this);
    };
    swcHelpers.createClass(SomeDerived3, null, [
        {
            key: "a",
            get: function get() {
                swcHelpers.set(swcHelpers.getPrototypeOf(SomeDerived3.prototype), "publicStaticMember", 3, this, true);
                swcHelpers.set(swcHelpers.getPrototypeOf(SomeDerived3.prototype), "privateStaticMember", 3, this, true);
                swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerived3), "privateStaticFunc", this).call(this);
                return '';
            },
            set: function set(n) {
                swcHelpers.set(swcHelpers.getPrototypeOf(SomeDerived3.prototype), "publicStaticMember", 3, this, true);
                swcHelpers.set(swcHelpers.getPrototypeOf(SomeDerived3.prototype), "privateStaticMember", 3, this, true);
                swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerived3), "privateStaticFunc", this).call(this);
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
