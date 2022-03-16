import * as swcHelpers from "@swc/helpers";
var _name = /*#__PURE__*/ new WeakMap();
var Animal = /*#__PURE__*/ function() {
    "use strict";
    function Animal(name) {
        swcHelpers.classCallCheck(this, Animal);
        swcHelpers.classPrivateFieldInit(this, _name, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateFieldSet(this, _name, name);
    }
    var _proto = Animal.prototype;
    _proto.noise = function noise() {
        return swcHelpers.classPrivateFieldGet(this, _name).toUpperCase();
    };
    return Animal;
}();
