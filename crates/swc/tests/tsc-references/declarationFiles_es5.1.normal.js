import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @declaration: true
var C1 = /*#__PURE__*/ function() {
    "use strict";
    function C1(x) {
        _class_call_check(this, C1);
    }
    var _proto = C1.prototype;
    _proto.f = function f(x) {
        return undefined;
    };
    return C1;
}();
var C2 = function C2() {
    "use strict";
    _class_call_check(this, C2);
};
var C3 = function C3() {
    "use strict";
    _class_call_check(this, C3);
};
var C4 = /*#__PURE__*/ function() {
    "use strict";
    function C4() {
        var _this = this;
        _class_call_check(this, C4);
        this.x1 = {
            a: this
        };
        this.x2 = [
            this
        ];
        this.x3 = [
            {
                a: this
            }
        ];
        this.x4 = function() {
            return _this;
        };
    }
    var _proto = C4.prototype;
    _proto.f1 = function f1() {
        return {
            a: this
        };
    };
    _proto.f2 = function f2() {
        return [
            this
        ];
    };
    _proto.f3 = function f3() {
        return [
            {
                a: this
            }
        ];
    };
    _proto.f4 = function f4() {
        var _this = this;
        return function() {
            return _this;
        };
    };
    return C4;
}();
