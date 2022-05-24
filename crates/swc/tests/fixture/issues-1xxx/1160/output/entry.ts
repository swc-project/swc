"use strict";
var _ts_decorate = require("@swc/helpers/lib/_ts_decorate.js").default;
var _ts_metadata = require("@swc/helpers/lib/_ts_metadata.js").default;
var MyEnum;
(function(MyEnum) {
    MyEnum["x"] = "xxx";
    MyEnum["y"] = "yyy";
})(MyEnum || (MyEnum = {}));
class Xpto {
}
_ts_decorate([
    Decorator(),
    _ts_metadata("design:type", String)
], Xpto.prototype, "value", void 0);
function Decorator() {
    return function(...args) {};
}
