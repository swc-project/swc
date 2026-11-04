"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _ts_rewrite_relative_import_extension = require("@swc/helpers/_/_ts_rewrite_relative_import_extension");
{
    Promise.resolve(_ts_rewrite_relative_import_extension._("" + "./foo.ts")).then((p)=>/*#__PURE__*/ _interop_require_wildcard._(require(p)));
    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./foo.js")));
}
