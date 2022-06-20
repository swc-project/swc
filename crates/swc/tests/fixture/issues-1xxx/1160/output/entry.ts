"use strict";
var _tsDecorateMjs = require("@swc/helpers/lib/_ts_decorate.js");
var _tsMetadataMjs = require("@swc/helpers/lib/_ts_metadata.js");
var MyEnum;
(function(MyEnum) {
    MyEnum["x"] = "xxx";
    MyEnum["y"] = "yyy";
})(MyEnum || (MyEnum = {}));
class Xpto {
}
(0, _tsDecorateMjs.default)([
    Decorator(),
    (0, _tsMetadataMjs.default)("design:type", String)
], Xpto.prototype, "value", void 0);
function Decorator() {
    return function(...args) {};
}
