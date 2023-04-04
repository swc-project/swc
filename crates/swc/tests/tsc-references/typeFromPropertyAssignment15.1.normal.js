//// [a.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Outer = {};
Outer.Inner = /*#__PURE__*/ function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
        this.x = 1;
    }
    var _proto = _class.prototype;
    _proto.m = function m() {};
    return _class;
}();
/** @type {Outer.Inner} */ var inner;
inner.x;
inner.m();
var inno = new Outer.Inner();
inno.x;
inno.m();
