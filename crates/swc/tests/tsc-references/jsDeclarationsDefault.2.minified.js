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
    _class_call_check(this, Foo), this.a = /** @type {Foo} */ null;
};
export var X = Foo;
export { Foo as default, Foo as Bar };
//// [index4.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import Fab from "./index3";
var Bar = function(Fab) {
    _inherits(Bar, Fab);
    var _super = _create_super(Bar);
    function Bar() {
        var _this;
        return _class_call_check(this, Bar), _this = _super.apply(this, arguments), _this.x = /** @type {Bar} */ null, _this;
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
