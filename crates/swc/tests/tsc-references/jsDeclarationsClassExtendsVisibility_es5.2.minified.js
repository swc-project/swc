import * as swcHelpers from "@swc/helpers";
var Bar = function() {
    swcHelpers.classCallCheck(this, Bar);
};
module.exports = Bar;
var Bar = require("./bar"), Foo = function(Bar1) {
    swcHelpers.inherits(Foo, Bar1);
    var _super = swcHelpers.createSuper(Foo);
    function Foo() {
        return swcHelpers.classCallCheck(this, Foo), _super.apply(this, arguments);
    }
    return Foo;
}(Bar);
module.exports = Foo, module.exports.Strings = {
    a: "A",
    b: "B"
};
