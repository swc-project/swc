"use strict";
Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("plain.js")));
Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./data.json")));
Promise.resolve(dynamicPath).then((p)=>/*#__PURE__*/ _interop_require_wildcard(require(p)));
Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("also-plain.js")));
