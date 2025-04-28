var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _ts_decorate = require("@swc/helpers/_/_ts_decorate");
var _ts_metadata = require("@swc/helpers/_/_ts_metadata");
var _ts_param = require("@swc/helpers/_/_ts_param");
class Foo {
    fnName1(argName) {
        return _async_to_generator._(function*() {})();
    }
    fnName2(argName = false) {
        return _async_to_generator._(function*() {})();
    }
}
_ts_decorate._([
    _ts_param._(0, Arg("GraphQLArgName", {
        nullable: true
    })),
    _ts_metadata._("design:type", Function),
    _ts_metadata._("design:paramtypes", [
        Boolean
    ]),
    _ts_metadata._("design:returntype", Promise)
], Foo.prototype, "fnName1", null);
_ts_decorate._([
    _ts_param._(0, Arg("GraphQLArgName", {
        nullable: true
    })),
    _ts_metadata._("design:type", Function),
    _ts_metadata._("design:paramtypes", [
        Boolean
    ]),
    _ts_metadata._("design:returntype", Promise)
], Foo.prototype, "fnName2", null);
