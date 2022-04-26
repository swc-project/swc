"use strict";
var swcHelpers = require("@swc/helpers");
require("reflect-metadata");
var _class, _descriptor, _dec, _dec1;
var COL_KEY = Symbol("col");
var column = function() {
    return function(object, key) {
        Reflect.defineMetadata(COL_KEY, "value", object, key);
    };
};
var User = ((_class = function User() {
    "use strict";
    swcHelpers.classCallCheck(this, User);
    swcHelpers.initializerDefineProperty(this, "currency", _descriptor, this);
}) || _class, _dec = column(), _dec1 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", String), _descriptor = swcHelpers.applyDecoratedDescriptor(_class.prototype, "currency", [
    _dec,
    _dec1
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
}), _class);
