import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @filename: index4.js
import Fab from "./index3";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: index1.js
export default 12;
// @filename: index2.js
export default function foo() {
    return foo;
};
export var x = foo;
export { foo as bar };
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
    this.a = /** @type {Foo} */ (null);
};
// @filename: index3.js
export { Foo as default };
export var X = Foo;
export { Foo as Bar };
var Bar = /*#__PURE__*/ function(Fab) {
    "use strict";
    _inherits(Bar, Fab);
    var _super = _create_super(Bar);
    function Bar() {
        _class_call_check(this, Bar);
        var _this;
        _this = _super.apply(this, arguments);
        _this.x = /** @type {Bar} */ (null);
        return _this;
    }
    return Bar;
}(Fab);
export default Bar;
// @filename: index5.js
// merge type alias and const (OK)
export default 12;
/**
 * @typedef {string | number} default
 */ // @filename: index6.js
// merge type alias and function (OK)
export default function func() {};
