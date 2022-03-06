import * as swcHelpers from "@swc/helpers";
var _app, x, Outer = null != Outer ? Outer : {};
Outer.app = null !== (_app = Outer.app) && void 0 !== _app ? _app : {}, Outer.app.SomeView = function() {}, Outer.app.Inner = function _class() {
    "use strict";
    swcHelpers.classCallCheck(this, _class), this.y = 12;
}, new Outer.app.Inner().y, Outer.app.statische = function(k) {
    return Math.pow(k, k);
}, Outer.app.Application = function() {
    var me = this;
    me.view = new Outer.app.SomeView();
}, new Outer.app.Application(), new Outer.app.Inner().y, x.y, Outer.app.statische(101);
