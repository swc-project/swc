//// [index.js]
export { };
//// [mixed.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
module.exports = {
    doTheThing: function(x) {
        return {
            x: "" + x
        };
    },
    ExportedThing: function ExportedThing() {
        "use strict";
        _class_call_check(this, ExportedThing), this.z = "ok";
    }
};
