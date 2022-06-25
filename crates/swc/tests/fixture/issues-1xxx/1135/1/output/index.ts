"use strict";
function _tsDecorate() {
    const data = require("@swc/helpers/lib/_ts_decorate.js").default;
    _tsDecorate = function() {
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
_tsDecorate()([
    _module().Class.Decorator()
], MyClass.prototype, "method", null);
