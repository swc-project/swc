import * as swcHelpers from "@swc/helpers";
// @checkJs: true
// @noEmit: true
// @Filename: bug24024.js
// #24024
var wat = require('./bug24024');
module.exports = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
module.exports.D = function D() {
    "use strict";
    swcHelpers.classCallCheck(this, D);
};
