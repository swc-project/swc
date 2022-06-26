import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
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
