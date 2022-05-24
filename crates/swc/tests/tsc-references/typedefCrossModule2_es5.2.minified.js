import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var Foo = function() {
    "use strict";
    _class_call_check(this, Foo);
};
exports.Bar = function _class() {
    "use strict";
    _class_call_check(this, _class);
}, module.exports = {
    Baz: function _class() {
        "use strict";
        _class_call_check(this, _class);
    }
}, exports.Quid = 2, module.exports = {
    Quack: 2
}, new (require("./mod1.js")).Baz();
