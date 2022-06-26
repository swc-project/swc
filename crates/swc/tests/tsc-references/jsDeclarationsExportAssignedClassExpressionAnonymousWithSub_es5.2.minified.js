import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
module.exports = function _class(p) {
    "use strict";
    _class_call_check(this, _class), this.t = 12 + p;
}, module.exports.Sub = function _class() {
    "use strict";
    _class_call_check(this, _class), this.instance = new module.exports(10);
};
