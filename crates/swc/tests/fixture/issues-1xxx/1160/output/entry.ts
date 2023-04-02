"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _define_property = require("@swc/helpers/lib/_define_property.js").default;
const _ts_decorate = require("@swc/helpers/lib/_ts_decorate.js").default;
const _ts_metadata = require("@swc/helpers/lib/_ts_metadata.js").default;
var MyEnum;
(function(MyEnum) {
    MyEnum["x"] = "xxx";
    MyEnum["y"] = "yyy";
})(MyEnum || (MyEnum = {}));
class Xpto {
    constructor(){
        _define_property(this, "value", void 0);
    }
}
_ts_decorate([
    Decorator(),
    _ts_metadata("design:type", String)
], Xpto.prototype, "value", void 0);
function Decorator() {
    return function(...args) {};
}
