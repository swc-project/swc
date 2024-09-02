//// [bar.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
module.exports = function Bar() {
    _class_call_check(this, Bar);
};
//// [cls.js]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Foo = /*#__PURE__*/ function(Bar) {
    function Foo() {
        return _class_call_check(this, Foo), _call_super(this, Foo, arguments);
    }
    return _inherits(Foo, Bar), Foo;
}(require("./bar"));
module.exports = Foo, module.exports.Strings = {
    a: "A",
    b: "B"
};
