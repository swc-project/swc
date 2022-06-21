"use strict";
var _asyncToGeneratorMjs = require("@swc/helpers/lib/_async_to_generator.js").default;
var _tsDecorateMjs = require("@swc/helpers/lib/_ts_decorate.js").default;
var _tsMetadataMjs = require("@swc/helpers/lib/_ts_metadata.js").default;
var _tsParamMjs = require("@swc/helpers/lib/_ts_param.js").default;
class Foo {
    fnName1(argName) {
        return _asyncToGeneratorMjs(function*() {})();
    }
    fnName2(argName = false) {
        return _asyncToGeneratorMjs(function*() {})();
    }
}
_tsDecorateMjs([
    _tsParamMjs(0, Arg("GraphQLArgName", {
        nullable: true
    })),
    _tsMetadataMjs("design:type", Function),
    _tsMetadataMjs("design:paramtypes", [
        Boolean
    ])
], Foo.prototype, "fnName1", null);
_tsDecorateMjs([
    _tsParamMjs(0, Arg("GraphQLArgName", {
        nullable: true
    })),
    _tsMetadataMjs("design:type", Function),
    _tsMetadataMjs("design:paramtypes", [
        Boolean
    ])
], Foo.prototype, "fnName2", null);
