"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function __export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
__export(exports, {
    render: function() {
        return _customRender.customRender;
    }
});
var _interopRequireWildcardMjs = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _customRender = require("./customRender");
_re_export(exports, require("@testing-library/react"));
