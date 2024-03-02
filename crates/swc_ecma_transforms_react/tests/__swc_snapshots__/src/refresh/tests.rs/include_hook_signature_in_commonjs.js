"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return App;
    }
});
var _hooks = require("./hooks");
var _foo = /*#__PURE__*/ _interop_require_default(require("./foo"));
var _s = $RefreshSig$();
function App() {
    _s();
    const bar = (0, _hooks.useFancyState)();
    const foo = (0, _foo.default)();
    return <h1>{bar}</h1>;
}
_s(App, "useFancyState{bar}\nuseFoo{foo}", false, function() {
    return [
        _hooks.useFancyState,
        _foo.default
    ];
});
_c = App;
var _c;
$RefreshReg$(_c, "App");
