//// [something.ts]
"use strict";
module.exports = 42;
//// [index.ts]
"use strict";
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
module.exports = async function() {
    await Promise.resolve().then(()=>_interopRequireWildcard(require("./something")));
};
