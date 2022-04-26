"use strict";
var swcHelpers = require("@swc/helpers");
var joiful = swcHelpers.interopRequireWildcard(require("joiful"));
var _class, _descriptor, _dec, _dec1;
var Schema = ((_class = function Schema() {
    "use strict";
    swcHelpers.classCallCheck(this, Schema);
    swcHelpers.initializerDefineProperty(this, "id", _descriptor, this);
}) || _class, _dec = joiful.string().guid().required(), _dec1 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", String), _descriptor = swcHelpers.applyDecoratedDescriptor(_class.prototype, "id", [
    _dec,
    _dec1
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
}), _class);
