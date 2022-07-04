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
    default: ()=>_foo().default,
    foo: ()=>_foo().default,
    bar: ()=>_bar().default
});
function _foo() {
    const data = /*#__PURE__*/ _interopRequireDefault(require("foo"));
    _foo = function() {
        return data;
    };
    return data;
}
function _bar() {
    const data = /*#__PURE__*/ _interopRequireDefault(require("bar"));
    _bar = function() {
        return data;
    };
    return data;
}
