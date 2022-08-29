//// [derivedClassParameterProperties.ts]
// ordering of super calls in derived constructors matters depending on other class contents
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived(y) {
        _class_call_check(this, Derived);
        var a = 1;
        return _super.call(this);
    }
    return Derived;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2(y) {
        _class_call_check(this, Derived2);
        var _this;
        var a = 1;
        _this = _super.call(this);
        _this.y = y;
        return _this;
    }
    return Derived2;
}(Base);
var Derived3 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived3, Base);
    var _super = _create_super(Derived3);
    function Derived3(y) {
        _class_call_check(this, Derived3);
        var _this;
        _this = _super.call(this);
        _this.y = y;
        var a = 1;
        return _this;
    }
    return Derived3;
}(Base);
var Derived4 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived4, Base);
    var _super = _create_super(Derived4);
    function Derived4(y) {
        _class_call_check(this, Derived4);
        var _this;
        var b = 2;
        _this = _super.call(this);
        _this.a = 1;
        return _this;
    }
    return Derived4;
}(Base);
var Derived5 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived5, Base);
    var _super = _create_super(Derived5);
    function Derived5(y) {
        _class_call_check(this, Derived5);
        var _this;
        _this = _super.call(this);
        _this.a = 1;
        var b = 2;
        return _this;
    }
    return Derived5;
}(Base);
var Derived6 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived6, Base);
    var _super = _create_super(Derived6);
    function Derived6(y) {
        _class_call_check(this, Derived6);
        var _this;
        _this.a = 1;
        var b = 2;
        _this = _super.call(this);
        return _this;
    }
    return Derived6;
}(Base);
var Derived7 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived7, Base);
    var _super = _create_super(Derived7);
    function Derived7(y) {
        _class_call_check(this, Derived7);
        var _this;
        _this.a = 3;
        _this.b = 3;
        _this = _super.call(this);
        _this.a = 1;
        return _this;
    }
    return Derived7;
}(Base);
var Derived8 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived8, Base);
    var _super = _create_super(Derived8);
    function Derived8(y) {
        _class_call_check(this, Derived8);
        var _this;
        _this = _super.call(this);
        _this.a = 1;
        _this.a = 3;
        _this.b = 3;
        return _this;
    }
    return Derived8;
}(Base);
// generic cases of Derived7 and Derived8
var Base2 = function Base2() {
    "use strict";
    _class_call_check(this, Base2);
};
var Derived9 = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(Derived9, Base2);
    var _super = _create_super(Derived9);
    function Derived9(y) {
        _class_call_check(this, Derived9);
        var _this;
        _this.a = 3;
        _this.b = 3;
        _this = _super.call(this);
        _this.a = 1;
        return _this;
    }
    return Derived9;
}(Base2);
var Derived10 = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(Derived10, Base2);
    var _super = _create_super(Derived10);
    function Derived10(y) {
        _class_call_check(this, Derived10);
        var _this;
        _this = _super.call(this);
        _this.a = 1;
        _this.a = 3;
        _this.b = 3;
        return _this;
    }
    return Derived10;
}(Base2);
