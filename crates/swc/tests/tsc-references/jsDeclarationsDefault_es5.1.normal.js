import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
var Bar = /*#__PURE__*/ function(Fab1) {
    "use strict";
    _inherits(Bar, Fab1);
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
