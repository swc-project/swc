import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
