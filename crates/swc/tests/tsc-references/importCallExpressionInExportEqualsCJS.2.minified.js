//// [something.ts]
"use strict";
module.exports = 42;
//// [index.ts]
"use strict";
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
module.exports = async function() {
    await Promise.resolve().then(()=>_interop_require_wildcard._(require("./something")));
};
