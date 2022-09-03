//// [mod1.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
exports.Bar = function _class() {
    "use strict";
    _class_call_check(this, _class);
}, module.exports = {
    Baz: function Baz() {
        "use strict";
        _class_call_check(this, Baz);
    }
};
var Qux = 2;
exports.Quid = 2, module.exports = {
    Quack: 2
};
//// [use.js]
var b, bb, mod = require("./mod1.js"), bbb = new mod.Baz();
