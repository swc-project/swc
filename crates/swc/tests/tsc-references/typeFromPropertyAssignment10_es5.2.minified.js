import * as swcHelpers from "@swc/helpers";
var x, Outer = Outer || {};
Outer.app = Outer.app || {}, Outer.app.SomeView = function() {}, Outer.app.Inner = function _class() {
    "use strict";
    swcHelpers.classCallCheck(this, _class), this.y = 12;
}, new Outer.app.Inner().y, Outer.app.statische = function(k) {
    return Math.pow(k, k);
}, Outer.app.Application = function() {
    var me = this;
    me.view = new Outer.app.SomeView();
}, new Outer.app.Application(), new Outer.app.Inner().y, x.y, Outer.app.statische(101);
