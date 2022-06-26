import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
//@target: ES6
var symbol = Symbol.for("myThing");
var Bar = /*#__PURE__*/ function() {
    "use strict";
    function Bar() {
        _class_call_check(this, Bar);
    }
    var _proto = Bar.prototype;
    _proto[symbol] = function() {
        return _get(_get_prototype_of(Bar.prototype), symbol, this).call(this);
    };
    return Bar;
}();
