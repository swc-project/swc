import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var B = function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    return B.prototype.baz = function(a) {
        arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
    }, B;
}(), C = function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    var _proto = C.prototype;
    return _proto.foo = function() {}, _proto.baz = function(a, y) {
        _get(_get_prototype_of(C.prototype), "baz", this).call(this, a, y);
    }, C;
}(B), D = function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.call(this);
    }
    var _proto = D.prototype;
    return _proto.foo = function() {
        _get(_get_prototype_of(D.prototype), "foo", this).call(this);
    }, _proto.baz = function() {
        _get(_get_prototype_of(D.prototype), "baz", this).call(this, "hello", 10);
    }, D;
}(C);
