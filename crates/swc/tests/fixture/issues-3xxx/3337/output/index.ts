"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _class_call_check = require("@swc/helpers/lib/_class_call_check.js").default;
var _define_property = require("@swc/helpers/lib/_define_property.js").default;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _ts_decorate = require("@swc/helpers/lib/_ts_decorate.js").default;
var _ts_metadata = require("@swc/helpers/lib/_ts_metadata.js").default;
var _joiful = /*#__PURE__*/ _interop_require_wildcard(require("joiful"));
var Schema = function Schema() {
    "use strict";
    _class_call_check(this, Schema);
    _define_property(this, "id", void 0);
};
_ts_decorate([
    _joiful.string().guid().required(),
    _ts_metadata("design:type", String)
], Schema.prototype, "id", void 0);
