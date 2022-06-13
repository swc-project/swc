import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @allowJs: true
// @checkJs: true
// @outDir: /out
// @lib: es6
// @declaration: true
// @filename: index.js
export var Super = function Super(firstArg, secondArg) {
    "use strict";
    _class_call_check(this, Super);
};
export var Sub = /*#__PURE__*/ function(Super) {
    "use strict";
    _inherits(Sub, Super);
    var _super = _create_super(Sub);
    function Sub() {
        _class_call_check(this, Sub);
        return _super.call(this, "first", "second");
    }
    return Sub;
}(Super);
