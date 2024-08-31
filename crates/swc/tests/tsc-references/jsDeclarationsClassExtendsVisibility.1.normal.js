//// [bar.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Bar = function Bar() {
    "use strict";
    _class_call_check(this, Bar);
};
module.exports = Bar;
//// [cls.js]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Bar = require("./bar");
var Strings = {
    a: "A",
    b: "B"
};
var Foo = /*#__PURE__*/ function(Bar) {
    "use strict";
    _inherits(Foo, Bar);
    function Foo() {
        _class_call_check(this, Foo);
        return _call_super(this, Foo, arguments);
    }
    return Foo;
}(Bar);
module.exports = Foo;
module.exports.Strings = Strings;
