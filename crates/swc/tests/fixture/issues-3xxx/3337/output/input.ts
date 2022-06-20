"use strict";
var _classCallCheckMjs = require("@swc/helpers/lib/_class_call_check.js");
var _interopRequireWildcardMjs = require("@swc/helpers/lib/_interop_require_wildcard.js");
var _tsDecorateMjs = require("@swc/helpers/lib/_ts_decorate.js");
var _tsMetadataMjs = require("@swc/helpers/lib/_ts_metadata.js");
var _joiful = (0, _interopRequireWildcardMjs.default)(require("joiful"));
var Schema = function Schema() {
    "use strict";
    (0, _classCallCheckMjs.default)(this, Schema);
};
(0, _tsDecorateMjs.default)([
    _joiful.string().guid().required(),
    (0, _tsMetadataMjs.default)("design:type", String)
], Schema.prototype, "id", void 0);
