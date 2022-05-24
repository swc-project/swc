import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
//@target: ES6
var symbol = Symbol.for("myThing");
var _symbol = symbol;
var Bar = /*#__PURE__*/ function() {
    "use strict";
    function Bar() {
        _class_call_check(this, Bar);
    }
    var _proto = Bar.prototype;
    _proto[_symbol] = function() {
        return _get(_get_prototype_of(Bar.prototype), symbol, this).call(this);
    };
    return Bar;
}();
