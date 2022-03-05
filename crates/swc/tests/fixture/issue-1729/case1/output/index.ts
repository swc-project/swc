import * as swcHelpers from "@swc/helpers";
function createConstructor(callback) {
    var klass;
    return function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        if (klass === undefined) {
            klass = callback();
        }
        return swcHelpers.construct(klass, swcHelpers.toConsumableArray(args));
    };
}
var constructor = createConstructor(function() {
    return function _class() {
        "use strict";
        swcHelpers.classCallCheck(this, _class);
    };
});
console.log(constructor());
