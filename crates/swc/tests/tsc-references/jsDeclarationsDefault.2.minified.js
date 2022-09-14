//// [index1.js]
export default 12;
//// [index2.js]
export default function foo() {
    return foo;
}
export var x = foo;
export { foo as bar };
//// [index3.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo), this.a = null;
};
export var X = Foo;
export { Foo as default, Foo as Bar };
//// [index4.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import Fab from "./index3";
var Bar = function(Fab) {
    "use strict";
    _inherits(Bar, Fab);
    var _super = _create_super(Bar);
    function Bar() {
        var _this;
        return _class_call_check(this, Bar), _this = _super.apply(this, arguments), _this.x = null, _this;
    }
    return Bar;
}(Fab);
export default Bar;
//// [index5.js]
export default 12;
//// [index6.js]
export default function func() {}
