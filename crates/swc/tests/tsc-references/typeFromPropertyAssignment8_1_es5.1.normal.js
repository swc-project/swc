// @noEmit: true
// @allowJs: true
// @checkJs: true
// @target: esnext
// @lib: es6,dom
// @Filename: a.js
var my = my !== null && my !== void 0 ? my : {};
var _app;
my.app = (_app = my.app) !== null && _app !== void 0 ? _app : {};
my.app.Application = function() {
    var Application = function Application() {
    //...
    };
    return Application;
}();
my.app.Application();
// @Filename: b.js
var _min;
var min = (_min = window.min) !== null && _min !== void 0 ? _min : {};
var _app;
min.app = (_app = min.app) !== null && _app !== void 0 ? _app : {};
min.app.Application = function() {
    var Application = function Application() {
    //...
    };
    return Application;
}();
min.app.Application();
