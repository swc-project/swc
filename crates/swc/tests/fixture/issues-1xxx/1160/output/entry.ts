var _define_property = require("@swc/helpers/_/_define_property");
var _ts_decorate = require("@swc/helpers/_/_ts_decorate");
var _ts_metadata = require("@swc/helpers/_/_ts_metadata");
var MyEnum = /*#__PURE__*/ function(MyEnum) {
    MyEnum["x"] = "xxx";
    MyEnum["y"] = "yyy";
    return MyEnum;
}(MyEnum || {});
class Xpto {
    constructor(){
        _define_property._(this, "value", void 0);
    }
}
_ts_decorate._([
    Decorator(),
    _ts_metadata._("design:type", String)
], Xpto.prototype, "value", void 0);
function Decorator() {
    return function(...args) {};
}
