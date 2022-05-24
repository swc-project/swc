import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
var symbol = Symbol.for("myThing"), _symbol = symbol, Bar = function() {
    "use strict";
    function Bar() {
        _class_call_check(this, Bar);
    }
    return Bar.prototype[_symbol] = function() {
        return _get(_get_prototype_of(Bar.prototype), symbol, this).call(this);
    }, Bar;
}();
