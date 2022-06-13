import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Bar = function() {
    "use strict";
    _class_call_check(this, Bar);
};
module.exports = Bar;
var Bar = require("./bar"), Foo = function(Bar1) {
    "use strict";
    _inherits(Foo, Bar1);
    var _super = _create_super(Foo);
    function Foo() {
        return _class_call_check(this, Foo), _super.apply(this, arguments);
    }
    return Foo;
}(Bar);
module.exports = Foo, module.exports.Strings = {
    a: "A",
    b: "B"
};
