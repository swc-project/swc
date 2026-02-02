//// [bug24024.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
// #24024
var wat = require('./bug24024');
module.exports = function C() {
    "use strict";
    _class_call_check(this, C);
};
module.exports.D = function D() {
    "use strict";
    _class_call_check(this, D);
};
