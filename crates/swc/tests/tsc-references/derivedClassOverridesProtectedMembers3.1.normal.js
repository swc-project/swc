//// [derivedClassOverridesProtectedMembers3.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var x;
var y;
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base(a) {
        _class_call_check(this, Base);
    }
    var _proto = Base.prototype;
    _proto.b = function b(a) {};
    Base.s = function s(a) {};
    _create_class(Base, [
        {
            key: "c",
            get: function get() {
                return x;
            },
            set: function set(v) {}
        }
    ], [
        {
            key: "t",
            get: function get() {
                return x;
            },
            set: function set(v) {}
        }
    ]);
    return Base;
}();
// Errors
// decrease visibility of all public members to protected
var Derived1 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    function Derived1(a) {
        _class_call_check(this, Derived1);
        return _call_super(this, Derived1, [
            a
        ]);
    }
    return Derived1;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    function Derived2(a) {
        _class_call_check(this, Derived2);
        return _call_super(this, Derived2, [
            a
        ]);
    }
    var _proto = Derived2.prototype;
    _proto.b = function b(a) {};
    return Derived2;
}(Base);
var Derived3 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived3, Base);
    function Derived3(a) {
        _class_call_check(this, Derived3);
        return _call_super(this, Derived3, [
            a
        ]);
    }
    _create_class(Derived3, [
        {
            key: "c",
            get: function get() {
                return x;
            }
        }
    ]);
    return Derived3;
}(Base);
var Derived4 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived4, Base);
    function Derived4(a) {
        _class_call_check(this, Derived4);
        return _call_super(this, Derived4, [
            a
        ]);
    }
    _create_class(Derived4, [
        {
            key: "c",
            set: function set(v) {}
        }
    ]);
    return Derived4;
}(Base);
var Derived5 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived5, Base);
    function Derived5(a) {
        _class_call_check(this, Derived5);
        return _call_super(this, Derived5, [
            a
        ]);
    }
    return Derived5;
}(Base);
var Derived6 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived6, Base);
    function Derived6(a) {
        _class_call_check(this, Derived6);
        return _call_super(this, Derived6, [
            a
        ]);
    }
    return Derived6;
}(Base);
var Derived7 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived7, Base);
    function Derived7(a) {
        _class_call_check(this, Derived7);
        return _call_super(this, Derived7, [
            a
        ]);
    }
    Derived7.s = function s(a) {};
    return Derived7;
}(Base);
var Derived8 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived8, Base);
    function Derived8(a) {
        _class_call_check(this, Derived8);
        return _call_super(this, Derived8, [
            a
        ]);
    }
    _create_class(Derived8, null, [
        {
            key: "t",
            get: function get() {
                return x;
            }
        }
    ]);
    return Derived8;
}(Base);
var Derived9 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived9, Base);
    function Derived9(a) {
        _class_call_check(this, Derived9);
        return _call_super(this, Derived9, [
            a
        ]);
    }
    _create_class(Derived9, null, [
        {
            key: "t",
            set: function set(v) {}
        }
    ]);
    return Derived9;
}(Base);
var Derived10 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived10, Base);
    function Derived10(a) {
        _class_call_check(this, Derived10);
        return _call_super(this, Derived10, [
            a
        ]);
    }
    return Derived10;
}(Base);
