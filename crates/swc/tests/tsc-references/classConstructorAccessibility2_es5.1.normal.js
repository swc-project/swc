import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @declaration: true
var BaseA = /*#__PURE__*/ function() {
    "use strict";
    function BaseA(x) {
        _class_call_check(this, BaseA);
        this.x = x;
    }
    var _proto = BaseA.prototype;
    _proto.createInstance = function createInstance() {
        new BaseA(1);
    };
    return BaseA;
}();
var BaseB = /*#__PURE__*/ function() {
    "use strict";
    function BaseB(x) {
        _class_call_check(this, BaseB);
        this.x = x;
    }
    var _proto = BaseB.prototype;
    _proto.createInstance = function createInstance() {
        new BaseB(2);
    };
    return BaseB;
}();
var BaseC = /*#__PURE__*/ function() {
    "use strict";
    function BaseC(x) {
        _class_call_check(this, BaseC);
        this.x = x;
    }
    var _proto = BaseC.prototype;
    _proto.createInstance = function createInstance() {
        new BaseC(3);
    };
    BaseC.staticInstance = function staticInstance() {
        new BaseC(4);
    };
    return BaseC;
}();
var DerivedA = /*#__PURE__*/ function(BaseA1) {
    "use strict";
    _inherits(DerivedA, BaseA1);
    var _super = _create_super(DerivedA);
    function DerivedA(x) {
        _class_call_check(this, DerivedA);
        var _this;
        _this = _super.call(this, x);
        _this.x = x;
        return _this;
    }
    var _proto = DerivedA.prototype;
    _proto.createInstance = function createInstance() {
        new DerivedA(5);
    };
    _proto.createBaseInstance = function createBaseInstance() {
        new BaseA(6);
    };
    DerivedA.staticBaseInstance = function staticBaseInstance() {
        new BaseA(7);
    };
    return DerivedA;
}(BaseA);
var DerivedB = /*#__PURE__*/ function(BaseB1) {
    "use strict";
    _inherits(DerivedB, BaseB1);
    var _super = _create_super(DerivedB);
    function DerivedB(x) {
        _class_call_check(this, DerivedB);
        var _this;
        _this = _super.call(this, x);
        _this.x = x;
        return _this;
    }
    var _proto = DerivedB.prototype;
    _proto.createInstance = function createInstance() {
        new DerivedB(7);
    };
    _proto.createBaseInstance // ok
     = function createBaseInstance() {
        new BaseB(8);
    };
    DerivedB.staticBaseInstance // ok
     = function staticBaseInstance() {
        new BaseB(9);
    };
    return DerivedB;
}(BaseB);
var DerivedC = /*#__PURE__*/ function(BaseC1) {
    "use strict";
    _inherits(DerivedC, BaseC1);
    var _super = _create_super(DerivedC);
    function DerivedC(x) {
        _class_call_check(this, DerivedC);
        var _this;
        _this = _super.call(this, x);
        _this.x = x;
        return _this;
    }
    var _proto = DerivedC.prototype;
    _proto.createInstance = function createInstance() {
        new DerivedC(9);
    };
    _proto.createBaseInstance // error
     = function createBaseInstance() {
        new BaseC(10);
    };
    DerivedC.staticBaseInstance // error
     = function staticBaseInstance() {
        new BaseC(11);
    };
    return DerivedC;
}(BaseC);
var ba = new BaseA(1);
var bb = new BaseB(1); // error
var bc = new BaseC(1); // error
var da = new DerivedA(1);
var db = new DerivedB(1);
var dc = new DerivedC(1);
