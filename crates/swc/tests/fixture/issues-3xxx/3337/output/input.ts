"use strict";
var _classCallCheckMjs = require("@swc/helpers/lib/_class_call_check.js").default;
var _interopRequireWildcardMjs = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _tsDecorateMjs = require("@swc/helpers/lib/_ts_decorate.js").default;
var _tsMetadataMjs = require("@swc/helpers/lib/_ts_metadata.js").default;
var _joiful = _interopRequireWildcardMjs(require("joiful"));
var Schema = function Schema() {
    "use strict";
    _classCallCheckMjs(this, Schema);
};
_tsDecorateMjs([
    _joiful.string().guid().required(),
    _tsMetadataMjs("design:type", String)
], Schema.prototype, "id", void 0);
