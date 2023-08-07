//// [bar.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
module.exports = function Bar() {
    _class_call_check(this, Bar);
};
//// [cls.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var Foo = function(Bar) {
    _inherits(Foo, Bar);
    var _super = _create_super(Foo);
    function Foo() {
        return _class_call_check(this, Foo), _super.apply(this, arguments);
    }
    return Foo;
}(require("./bar"));
module.exports = Foo, module.exports.Strings = {
    a: "A",
    b: "B"
};
