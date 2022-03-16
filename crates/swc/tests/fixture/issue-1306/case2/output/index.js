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
    swcHelpers.createClass(Animal, [
        {
            key: "noise",
            value: function noise() {
                return swcHelpers.classPrivateFieldGet(this, _name).toUpperCase();
            }
        }
    ]);
    return Animal;
}();
