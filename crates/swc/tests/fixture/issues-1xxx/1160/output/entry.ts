"use strict";
var _tsDecorateMjs = require("@swc/helpers/lib/_ts_decorate.js").default;
var _tsMetadataMjs = require("@swc/helpers/lib/_ts_metadata.js").default;
var MyEnum;
(function(MyEnum) {
    MyEnum["x"] = "xxx";
    MyEnum["y"] = "yyy";
})(MyEnum || (MyEnum = {}));
class Xpto {
}
_tsDecorateMjs([
    Decorator(),
    _tsMetadataMjs("design:type", String)
], Xpto.prototype, "value", void 0);
function Decorator() {
    return function(...args) {};
}
