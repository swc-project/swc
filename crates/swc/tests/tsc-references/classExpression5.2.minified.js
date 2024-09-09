//// [classExpression5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new (/*#__PURE__*/ function() {
    function _class() {
        _class_call_check(this, _class);
    }
    return _class.prototype.hi = function() {
        return "Hi!";
    }, _class;
}())().hi();
