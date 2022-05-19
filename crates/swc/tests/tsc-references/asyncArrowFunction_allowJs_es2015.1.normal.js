import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @noEmit: true
// @target: es2017
// @filename: file.js
// Error (good)
/** @type {function(): string} */ const a = ()=>0;
// Error (good)
/** @type {function(): string} */ const b = function() {
    var _ref = swcHelpers.asyncToGenerator(function*() {
        return 0;
    });
    return function b() {
        return _ref.apply(this, arguments);
    };
}();
// No error (bad)
/** @type {function(): string} */ const c = function() {
    var _ref = swcHelpers.asyncToGenerator(function*() {
        return 0;
    });
    return function c() {
        return _ref.apply(this, arguments);
    };
}();
/** @type {function(function(): string): void} */ const f = (p)=>{};
// Error (good)
f(swcHelpers.asyncToGenerator(function*() {
    return 0;
}));
