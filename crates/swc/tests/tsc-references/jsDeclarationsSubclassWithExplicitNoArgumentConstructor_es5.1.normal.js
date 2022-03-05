import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @outDir: /out
// @lib: es6
// @declaration: true
// @filename: index.js
export var Super = function Super(firstArg, secondArg) {
    "use strict";
    swcHelpers.classCallCheck(this, Super);
};
export var Sub = /*#__PURE__*/ function(Super) {
    "use strict";
    swcHelpers.inherits(Sub, Super);
    var _super = swcHelpers.createSuper(Sub);
    function Sub() {
        swcHelpers.classCallCheck(this, Sub);
        return _super.call(this, 'first', 'second');
    }
    return Sub;
}(Super);
