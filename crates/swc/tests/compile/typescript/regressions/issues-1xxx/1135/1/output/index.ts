"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _ts_decorate() {
    const data = require("@swc/helpers/_/_ts_decorate");
    _ts_decorate = function() {
        return data;
    };
    return data;
}
function _module() {
    const data = require("module");
    _module = function() {
        return data;
    };
    return data;
}
class MyClass extends _module().Class {
    async method() {}
}
_ts_decorate()._([
    _module().Class.Decorator()
], MyClass.prototype, "method", null);
