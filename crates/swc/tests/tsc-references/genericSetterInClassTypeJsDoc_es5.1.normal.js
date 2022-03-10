import * as swcHelpers from "@swc/helpers";
var _value = /*#__PURE__*/ new WeakMap();
// @target: esnext
// @lib: esnext
// @declaration: true
// @allowJs: true
// @checkJs: true
// @filename: genericSetterInClassTypeJsDoc.js
// @out: genericSetterInClassTypeJsDoc-out.js
/**
 * @template T
 */ var Box = /*#__PURE__*/ function() {
    "use strict";
    function Box(initialValue) {
        swcHelpers.classCallCheck(this, Box);
        swcHelpers.classPrivateFieldInit(this, _value, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateFieldSet(this, _value, initialValue);
    }
    swcHelpers.createClass(Box, [
        {
            key: "value",
            get: /** @type {T} */ function get() {
                return swcHelpers.classPrivateFieldGet(this, _value);
            },
            set: function set(value) {
                swcHelpers.classPrivateFieldSet(this, _value, value);
            }
        }
    ]);
    return Box;
}();
new Box(3).value = 3;
