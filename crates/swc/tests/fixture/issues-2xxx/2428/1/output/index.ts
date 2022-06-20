"use strict";
var _asyncToGeneratorMjs = require("@swc/helpers/lib/_async_to_generator.js");
var _tsDecorateMjs = require("@swc/helpers/lib/_ts_decorate.js");
var _tsMetadataMjs = require("@swc/helpers/lib/_ts_metadata.js");
var _tsParamMjs = require("@swc/helpers/lib/_ts_param.js");
class Foo {
    fnName1(argName) {
        return (0, _asyncToGeneratorMjs.default)(function*() {})();
    }
    fnName2(argName = false) {
        return (0, _asyncToGeneratorMjs.default)(function*() {})();
    }
}
(0, _tsDecorateMjs.default)([
    (0, _tsParamMjs.default)(0, Arg("GraphQLArgName", {
        nullable: true
    })),
    (0, _tsMetadataMjs.default)("design:type", Function),
    (0, _tsMetadataMjs.default)("design:paramtypes", [
        Boolean
    ])
], Foo.prototype, "fnName1", null);
(0, _tsDecorateMjs.default)([
    (0, _tsParamMjs.default)(0, Arg("GraphQLArgName", {
        nullable: true
    })),
    (0, _tsMetadataMjs.default)("design:type", Function),
    (0, _tsMetadataMjs.default)("design:paramtypes", [
        Boolean
    ])
], Foo.prototype, "fnName2", null);
