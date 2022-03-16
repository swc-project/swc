import * as swcHelpers from "@swc/helpers";
// @pretty: true
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: mod1.js
/** @typedef {number} Foo */ var Bar = function Bar() {
    "use strict";
    swcHelpers.classCallCheck(this, Bar);
};
// @Filename: mod2.js
var Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
} // should error
;
var Bar = 3;
