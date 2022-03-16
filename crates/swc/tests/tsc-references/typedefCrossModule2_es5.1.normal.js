import * as swcHelpers from "@swc/helpers";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: mod1.js
// error
/** @typedef {number} Foo */ var Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
} // should error
;
/** @typedef {number} Bar */ exports.Bar = function _class() {
    "use strict";
    swcHelpers.classCallCheck(this, _class);
};
/** @typedef {number} Baz */ module.exports = {
    Baz: function _class() {
        "use strict";
        swcHelpers.classCallCheck(this, _class);
    }
};
// ok
/** @typedef {number} Qux */ var Qux = 2;
/** @typedef {number} Quid */ exports.Quid = 2;
/** @typedef {number} Quack */ module.exports = {
    Quack: 2
};
// @Filename: use.js
var mod = require('./mod1.js');
/** @type {import("./mod1.js").Baz} */ var b;
/** @type {mod.Baz} */ var bb;
var bbb = new mod.Baz();
