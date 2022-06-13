import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _construct from "@swc/helpers/src/_construct.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
function createConstructor(callback) {
    var klass;
    return function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        if (klass === undefined) {
            klass = callback();
        }
        return _construct(klass, _to_consumable_array(args));
    };
}
var constructor = createConstructor(function() {
    return function _class() {
        "use strict";
        _class_call_check(this, _class);
    };
});
console.log(constructor());
