//// [index.js]
export { };
//// [mixed.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
module.exports = {
    doTheThing: function(x) {
        return {
            x: "" + x
        };
    },
    ExportedThing: function ExportedThing() {
        _class_call_check(this, ExportedThing), this.z = "ok";
    }
};
