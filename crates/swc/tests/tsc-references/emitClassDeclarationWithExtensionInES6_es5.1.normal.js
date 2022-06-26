import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @target: es6
var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    var _proto = B.prototype;
    _proto.baz = function baz(a) {
        var y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 10;
    };
    return B;
}();
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {};
    _proto.baz = function baz(a, y) {
        _get(_get_prototype_of(C.prototype), "baz", this).call(this, a, y);
    };
    return C;
}(B);
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        _class_call_check(this, D);
        return _super.call(this);
    }
    var _proto = D.prototype;
    _proto.foo = function foo() {
        _get(_get_prototype_of(D.prototype), "foo", this).call(this);
    };
    _proto.baz = function baz() {
        _get(_get_prototype_of(D.prototype), "baz", this).call(this, "hello", 10);
    };
    return D;
}(C);
