import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var x, Base = function() {
    "use strict";
    function Base(a) {
        _class_call_check(this, Base);
    }
    return Base.prototype.b = function(a) {}, Base.s = function(a) {}, _create_class(Base, [
        {
            key: "c",
            get: function() {
                return x;
            },
            set: function(v) {}
        }
    ], [
        {
            key: "t",
            get: function() {
                return x;
            },
            set: function(v) {}
        }
    ]), Base;
}(), Derived1 = function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    var _super = _create_super(Derived1);
    function Derived1(a) {
        return _class_call_check(this, Derived1), _super.call(this, a);
    }
    return Derived1;
}(Base), Derived2 = function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2(a) {
        return _class_call_check(this, Derived2), _super.call(this, a);
    }
    return Derived2.prototype.b = function(a) {}, Derived2;
}(Base), Derived3 = function(Base) {
    "use strict";
    _inherits(Derived3, Base);
    var _super = _create_super(Derived3);
    function Derived3(a) {
        return _class_call_check(this, Derived3), _super.call(this, a);
    }
    return _create_class(Derived3, [
        {
            key: "c",
            get: function() {
                return x;
            }
        }
    ]), Derived3;
}(Base), Derived4 = function(Base) {
    "use strict";
    _inherits(Derived4, Base);
    var _super = _create_super(Derived4);
    function Derived4(a) {
        return _class_call_check(this, Derived4), _super.call(this, a);
    }
    return _create_class(Derived4, [
        {
            key: "c",
            set: function(v) {}
        }
    ]), Derived4;
}(Base), Derived5 = function(Base) {
    "use strict";
    _inherits(Derived5, Base);
    var _super = _create_super(Derived5);
    function Derived5(a) {
        return _class_call_check(this, Derived5), _super.call(this, a);
    }
    return Derived5;
}(Base), Derived6 = function(Base) {
    "use strict";
    _inherits(Derived6, Base);
    var _super = _create_super(Derived6);
    function Derived6(a) {
        return _class_call_check(this, Derived6), _super.call(this, a);
    }
    return Derived6;
}(Base), Derived7 = function(Base) {
    "use strict";
    _inherits(Derived7, Base);
    var _super = _create_super(Derived7);
    function Derived7(a) {
        return _class_call_check(this, Derived7), _super.call(this, a);
    }
    return Derived7.s = function(a) {}, Derived7;
}(Base), Derived8 = function(Base) {
    "use strict";
    _inherits(Derived8, Base);
    var _super = _create_super(Derived8);
    function Derived8(a) {
        return _class_call_check(this, Derived8), _super.call(this, a);
    }
    return _create_class(Derived8, null, [
        {
            key: "t",
            get: function() {
                return x;
            }
        }
    ]), Derived8;
}(Base), Derived9 = function(Base) {
    "use strict";
    _inherits(Derived9, Base);
    var _super = _create_super(Derived9);
    function Derived9(a) {
        return _class_call_check(this, Derived9), _super.call(this, a);
    }
    return _create_class(Derived9, null, [
        {
            key: "t",
            set: function(v) {}
        }
    ]), Derived9;
}(Base), Derived10 = function(Base) {
    "use strict";
    _inherits(Derived10, Base);
    var _super = _create_super(Derived10);
    function Derived10(a) {
        return _class_call_check(this, Derived10), _super.call(this, a);
    }
    return Derived10;
}(Base);
