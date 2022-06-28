"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default;
var _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _tsDecorate = require("@swc/helpers/lib/_ts_decorate.js").default;
var _tsMetadata = require("@swc/helpers/lib/_ts_metadata.js").default;
var _joiful = _interopRequireWildcard(require("joiful"));
var Schema = function Schema() {
    "use strict";
    _classCallCheck(this, Schema);
};
_tsDecorate([
    _joiful.string().guid().required(),
    _tsMetadata("design:type", String)
], Schema.prototype, "id", void 0);
