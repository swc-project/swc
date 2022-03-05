import * as swcHelpers from "@swc/helpers";
var Bar = function Bar() {
    "use strict";
    swcHelpers.classCallCheck(this, Bar);
};
module.exports = Bar;
// @filename: cls.js
var Bar = require("./bar");
var Strings = {
    a: "A",
    b: "B"
};
var Foo = /*#__PURE__*/ function(Bar1) {
    "use strict";
    swcHelpers.inherits(Foo, Bar1);
    var _super = swcHelpers.createSuper(Foo);
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
        return _super.apply(this, arguments);
    }
    return Foo;
}(Bar);
module.exports = Foo;
module.exports.Strings = Strings;
