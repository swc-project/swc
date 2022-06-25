"use strict";
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default;
var _tsDecorate = require("@swc/helpers/lib/_ts_decorate.js").default;
var _tsMetadata = require("@swc/helpers/lib/_ts_metadata.js").default;
require("reflect-metadata");
var COL_KEY = Symbol("col");
var column = function() {
    return function(object, key) {
        Reflect.defineMetadata(COL_KEY, "value", object, key);
    };
};
var User = function User() {
    "use strict";
    _classCallCheck(this, User);
};
_tsDecorate([
    column(),
    _tsMetadata("design:type", String)
], User.prototype, "currency", void 0);
