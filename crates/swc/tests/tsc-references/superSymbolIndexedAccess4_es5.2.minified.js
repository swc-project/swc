import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var symbol = Symbol.for("myThing"), Bar = function() {
    "use strict";
    function Bar() {
        _class_call_check(this, Bar);
    }
    return Bar.prototype[symbol] = function() {
        return _get(_get_prototype_of(Bar.prototype), symbol, this).call(this);
    }, Bar;
}();
