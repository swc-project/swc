var _define_property = require("@swc/helpers/_/_define_property");
var _ts_decorate = require("@swc/helpers/_/_ts_decorate");
class A {
    constructor(){
        _define_property._(this, "a", true);
        _define_property._(this, "b", false);
    }
}
_define_property._(A, "c", 1);
_ts_decorate._([
    observable
], A.prototype, "a", void 0);
_ts_decorate._([
    foo
], A, "c", void 0);
