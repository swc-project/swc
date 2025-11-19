//// [mod1.js]
// error
/** @typedef {number} Foo */ import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
} // should error
;
/** @typedef {number} Bar */ exports.Bar = function _class() {
    "use strict";
    _class_call_check(this, _class);
};
/** @typedef {number} Baz */ module.exports = {
    Baz: function Baz() {
        "use strict";
        _class_call_check(this, Baz);
    }
};
// ok
/** @typedef {number} Qux */ var Qux = 2;
/** @typedef {number} Quid */ exports.Quid = 2;
/** @typedef {number} Quack */ module.exports = {
    Quack: 2
};
//// [use.js]
var mod = require('./mod1.js');
/** @type {import("./mod1.js").Baz} */ var b;
/** @type {mod.Baz} */ var bb;
var bbb = new mod.Baz();
