"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _define_property = require("@swc/helpers/_/_define_property");
const _ts_decorate = require("@swc/helpers/_/_ts_decorate");
const _ts_metadata = require("@swc/helpers/_/_ts_metadata");
var MyEnum;
(function(MyEnum) {
    MyEnum["x"] = "xxx";
    MyEnum["y"] = "yyy";
})(MyEnum || (MyEnum = {}));
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
