import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Cls = function() {
    "use strict";
    _class_call_check(this, Cls), this.x = 12;
};
Cls.y = "ok";
export default Cls;
var C = function() {
    "use strict";
    _class_call_check(this, C);
};
var x = 12;
export { C as default, x as default };
