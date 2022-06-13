import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: bar.js
var Bar = function Bar() {
    "use strict";
    _class_call_check(this, Bar);
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
    _inherits(Foo, Bar1);
    var _super = _create_super(Foo);
    function Foo() {
        _class_call_check(this, Foo);
        return _super.apply(this, arguments);
    }
    return Foo;
}(Bar);
module.exports = Foo;
module.exports.Strings = Strings;
