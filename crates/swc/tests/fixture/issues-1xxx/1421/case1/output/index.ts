"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _ts_decorate = require("@swc/helpers/_/_ts_decorate");
var _ts_metadata = require("@swc/helpers/_/_ts_metadata");
require("reflect-metadata");
var COL_KEY = Symbol("col");
var column = function() {
    return function(object, key) {
        Reflect.defineMetadata(COL_KEY, "value", object, key);
    };
};
var User = function User() {
    "use strict";
    _class_call_check._(this, User);
};
_ts_decorate._([
    column(),
    _ts_metadata._("design:type", String)
], User.prototype, "currency", void 0);
