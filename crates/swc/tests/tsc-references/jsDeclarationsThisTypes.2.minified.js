//// [index.js]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
export var A = /*#__PURE__*/ function() {
    function A() {
        _class_call_check(this, A);
    }
    return A.prototype.method = function() {
        return this;
    }, A;
}();
var Base = /*#__PURE__*/ function(A) {
    function Base() {
        return _class_call_check(this, Base), _call_super(this, Base, arguments);
    }
    return _inherits(Base, A), Base.prototype.verify = function() {}, Base;
}(A);
export { Base as default };
