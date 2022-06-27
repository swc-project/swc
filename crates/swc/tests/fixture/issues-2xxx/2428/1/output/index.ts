"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _asyncToGenerator = require("@swc/helpers/lib/_async_to_generator.js").default;
const _tsDecorate = require("@swc/helpers/lib/_ts_decorate.js").default;
const _tsMetadata = require("@swc/helpers/lib/_ts_metadata.js").default;
const _tsParam = require("@swc/helpers/lib/_ts_param.js").default;
class Foo {
    fnName1(argName) {
        return _asyncToGenerator(function*() {})();
    }
    fnName2(argName = false) {
        return _asyncToGenerator(function*() {})();
    }
}
_tsDecorate([
    _tsParam(0, Arg("GraphQLArgName", {
        nullable: true
    })),
    _tsMetadata("design:type", Function),
    _tsMetadata("design:paramtypes", [
        Boolean
    ])
], Foo.prototype, "fnName1", null);
_tsDecorate([
    _tsParam(0, Arg("GraphQLArgName", {
        nullable: true
    })),
    _tsMetadata("design:type", Function),
    _tsMetadata("design:paramtypes", [
        Boolean
    ])
], Foo.prototype, "fnName2", null);
