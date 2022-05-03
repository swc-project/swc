"use strict";
var swcHelpers = require("@swc/helpers");
require("reflect-metadata");
var COL_KEY = Symbol("col");
var column = function() {
    return function(object, key) {
        Reflect.defineMetadata(COL_KEY, "value", object, key);
    };
};
var User = function User() {
    "use strict";
    swcHelpers.classCallCheck(this, User);
};
swcHelpers.__decorate([
    column(),
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", String)
], User.prototype, "currency", void 0);
