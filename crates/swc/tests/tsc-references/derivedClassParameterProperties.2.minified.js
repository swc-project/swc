//// [derivedClassParameterProperties.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
}, Derived = function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived(y) {
        return _class_call_check(this, Derived), _super.call(this);
    }
    return Derived;
}(Base), Derived2 = function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2(y) {
        var _this;
        return _class_call_check(this, Derived2), (_this = _super.call(this)).y = y, _this;
    }
    return Derived2;
}(Base), Derived3 = function(Base) {
    "use strict";
    _inherits(Derived3, Base);
    var _super = _create_super(Derived3);
    function Derived3(y) {
        var _this;
        return _class_call_check(this, Derived3), (_this = _super.call(this)).y = y, _this;
    }
    return Derived3;
}(Base), Derived4 = function(Base) {
    "use strict";
    _inherits(Derived4, Base);
    var _super = _create_super(Derived4);
    function Derived4(y) {
        var _this;
        return _class_call_check(this, Derived4), (_this = _super.call(this)).a = 1, _this;
    }
    return Derived4;
}(Base), Derived5 = function(Base) {
    "use strict";
    _inherits(Derived5, Base);
    var _super = _create_super(Derived5);
    function Derived5(y) {
        var _this;
        return _class_call_check(this, Derived5), (_this = _super.call(this)).a = 1, _this;
    }
    return Derived5;
}(Base), Derived6 = function(Base) {
    "use strict";
    _inherits(Derived6, Base);
    var _super = _create_super(Derived6);
    function Derived6(y) {
        var _this;
        return _class_call_check(this, Derived6), _this.a = 1, _this = _super.call(this);
    }
    return Derived6;
}(Base), Derived7 = function(Base) {
    "use strict";
    _inherits(Derived7, Base);
    var _super = _create_super(Derived7);
    function Derived7(y) {
        var _this;
        return _class_call_check(this, Derived7), _this.a = 3, _this.b = 3, (_this = _super.call(this)).a = 1, _this;
    }
    return Derived7;
}(Base), Derived8 = function(Base) {
    "use strict";
    _inherits(Derived8, Base);
    var _super = _create_super(Derived8);
    function Derived8(y) {
        var _this;
        return _class_call_check(this, Derived8), (_this = _super.call(this)).a = 1, _this.a = 3, _this.b = 3, _this;
    }
    return Derived8;
}(Base), Base2 = function Base2() {
    "use strict";
    _class_call_check(this, Base2);
}, Derived9 = function(Base2) {
    "use strict";
    _inherits(Derived9, Base2);
    var _super = _create_super(Derived9);
    function Derived9(y) {
        var _this;
        return _class_call_check(this, Derived9), _this.a = 3, _this.b = 3, (_this = _super.call(this)).a = 1, _this;
    }
    return Derived9;
}(Base2), Derived10 = function(Base2) {
    "use strict";
    _inherits(Derived10, Base2);
    var _super = _create_super(Derived10);
    function Derived10(y) {
        var _this;
        return _class_call_check(this, Derived10), (_this = _super.call(this)).a = 1, _this.a = 3, _this.b = 3, _this;
    }
    return Derived10;
}(Base2);
