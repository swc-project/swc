export { };
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var ExportedThing = function ExportedThing() {
    "use strict";
    _class_call_check(this, ExportedThing), this.z = "ok";
};
module.exports = {
    doTheThing: function(x) {
        return {
            x: "" + x
        };
    },
    ExportedThing: ExportedThing
};
