"use strict";
var swcHelpers = require("@swc/helpers");
class Foo {
    fnName1(argName) {
        return swcHelpers.asyncToGenerator(function*() {})();
    }
    fnName2(argName = false) {
        return swcHelpers.asyncToGenerator(function*() {})();
    }
}
swcHelpers.__decorate([
    function(target, key) {
        return Arg('GraphQLArgName', {
            nullable: true
        })(target, key, 0);
    },
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function),
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
        Boolean
    ])
], Foo.prototype, "fnName1", null);
swcHelpers.__decorate([
    function(target, key) {
        return Arg('GraphQLArgName', {
            nullable: true
        })(target, key, 0);
    },
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function),
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
        Boolean
    ])
], Foo.prototype, "fnName2", null);
