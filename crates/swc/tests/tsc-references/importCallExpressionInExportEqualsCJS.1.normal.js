//// [something.ts]
"use strict";
module.exports = 42;
//// [index.ts]
"use strict";
const _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
module.exports = async function() {
    const something = await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./something")));
};
