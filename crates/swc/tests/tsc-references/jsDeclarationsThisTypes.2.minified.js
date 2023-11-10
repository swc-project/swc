//// [index.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
export var A = function() {
    function A() {
        _class_call_check(this, A);
    }
    return A.prototype.method = function() {
        return this;
    }, A;
}();
var Base = function(A) {
    _inherits(Base, A);
    var _super = _create_super(Base);
    function Base() {
        return _class_call_check(this, Base), _super.apply(this, arguments);
    }
    return Base.prototype.verify = function() {}, Base;
}(A);
export { Base as default };
