import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: lib.js
/**
 * @param {string} a
 */ function bar(a) {
    return a + a;
}
var SomeClass = /*#__PURE__*/ function() {
    "use strict";
    function SomeClass() {
        swcHelpers.classCallCheck(this, SomeClass);
    }
    var _proto = SomeClass.prototype;
    _proto.a = function a() {
        return 1;
    };
    return SomeClass;
}();
module.exports = {
    bar: bar,
    SomeClass: SomeClass
};
// @filename: main.js
var ref = require("./lib"), SomeClass = ref.SomeClass, Another = ref.SomeClass;
module.exports = {
    SomeClass: SomeClass,
    Another: Another
};
