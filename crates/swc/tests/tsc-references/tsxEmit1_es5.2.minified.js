import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
var p, SomeClass = function() {
    "use strict";
    function SomeClass() {
        _class_call_check(this, SomeClass);
    }
    return SomeClass.prototype.f = function() {
        [
            p
        ].concat(_to_consumable_array(p), [
            p
        ]), [
            p
        ].concat(_to_consumable_array(p), [
            p
        ]);
    }, SomeClass;
}();
