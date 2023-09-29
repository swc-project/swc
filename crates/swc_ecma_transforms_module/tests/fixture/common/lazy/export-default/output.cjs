"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    bar: function() {
        return _bar().default;
    },
    default: function() {
        return _foo().default;
    },
    foo: function() {
        return _foo().default;
    }
});
function _foo() {
    const data = /*#__PURE__*/ _interop_require_default(require("foo"));
    _foo = function() {
        return data;
    };
    return data;
}
function _bar() {
    const data = /*#__PURE__*/ _interop_require_default(require("bar"));
    _bar = function() {
        return data;
    };
    return data;
}
