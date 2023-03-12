"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _defineProperty = require("@swc/helpers/lib/_define_property.js").default;
const _tsDecorate = require("@swc/helpers/lib/_ts_decorate.js").default;
const _tsMetadata = require("@swc/helpers/lib/_ts_metadata.js").default;
var MyEnum;
(function(MyEnum) {
    MyEnum["x"] = "xxx";
    MyEnum["y"] = "yyy";
})(MyEnum || (MyEnum = {}));
class Xpto {
    constructor(){
        _defineProperty(this, "value", void 0);
    }
}
_tsDecorate([
    Decorator(),
    _tsMetadata("design:type", String)
], Xpto.prototype, "value", void 0);
function Decorator() {
    return function(...args) {};
}
