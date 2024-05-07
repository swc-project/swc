var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _construct = require("@swc/helpers/_/_construct");
var _to_consumable_array = require("@swc/helpers/_/_to_consumable_array");
function createConstructor(callback) {
    var klass;
    return function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        if (klass === undefined) {
            klass = callback();
        }
        return _construct._(klass, _to_consumable_array._(args));
    };
}
var constructor = createConstructor(function() {
    return function _class() {
        "use strict";
        _class_call_check._(this, _class);
    };
});
console.log(constructor());
