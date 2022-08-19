import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
export var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    return _proto.method = function() {
        return this;
    }, A;
}();
var Base = function(A) {
    "use strict";
    _inherits(Base, A);
    var _super = _create_super(Base);
    function Base() {
        return _class_call_check(this, Base), _super.apply(this, arguments);
    }
    var _proto = Base.prototype;
    return _proto.verify = function() {}, Base;
}(A);
export { Base as default };
