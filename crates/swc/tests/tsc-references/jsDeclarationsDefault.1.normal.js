//// [index1.js]
export default 12;
//// [index2.js]
export default function foo() {
    return foo;
}
export var x = foo;
export { foo as bar };
//// [index3.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
    this.a = /** @type {Foo} */ null;
};
export { Foo as default };
export var X = Foo;
export { Foo as Bar };
//// [index4.js]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import Fab from "./index3";
var Bar = /*#__PURE__*/ function(Fab) {
    "use strict";
    _inherits(Bar, Fab);
    function Bar() {
        _class_call_check(this, Bar);
        var _this;
        _this = _call_super(this, Bar, arguments), _this.x = /** @type {Bar} */ null;
        return _this;
    }
    return Bar;
}(Fab);
export default Bar;
//// [index5.js]
// merge type alias and const (OK)
export default 12; /**
 * @typedef {string | number} default
 */ 
//// [index6.js]
// merge type alias and function (OK)
export default function func() {}
 /**
 * @typedef {string | number} default
 */ 
