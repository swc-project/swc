"use strict";
var _class_call_check = require("@swc/helpers/lib/_class_call_check.js").default;
var _ts_decorate = require("@swc/helpers/lib/_ts_decorate.js").default;
var _ts_metadata = require("@swc/helpers/lib/_ts_metadata.js").default;
require("reflect-metadata");
var COL_KEY = Symbol("col");
var column = function() {
    return function(object, key) {
        Reflect.defineMetadata(COL_KEY, "value", object, key);
    };
};
var User = function User() {
    "use strict";
    _class_call_check(this, User);
};
_ts_decorate([
    column(),
    _ts_metadata("design:type", String)
], User.prototype, "currency", void 0);
