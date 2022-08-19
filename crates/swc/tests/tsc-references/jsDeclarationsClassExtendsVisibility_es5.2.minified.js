import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Bar = function Bar() {
    "use strict";
    _class_call_check(this, Bar);
};
module.exports = Bar;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Foo = function(Bar) {
    "use strict";
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
