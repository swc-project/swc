//// [index.js]
export { };
//// [mixed.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function doTheThing(x) {
    return {
        x: "" + x
    };
}
var ExportedThing = function ExportedThing() {
    "use strict";
    _class_call_check(this, ExportedThing), this.z = "ok";
};
module.exports = {
    doTheThing: doTheThing,
    ExportedThing: ExportedThing
};
var LocalThing = function LocalThing() {
    "use strict";
    _class_call_check(this, LocalThing), this.y = "ok";
};
