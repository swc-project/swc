//// [mod1.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
exports.Bar = function _class() {
    _class_call_check(this, _class);
}, module.exports = {
    Baz: function Baz() {
        _class_call_check(this, Baz);
    }
}, exports.Quid = 2, module.exports = {
    Quack: 2
};
//// [use.js]
new (require('./mod1.js')).Baz();
