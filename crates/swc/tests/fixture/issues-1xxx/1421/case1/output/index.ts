"use strict";
var _classCallCheckMjs = require("@swc/helpers/lib/_class_call_check.js");
var _tsDecorateMjs = require("@swc/helpers/lib/_ts_decorate.js");
var _tsMetadataMjs = require("@swc/helpers/lib/_ts_metadata.js");
require("reflect-metadata");
var COL_KEY = Symbol("col");
var column = function() {
    return function(object, key) {
        Reflect.defineMetadata(COL_KEY, "value", object, key);
    };
};
var User = function User() {
    "use strict";
    (0, _classCallCheckMjs.default)(this, User);
};
(0, _tsDecorateMjs.default)([
    column(),
    (0, _tsMetadataMjs.default)("design:type", String)
], User.prototype, "currency", void 0);
