//// [classExpression5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new (function() {
    function _class() {
        _class_call_check(this, _class);
    }
    var _proto = _class.prototype;
    return _proto.hi = function() {
        return "Hi!";
    }, _class;
}())().hi();
