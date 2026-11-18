"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _define_property = require("@swc/helpers/_/_define_property");
var _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
var _ts_decorate = require("@swc/helpers/_/_ts_decorate");
var _ts_metadata = require("@swc/helpers/_/_ts_metadata");
var _joiful = /*#__PURE__*/ _interop_require_wildcard._(require("joiful"));
var Schema = function Schema() {
    "use strict";
    _class_call_check._(this, Schema);
    _define_property._(this, "id", void 0);
};
_ts_decorate._([
    _joiful.string().guid().required(),
    _ts_metadata._("design:type", String)
], Schema.prototype, "id", void 0);
