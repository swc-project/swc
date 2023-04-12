//// [bar.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Bar = function Bar() {
    "use strict";
    _class_call_check(this, Bar);
};
module.exports = Bar;
//// [cls.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var Bar = require("./bar");
var Strings = {
    a: "A",
    b: "B"
};
var Foo = /*#__PURE__*/ function(Bar) {
    "use strict";
    _inherits(Foo, Bar);
    var _super = _create_super(Foo);
    function Foo() {
        _class_call_check(this, Foo);
        return _super.apply(this, arguments);
    }
    return Foo;
}(Bar);
module.exports = Foo;
module.exports.Strings = Strings;
