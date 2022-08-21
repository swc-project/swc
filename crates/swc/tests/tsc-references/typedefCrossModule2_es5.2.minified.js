import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
exports.Bar = function _class() {
    "use strict";
    _class_call_check(this, _class);
}, module.exports = {
    Baz: function Baz() {
        "use strict";
        _class_call_check(this, Baz);
    }
}, exports.Quid = 2, module.exports = {
    Quack: 2
};
new (require("./mod1.js")).Baz();
