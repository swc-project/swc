// @allowJs: true
// @checkJs: true
// @noEmit: true
// @target: es2017
// @filename: file.js
// Error (good)
/** @type {function(): string} */ import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var a = function() {
    return 0;
};
// Error (good)
/** @type {function(): string} */ var b = function() {
    var _ref = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                0
            ];
        });
    });
    return function b() {
        return _ref.apply(this, arguments);
    };
}();
// No error (bad)
/** @type {function(): string} */ var c = function() {
    var _ref = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                0
            ];
        });
    });
    return function c() {
        return _ref.apply(this, arguments);
    };
}();
/** @type {function(function(): string): void} */ var f = function(p) {};
// Error (good)
f(/*#__PURE__*/ _async_to_generator(function() {
    return _ts_generator(this, function(_state) {
        return [
            2,
            0
        ];
    });
}));
