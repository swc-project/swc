//// [reExportJsFromTs.ts]
//// [/lib/constants.js]
module.exports = {
    str: 'x'
};
//// [/src/constants.ts]
import * as tsConstants from "../lib/constants";
export { tsConstants };
