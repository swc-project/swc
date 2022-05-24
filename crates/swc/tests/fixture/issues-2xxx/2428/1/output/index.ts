"use strict";
var _async_to_generator = require("@swc/helpers/lib/_async_to_generator.js").default;
var _ts_decorate = require("@swc/helpers/lib/_ts_decorate.js").default;
var _ts_metadata = require("@swc/helpers/lib/_ts_metadata.js").default;
var _ts_param = require("@swc/helpers/lib/_ts_param.js").default;
class Foo {
    fnName1(argName) {
        return _async_to_generator(function*() {})();
    }
    fnName2(argName = false) {
        return _async_to_generator(function*() {})();
    }
}
_ts_decorate([
    _ts_param(0, Arg("GraphQLArgName", {
        nullable: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Boolean
    ])
], Foo.prototype, "fnName1", null);
_ts_decorate([
    _ts_param(0, Arg("GraphQLArgName", {
        nullable: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Boolean
    ])
], Foo.prototype, "fnName2", null);
