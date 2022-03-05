"use strict";
var swcHelpers = require("@swc/helpers");
var _class, _dec, _dec1, _dec2, _dec3, _dec4, _dec5;
let Foo = ((_class = class Foo {
    fnName1(argName) {
        return swcHelpers.asyncToGenerator(function*() {})();
    }
    fnName2(argName = false) {
        return swcHelpers.asyncToGenerator(function*() {})();
    }
}) || _class, _dec = function(target, key) {
    return Arg('GraphQLArgName', {
        nullable: true
    })(target, key, 0);
}, _dec1 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec2 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
    Boolean
]), swcHelpers.applyDecoratedDescriptor(_class.prototype, "fnName1", [
    _dec,
    _dec1,
    _dec2
], Object.getOwnPropertyDescriptor(_class.prototype, "fnName1"), _class.prototype), _dec3 = function(target, key) {
    return Arg('GraphQLArgName', {
        nullable: true
    })(target, key, 0);
}, _dec4 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec5 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
    Boolean
]), swcHelpers.applyDecoratedDescriptor(_class.prototype, "fnName2", [
    _dec3,
    _dec4,
    _dec5
], Object.getOwnPropertyDescriptor(_class.prototype, "fnName2"), _class.prototype), _class);
