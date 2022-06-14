import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @target: esnext
// @Filename: module.js
var Outer = Outer !== null && Outer !== void 0 ? Outer : {};
var _app;
Outer.app = (_app = Outer.app) !== null && _app !== void 0 ? _app : {};
// @Filename: someview.js
Outer.app.SomeView = function() {
    var SomeView = function SomeView() {
        var me = this;
    };
    return SomeView;
}();
Outer.app.Inner = function _class() {
    "use strict";
    _class_call_check(this, _class);
    /** @type {number} */ this.y = 12;
};
var example = new Outer.app.Inner();
example.y;
/** @param {number} k */ Outer.app.statische = function(k) {
    return Math.pow(k, k);
};
// @Filename: application.js
Outer.app.Application = function() {
    /**
     * Application main class.
     * Will be instantiated & initialized by HTML page
     */ var Application = function Application() {
        var me = this;
        me.view = new Outer.app.SomeView();
    };
    return Application;
}();
// @Filename: main.js
var app = new Outer.app.Application();
var inner = new Outer.app.Inner();
inner.y;
/** @type {Outer.app.Inner} */ var x;
x.y;
Outer.app.statische(101); // Infinity, duh
