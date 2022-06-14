import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
// @allowJs: true
// @checkJs: true
// @noEmit: true
// @filename: index.js
function C1() {
    if (!_instanceof(this, C1)) return new C1();
    this.x = 1;
}
var c1_v1 = C1();
var c1_v2 = new C1();
var C2 = function() {
    if (!_instanceof(this, C2)) return new C2();
    this.x = 1;
};
var c2_v1 = C2();
var c2_v2 = new C2();
/** @class */ function C3() {
    if (!_instanceof(this, C3)) return new C3();
}
var c3_v1 = C3(); // error: @class tag requires 'new'
var c3_v2 = new C3();
/** @class */ var C4 = function() {
    if (!_instanceof(this, C4)) return new C4();
};
var c4_v1 = C4(); // error: @class tag requires 'new'
var c4_v2 = new C4();
var c5_v1;
c5_v1 = function f() {};
new c5_v1();
var c5_v2;
c5_v2 = function _class() {
    "use strict";
    _class_call_check(this, _class);
};
new c5_v2();
/** @class */ function C6() {
    this.functions = [
        function(x) {
            return x;
        },
        function(x) {
            return x + 1;
        },
        function(x) {
            return x - 1;
        }
    ];
}
var c6_v1 = new C6();
/**
 * @constructor
 * @param {number} num
 */ function C7(num) {}
var c7_v1 = new C7();
