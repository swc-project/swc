import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @target: ES5
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
    var _super = _create_super(Derived1);
    function Derived1(a) {
        _class_call_check(this, Derived1);
        return _super.call(this, a);
    }
    return Derived1;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2(a) {
        _class_call_check(this, Derived2);
        return _super.call(this, a);
    }
    var _proto = Derived2.prototype;
    _proto.b = function b(a) {};
    return Derived2;
}(Base);
var Derived3 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived3, Base);
    var _super = _create_super(Derived3);
    function Derived3(a) {
        _class_call_check(this, Derived3);
        return _super.call(this, a);
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
    var _super = _create_super(Derived4);
    function Derived4(a) {
        _class_call_check(this, Derived4);
        return _super.call(this, a);
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
    var _super = _create_super(Derived5);
    function Derived5(a) {
        _class_call_check(this, Derived5);
        return _super.call(this, a);
    }
    return Derived5;
}(Base);
var Derived6 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived6, Base);
    var _super = _create_super(Derived6);
    function Derived6(a) {
        _class_call_check(this, Derived6);
        return _super.call(this, a);
    }
    return Derived6;
}(Base);
var Derived7 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived7, Base);
    var _super = _create_super(Derived7);
    function Derived7(a) {
        _class_call_check(this, Derived7);
        return _super.call(this, a);
    }
    Derived7.s = function s(a) {};
    return Derived7;
}(Base);
var Derived8 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived8, Base);
    var _super = _create_super(Derived8);
    function Derived8(a) {
        _class_call_check(this, Derived8);
        return _super.call(this, a);
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
    var _super = _create_super(Derived9);
    function Derived9(a) {
        _class_call_check(this, Derived9);
        return _super.call(this, a);
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
    var _super = _create_super(Derived10);
    function Derived10(a) {
        _class_call_check(this, Derived10);
        return _super.call(this, a);
    }
    return Derived10;
}(Base);
