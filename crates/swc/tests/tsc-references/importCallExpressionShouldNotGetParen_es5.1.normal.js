// @module: es2020
// @target: es6
// @noImplicitAny: true
var localeName = "zh-CN";
import("./locales/".concat(localeName, ".js")).then(function(bar) {
    var x = bar;
});
import("./locales/" + localeName + ".js").then(function(bar) {
    var x = bar;
});
