//// [classExpression5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new (/*#__PURE__*/ function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
    }
    var _proto = _class.prototype;
    _proto.hi = function hi() {
        return "Hi!";
    };
    return _class;
}())().hi();
