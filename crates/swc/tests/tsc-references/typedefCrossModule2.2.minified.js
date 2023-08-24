//// [mod1.js]
// error
/** @typedef {number} Foo */ import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
/** @typedef {number} Bar */ exports.Bar = function _class() {
    _class_call_check(this, _class);
}, /** @typedef {number} Baz */ module.exports = {
    Baz: function Baz() {
        _class_call_check(this, Baz);
    }
}, /** @typedef {number} Quid */ exports.Quid = 2, /** @typedef {number} Quack */ module.exports = {
    Quack: 2
};
//// [use.js]
new (require("./mod1.js")).Baz();
