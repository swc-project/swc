//// [bug24062.js]
// #24062
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
module.exports = {
    C: function C() {
        _class_call_check(this, C);
    }
};
