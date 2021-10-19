import { jsx as _jsx } from "preact/jsx-runtime";
import { createElement as _createElement } from "react";
import "./preact";
function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {
        }, ownKeys = Object.keys(source);
        "function" == typeof Object.getOwnPropertySymbols && (ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }))), ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
const props = {
    answer: 42
};
_jsx("div", _objectSpread({
}, props, {
    children: "text"
}), "foo"), _createElement("div", _objectSpread({
}, props, {
    key: "bar",
    children: "text"
}));
const props2 = {
    answer: 42
};
_jsx("div", _objectSpread({
}, props2, {
    children: "text"
}), "foo"), _createElement("div", _objectSpread({
}, props2, {
    key: "bar",
    children: "text"
}));
