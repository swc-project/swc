//// [neverType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function error(message) {
    throw Error(message);
}
error("Something failed"), function() {
    throw Error();
}(), error("Error callback");
